import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../modules/database/prisma.service';
import { 
  WorkflowDefinition, 
  WorkflowInstance, 
  WorkflowStep,
  WorkflowStatus,
  WorkflowStepStatus,
  WorkflowTriggerType,
  WorkflowStepType,
  ApprovalStatus,
  AutomationStatus
} from '@crm/database/generated';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface CreateWorkflowDefinitionDto {
  name: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  triggerConditions: any;
  steps: CreateWorkflowStepDto[];
}

export interface CreateWorkflowStepDto {
  name: string;
  description?: string;
  stepType: WorkflowStepType;
  position: number;
  configuration: any;
  conditions?: any;
  isRequired?: boolean;
  timeoutMinutes?: number;
  approvers?: CreateStepApproverDto[];
}

export interface CreateStepApproverDto {
  userId: string;
  approverType: 'REQUIRED' | 'OPTIONAL' | 'INFORMATIONAL';
  isRequired?: boolean;
  order?: number;
}

export interface StartWorkflowDto {
  workflowId: string;
  entityType: string;
  entityId: string;
  metadata?: any;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface WorkflowExecutionResult {
  success: boolean;
  message?: string;
  data?: any;
  nextStepId?: string;
}

@Injectable()
export class WorkflowService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  // Workflow Definition Management
  async createWorkflowDefinition(
    data: CreateWorkflowDefinitionDto,
    accountId: string,
    createdById: string
  ): Promise<WorkflowDefinition> {
    const workflow = await this.prisma.workflowDefinition.create({
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConditions: data.triggerConditions,
        accountId,
        createdById,
        steps: {
          create: data.steps.map(step => ({
            name: step.name,
            description: step.description,
            stepType: step.stepType,
            position: step.position,
            configuration: step.configuration,
            conditions: step.conditions,
            isRequired: step.isRequired ?? true,
            timeoutMinutes: step.timeoutMinutes,
            approvers: {
              create: step.approvers?.map(approver => ({
                userId: approver.userId,
                approverType: approver.approverType,
                isRequired: approver.isRequired ?? true,
                order: approver.order ?? 1
              })) || []
            }
          }))
        }
      },
      include: {
        steps: {
          include: {
            approvers: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    this.eventEmitter.emit('workflow.definition.created', { 
      workflowId: workflow.id, 
      accountId 
    });

    return workflow;
  }

  async getWorkflowDefinitions(accountId: string) {
    return this.prisma.workflowDefinition.findMany({
      where: { accountId },
      include: {
        steps: {
          include: {
            approvers: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        _count: {
          select: {
            instances: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getWorkflowDefinition(id: string, accountId: string) {
    const workflow = await this.prisma.workflowDefinition.findFirst({
      where: { id, accountId },
      include: {
        steps: {
          include: {
            approvers: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        instances: {
          include: {
            initiatedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            startedAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!workflow) {
      throw new NotFoundException('Workflow definition not found');
    }

    return workflow;
  }

  // Workflow Instance Management
  async startWorkflow(
    data: StartWorkflowDto,
    accountId: string,
    initiatedById: string
  ): Promise<WorkflowInstance> {
    const workflow = await this.prisma.workflowDefinition.findFirst({
      where: { 
        id: data.workflowId, 
        accountId,
        isActive: true 
      },
      include: {
        steps: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    if (!workflow) {
      throw new NotFoundException('Active workflow definition not found');
    }

    // Check if entity exists based on entityType
    await this.validateEntity(data.entityType, data.entityId, accountId);

    // Create workflow instance
    const instance = await this.prisma.workflowInstance.create({
      data: {
        workflowId: data.workflowId,
        entityType: data.entityType,
        entityId: data.entityId,
        status: WorkflowStatus.RUNNING,
        priority: data.priority || 'MEDIUM',
        metadata: data.metadata,
        accountId,
        initiatedById
      },
      include: {
        workflow: {
          include: {
            steps: {
              orderBy: {
                position: 'asc'
              }
            }
          }
        }
      }
    });

    // Start executing the first step
    if (workflow.steps.length > 0) {
      await this.executeStep(instance.id, workflow.steps[0].id);
    } else {
      // No steps, mark as completed
      await this.prisma.workflowInstance.update({
        where: { id: instance.id },
        data: { 
          status: WorkflowStatus.COMPLETED,
          completedAt: new Date()
        }
      });
    }

    this.eventEmitter.emit('workflow.instance.started', { 
      instanceId: instance.id,
      workflowId: data.workflowId,
      entityType: data.entityType,
      entityId: data.entityId,
      accountId 
    });

    return instance;
  }

  async executeStep(instanceId: string, stepId: string): Promise<WorkflowExecutionResult> {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflow: {
          include: {
            steps: {
              include: {
                approvers: {
                  include: {
                    user: true
                  }
                }
              },
              orderBy: {
                position: 'asc'
              }
            }
          }
        }
      }
    });

    if (!instance) {
      throw new NotFoundException('Workflow instance not found');
    }

    const step = instance.workflow.steps.find(s => s.id === stepId);
    if (!step) {
      throw new NotFoundException('Workflow step not found');
    }

    // Create step execution record
    const execution = await this.prisma.workflowStepExecution.create({
      data: {
        instanceId,
        stepId,
        status: WorkflowStepStatus.RUNNING
      }
    });

    try {
      let result: WorkflowExecutionResult;

      switch (step.stepType) {
        case WorkflowStepType.APPROVAL:
          result = await this.handleApprovalStep(instance, step, execution.id);
          break;
        case WorkflowStepType.TASK:
          result = await this.handleTaskStep(instance, step, execution.id);
          break;
        case WorkflowStepType.NOTIFICATION:
          result = await this.handleNotificationStep(instance, step, execution.id);
          break;
        case WorkflowStepType.EMAIL:
          result = await this.handleEmailStep(instance, step, execution.id);
          break;
        case WorkflowStepType.DATA_UPDATE:
          result = await this.handleDataUpdateStep(instance, step, execution.id);
          break;
        case WorkflowStepType.WEBHOOK:
          result = await this.handleWebhookStep(instance, step, execution.id);
          break;
        case WorkflowStepType.WAIT:
          result = await this.handleWaitStep(instance, step, execution.id);
          break;
        case WorkflowStepType.DECISION:
          result = await this.handleDecisionStep(instance, step, execution.id);
          break;
        default:
          throw new BadRequestException(`Unsupported step type: ${step.stepType}`);
      }

      // Update execution with result
      await this.prisma.workflowStepExecution.update({
        where: { id: execution.id },
        data: {
          status: result.success ? WorkflowStepStatus.COMPLETED : WorkflowStepStatus.FAILED,
          completedAt: new Date(),
          result: result.data
        }
      });

      // If successful and there's a next step, execute it
      if (result.success && result.nextStepId) {
        await this.executeStep(instanceId, result.nextStepId);
      } else if (result.success && !result.nextStepId) {
        // Workflow completed
        await this.completeWorkflow(instanceId);
      }

      return result;

    } catch (error) {
      // Update execution with error
      await this.prisma.workflowStepExecution.update({
        where: { id: execution.id },
        data: {
          status: WorkflowStepStatus.FAILED,
          completedAt: new Date(),
          errorMessage: error.message
        }
      });

      // Update instance status
      await this.prisma.workflowInstance.update({
        where: { id: instanceId },
        data: {
          status: WorkflowStatus.FAILED,
          errorMessage: error.message
        }
      });

      throw error;
    }
  }

  private async handleApprovalStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    // Create approval requests for all approvers
    const approvalRequests = await Promise.all(
      step.approvers.map(async (approver: any) => {
        return this.prisma.workflowApproval.create({
          data: {
            instanceId: instance.id,
            approverId: approver.userId,
            stepApproverId: approver.id,
            status: ApprovalStatus.PENDING
          }
        });
      })
    );

    // Emit notification events
    for (const approver of step.approvers) {
      this.eventEmitter.emit('workflow.approval.requested', {
        instanceId: instance.id,
        stepId: step.id,
        approverId: approver.userId,
        workflowName: instance.workflow.name,
        entityType: instance.entityType,
        entityId: instance.entityId
      });
    }

    // For approval steps, we don't immediately proceed to next step
    // The workflow will continue when approvals are completed
    return {
      success: true,
      message: 'Approval requests sent',
      data: { approvalRequests: approvalRequests.length }
    };
  }

  private async handleTaskStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    const config = step.configuration;
    const assigneeId = config.assigneeId;

    if (assigneeId) {
      // Create a task (you might want to integrate with your existing Task model)
      // For now, just assign the step execution
      await this.prisma.workflowStepExecution.update({
        where: { id: executionId },
        data: { assignedToId: assigneeId }
      });

      this.eventEmitter.emit('workflow.task.assigned', {
        instanceId: instance.id,
        stepId: step.id,
        assigneeId,
        taskTitle: step.name,
        taskDescription: step.description
      });
    }

    // Get next step
    const nextStep = this.getNextStep(instance.workflow.steps, step.position);
    
    return {
      success: true,
      message: 'Task created and assigned',
      nextStepId: nextStep?.id
    };
  }

  private async handleNotificationStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    const config = step.configuration;
    
    this.eventEmitter.emit('workflow.notification.send', {
      instanceId: instance.id,
      stepId: step.id,
      recipients: config.recipients || [],
      title: config.title || step.name,
      message: config.message || step.description,
      type: config.type || 'info'
    });

    const nextStep = this.getNextStep(instance.workflow.steps, step.position);
    
    return {
      success: true,
      message: 'Notification sent',
      nextStepId: nextStep?.id
    };
  }

  private async handleEmailStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    const config = step.configuration;
    
    this.eventEmitter.emit('workflow.email.send', {
      instanceId: instance.id,
      stepId: step.id,
      to: config.to || [],
      cc: config.cc || [],
      bcc: config.bcc || [],
      subject: config.subject || step.name,
      body: config.body || step.description,
      template: config.template
    });

    const nextStep = this.getNextStep(instance.workflow.steps, step.position);
    
    return {
      success: true,
      message: 'Email sent',
      nextStepId: nextStep?.id
    };
  }

  private async handleDataUpdateStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    const config = step.configuration;
    const { entityType, updateData } = config;

    // Perform data update based on entity type
    // This is a simplified implementation - you'd want more robust handling
    try {
      switch (entityType.toLowerCase()) {
        case 'enquiry':
          if (instance.entityType === 'Enquiry') {
            await this.prisma.enquiry.update({
              where: { id: instance.entityId },
              data: updateData
            });
          }
          break;
        case 'project':
          if (instance.entityType === 'Project') {
            await this.prisma.project.update({
              where: { id: instance.entityId },
              data: updateData
            });
          }
          break;
        // Add more entity types as needed
      }

      const nextStep = this.getNextStep(instance.workflow.steps, step.position);
      
      return {
        success: true,
        message: 'Data updated successfully',
        nextStepId: nextStep?.id
      };
    } catch (error) {
      return {
        success: false,
        message: `Data update failed: ${error.message}`
      };
    }
  }

  private async handleWebhookStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    const config = step.configuration;
    
    this.eventEmitter.emit('workflow.webhook.call', {
      instanceId: instance.id,
      stepId: step.id,
      url: config.url,
      method: config.method || 'POST',
      headers: config.headers || {},
      body: config.body || {
        workflowId: instance.workflowId,
        instanceId: instance.id,
        entityType: instance.entityType,
        entityId: instance.entityId
      }
    });

    const nextStep = this.getNextStep(instance.workflow.steps, step.position);
    
    return {
      success: true,
      message: 'Webhook called',
      nextStepId: nextStep?.id
    };
  }

  private async handleWaitStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    const config = step.configuration;
    const waitMinutes = config.waitMinutes || 60;

    // Schedule continuation after wait period
    setTimeout(async () => {
      const nextStep = this.getNextStep(instance.workflow.steps, step.position);
      if (nextStep) {
        await this.executeStep(instance.id, nextStep.id);
      } else {
        await this.completeWorkflow(instance.id);
      }
    }, waitMinutes * 60 * 1000);

    return {
      success: true,
      message: `Waiting for ${waitMinutes} minutes`
    };
  }

  private async handleDecisionStep(
    instance: any,
    step: any,
    executionId: string
  ): Promise<WorkflowExecutionResult> {
    const config = step.configuration;
    const conditions = config.conditions || [];

    // Evaluate conditions and determine next step
    for (const condition of conditions) {
      if (await this.evaluateCondition(condition, instance)) {
        const nextStepId = condition.nextStepId;
        return {
          success: true,
          message: 'Condition matched',
          nextStepId
        };
      }
    }

    // Default next step if no conditions match
    const nextStep = this.getNextStep(instance.workflow.steps, step.position);
    
    return {
      success: true,
      message: 'No conditions matched, proceeding to next step',
      nextStepId: nextStep?.id
    };
  }

  private getNextStep(steps: any[], currentPosition: number) {
    return steps.find(step => step.position === currentPosition + 1);
  }

  private async evaluateCondition(condition: any, instance: any): Promise<boolean> {
    // Simplified condition evaluation
    // In a real implementation, you'd want a more sophisticated expression evaluator
    const { field, operator, value } = condition;
    
    // Get entity data based on instance
    let entityData: any;
    try {
      switch (instance.entityType) {
        case 'Enquiry':
          entityData = await this.prisma.enquiry.findUnique({
            where: { id: instance.entityId }
          });
          break;
        case 'Project':
          entityData = await this.prisma.project.findUnique({
            where: { id: instance.entityId }
          });
          break;
        // Add more entity types
      }

      if (!entityData) return false;

      const fieldValue = entityData[field];

      switch (operator) {
        case 'equals':
          return fieldValue === value;
        case 'not_equals':
          return fieldValue !== value;
        case 'greater_than':
          return fieldValue > value;
        case 'less_than':
          return fieldValue < value;
        case 'contains':
          return String(fieldValue).includes(value);
        default:
          return false;
      }
    } catch (error) {
      console.error('Condition evaluation error:', error);
      return false;
    }
  }

  private async completeWorkflow(instanceId: string) {
    await this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: {
        status: WorkflowStatus.COMPLETED,
        completedAt: new Date()
      }
    });

    this.eventEmitter.emit('workflow.instance.completed', { instanceId });
  }

  private async validateEntity(entityType: string, entityId: string, accountId: string) {
    let exists = false;

    switch (entityType) {
      case 'Enquiry':
        exists = !!(await this.prisma.enquiry.findFirst({
          where: { id: entityId, accountId }
        }));
        break;
      case 'Project':
        exists = !!(await this.prisma.project.findFirst({
          where: { id: entityId, accountId }
        }));
        break;
      // Add more entity types as needed
    }

    if (!exists) {
      throw new NotFoundException(`${entityType} with ID ${entityId} not found`);
    }
  }

  // Approval Management
  async approveStep(approvalId: string, approverId: string, comments?: string) {
    const approval = await this.prisma.workflowApproval.findFirst({
      where: { 
        id: approvalId,
        approverId,
        status: ApprovalStatus.PENDING
      },
      include: {
        instance: {
          include: {
            workflow: {
              include: {
                steps: {
                  include: {
                    approvers: true
                  },
                  orderBy: {
                    position: 'asc'
                  }
                }
              }
            }
          }
        },
        stepApprover: {
          include: {
            step: true
          }
        }
      }
    });

    if (!approval) {
      throw new NotFoundException('Approval request not found or already processed');
    }

    // Update approval
    await this.prisma.workflowApproval.update({
      where: { id: approvalId },
      data: {
        status: ApprovalStatus.APPROVED,
        comments,
        approvedAt: new Date()
      }
    });

    // Check if all required approvals are complete
    await this.checkApprovalCompletion(approval.instance, approval.stepApprover.step);

    this.eventEmitter.emit('workflow.approval.approved', {
      approvalId,
      instanceId: approval.instanceId,
      stepId: approval.stepApprover.stepId,
      approverId
    });
  }

  async rejectStep(approvalId: string, approverId: string, comments?: string) {
    const approval = await this.prisma.workflowApproval.findFirst({
      where: { 
        id: approvalId,
        approverId,
        status: ApprovalStatus.PENDING
      }
    });

    if (!approval) {
      throw new NotFoundException('Approval request not found or already processed');
    }

    // Update approval
    await this.prisma.workflowApproval.update({
      where: { id: approvalId },
      data: {
        status: ApprovalStatus.REJECTED,
        comments,
        rejectedAt: new Date()
      }
    });

    // Fail the workflow instance
    await this.prisma.workflowInstance.update({
      where: { id: approval.instanceId },
      data: {
        status: WorkflowStatus.FAILED,
        errorMessage: `Approval rejected: ${comments || 'No reason provided'}`
      }
    });

    this.eventEmitter.emit('workflow.approval.rejected', {
      approvalId,
      instanceId: approval.instanceId,
      approverId,
      comments
    });
  }

  private async checkApprovalCompletion(instance: any, step: any) {
    const allApprovals = await this.prisma.workflowApproval.findMany({
      where: {
        instanceId: instance.id,
        stepApprover: {
          stepId: step.id
        }
      },
      include: {
        stepApprover: true
      }
    });

    // Check if all required approvals are complete
    const requiredApprovals = allApprovals.filter(a => a.stepApprover.isRequired);
    const completedRequired = requiredApprovals.filter(a => a.status === ApprovalStatus.APPROVED);

    if (completedRequired.length === requiredApprovals.length) {
      // All required approvals complete, proceed to next step
      const nextStep = this.getNextStep(instance.workflow.steps, step.position);
      
      if (nextStep) {
        await this.executeStep(instance.id, nextStep.id);
      } else {
        await this.completeWorkflow(instance.id);
      }
    }
  }

  // Instance Queries
  async getWorkflowInstances(accountId: string, filters?: any) {
    const where: any = { accountId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }
    if (filters?.workflowId) {
      where.workflowId = filters.workflowId;
    }

    return this.prisma.workflowInstance.findMany({
      where,
      include: {
        workflow: {
          select: {
            id: true,
            name: true
          }
        },
        initiatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        executions: {
          include: {
            step: {
              select: {
                id: true,
                name: true,
                stepType: true
              }
            }
          },
          orderBy: {
            startedAt: 'desc'
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
  }

  async getWorkflowInstance(id: string, accountId: string) {
    const instance = await this.prisma.workflowInstance.findFirst({
      where: { id, accountId },
      include: {
        workflow: {
          include: {
            steps: {
              orderBy: {
                position: 'asc'
              }
            }
          }
        },
        initiatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        executions: {
          include: {
            step: true,
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            startedAt: 'asc'
          }
        },
        approvals: {
          include: {
            approver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            stepApprover: {
              include: {
                step: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!instance) {
      throw new NotFoundException('Workflow instance not found');
    }

    return instance;
  }
}