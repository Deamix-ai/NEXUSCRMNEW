import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService, CreateWorkflowDefinitionDto, StartWorkflowDto } from './workflow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface WorkflowRequest extends Request {
  user: {
    id: string;
    accountId: string;
    role: string;
  };
}

@ApiTags('Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  // Workflow Definitions
  @Post('definitions')
  @ApiOperation({ summary: 'Create workflow definition' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Workflow definition created successfully' })
  async createWorkflowDefinition(
    @Body() createWorkflowDto: CreateWorkflowDefinitionDto,
    @Request() req: WorkflowRequest,
  ) {
    return this.workflowService.createWorkflowDefinition(
      createWorkflowDto,
      req.user.accountId,
      req.user.id
    );
  }

  @Get('definitions')
  @ApiOperation({ summary: 'Get all workflow definitions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workflow definitions retrieved successfully' })
  async getWorkflowDefinitions(@Request() req: WorkflowRequest) {
    return this.workflowService.getWorkflowDefinitions(req.user.accountId);
  }

  @Get('definitions/:id')
  @ApiOperation({ summary: 'Get workflow definition by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workflow definition retrieved successfully' })
  async getWorkflowDefinition(
    @Param('id') id: string,
    @Request() req: WorkflowRequest,
  ) {
    return this.workflowService.getWorkflowDefinition(id, req.user.accountId);
  }

  // Workflow Instances
  @Post('instances/start')
  @ApiOperation({ summary: 'Start workflow instance' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Workflow instance started successfully' })
  async startWorkflow(
    @Body() startWorkflowDto: StartWorkflowDto,
    @Request() req: WorkflowRequest,
  ) {
    return this.workflowService.startWorkflow(
      startWorkflowDto,
      req.user.accountId,
      req.user.id
    );
  }

  @Get('instances')
  @ApiOperation({ summary: 'Get workflow instances' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workflow instances retrieved successfully' })
  async getWorkflowInstances(
    @Request() req: WorkflowRequest,
    @Query('status') status?: string,
    @Query('entityType') entityType?: string,
    @Query('workflowId') workflowId?: string,
  ) {
    const filters = { status, entityType, workflowId };
    return this.workflowService.getWorkflowInstances(req.user.accountId, filters);
  }

  @Get('instances/:id')
  @ApiOperation({ summary: 'Get workflow instance by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workflow instance retrieved successfully' })
  async getWorkflowInstance(
    @Param('id') id: string,
    @Request() req: WorkflowRequest,
  ) {
    return this.workflowService.getWorkflowInstance(id, req.user.accountId);
  }

  @Post('instances/:id/steps/:stepId/execute')
  @ApiOperation({ summary: 'Execute workflow step' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workflow step executed successfully' })
  async executeStep(
    @Param('id') instanceId: string,
    @Param('stepId') stepId: string,
    @Request() req: WorkflowRequest,
  ) {
    return this.workflowService.executeStep(instanceId, stepId);
  }

  // Approvals
  @Post('approvals/:id/approve')
  @ApiOperation({ summary: 'Approve workflow step' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Step approved successfully' })
  async approveStep(
    @Param('id') approvalId: string,
    @Request() req: WorkflowRequest,
    @Body('comments') comments?: string,
  ) {
    return this.workflowService.approveStep(approvalId, req.user.id, comments);
  }

  @Post('approvals/:id/reject')
  @ApiOperation({ summary: 'Reject workflow step' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Step rejected successfully' })
  async rejectStep(
    @Param('id') approvalId: string,
    @Request() req: WorkflowRequest,
    @Body('comments') comments?: string,
  ) {
    return this.workflowService.rejectStep(approvalId, req.user.id, comments);
  }
}