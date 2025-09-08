import EmailService from './EmailService';
import { PrismaClient } from '@prisma/client';

interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: 'booking_created' | 'quote_sent' | 'project_completed' | 'customer_birthday' | 'quote_expired' | 'time_based';
    conditions?: Record<string, any>;
    delay?: number; // minutes
  };
  actions: Array<{
    type: 'send_email' | 'create_task' | 'update_status' | 'send_sms';
    parameters: Record<string, any>;
  }>;
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

class AutomationService {
  private emailService: EmailService;
  private prisma: PrismaClient;
  private rules: Map<string, AutomationRule>;

  constructor() {
    this.emailService = new EmailService();
    this.prisma = new PrismaClient();
    this.rules = new Map();
    this.loadRules();
  }

  private loadRules(): void {
    // Mock automation rules - in production, load from database
    const defaultRules: AutomationRule[] = [
      {
        id: 'booking_confirmation',
        name: 'Booking Confirmation',
        trigger: {
          type: 'booking_created',
        },
        actions: [
          {
            type: 'send_email',
            parameters: {
              templateId: 'booking_confirmation',
              to: '{{customer.email}}',
            },
          },
        ],
        isActive: true,
        triggerCount: 0,
      },
      {
        id: 'quote_follow_up',
        name: 'Quote Follow-up',
        trigger: {
          type: 'time_based',
          conditions: {
            afterDays: 3,
            entityType: 'quote',
            entityStatus: 'sent',
          },
        },
        actions: [
          {
            type: 'send_email',
            parameters: {
              templateId: 'quote_follow_up',
              to: '{{customer.email}}',
            },
          },
        ],
        isActive: true,
        triggerCount: 0,
      },
      {
        id: 'project_completion_survey',
        name: 'Project Completion Survey',
        trigger: {
          type: 'project_completed',
        },
        actions: [
          {
            type: 'send_email',
            parameters: {
              templateId: 'completion_survey',
              to: '{{customer.email}}',
            },
          },
          {
            type: 'create_task',
            parameters: {
              title: 'Follow up on completed project',
              assignedTo: '{{projectManager.id}}',
              dueDate: '{{now + 7 days}}',
            },
          },
        ],
        isActive: true,
        triggerCount: 0,
      },
      {
        id: 'birthday_campaign',
        name: 'Birthday Campaign',
        trigger: {
          type: 'customer_birthday',
        },
        actions: [
          {
            type: 'send_email',
            parameters: {
              templateId: 'birthday_offer',
              to: '{{customer.email}}',
            },
          },
        ],
        isActive: false,
        triggerCount: 0,
      },
      {
        id: 'quote_expiry_reminder',
        name: 'Quote Expiry Reminder',
        trigger: {
          type: 'time_based',
          conditions: {
            beforeDays: 2,
            entityType: 'quote',
            entityStatus: 'sent',
            checkField: 'validUntil',
          },
        },
        actions: [
          {
            type: 'send_email',
            parameters: {
              templateId: 'quote_expiry_reminder',
              to: '{{customer.email}}',
            },
          },
        ],
        isActive: true,
        triggerCount: 0,
      },
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  async triggerEvent(eventType: string, eventData: any): Promise<void> {
    console.log(`🎯 Automation trigger: ${eventType}`, eventData);

    for (const rule of this.rules.values()) {
      if (!rule.isActive) continue;

      if (rule.trigger.type === eventType) {
        if (this.shouldTrigger(rule, eventData)) {
          await this.executeRule(rule, eventData);
        }
      }
    }
  }

  private shouldTrigger(rule: AutomationRule, eventData: any): boolean {
    if (!rule.trigger.conditions) return true;

    // Check conditions based on rule type
    for (const [key, value] of Object.entries(rule.trigger.conditions)) {
      const eventValue = this.getNestedValue(eventData, key);
      if (eventValue !== value) {
        return false;
      }
    }

    return true;
  }

  private async executeRule(rule: AutomationRule, eventData: any): Promise<void> {
    try {
      console.log(`⚡ Executing automation rule: ${rule.name}`);

      if (rule.trigger.delay) {
        // Schedule for later execution
        setTimeout(() => {
          this.executeActions(rule.actions, eventData);
        }, rule.trigger.delay * 60 * 1000);
      } else {
        // Execute immediately
        await this.executeActions(rule.actions, eventData);
      }

      // Update trigger count and last triggered
      rule.triggerCount++;
      rule.lastTriggered = new Date();

      console.log(`✅ Automation rule executed: ${rule.name}`);
    } catch (error) {
      console.error(`❌ Failed to execute automation rule ${rule.name}:`, error);
    }
  }

  private async executeActions(actions: AutomationRule['actions'], eventData: any): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'send_email':
            await this.executeSendEmailAction(action.parameters, eventData);
            break;
          case 'create_task':
            await this.executeCreateTaskAction(action.parameters, eventData);
            break;
          case 'update_status':
            await this.executeUpdateStatusAction(action.parameters, eventData);
            break;
          case 'send_sms':
            await this.executeSendSmsAction(action.parameters, eventData);
            break;
          default:
            console.warn(`Unknown action type: ${action.type}`);
        }
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
  }

  private async executeSendEmailAction(parameters: any, eventData: any): Promise<void> {
    const emailData = {
      to: this.processTemplate(parameters.to, eventData),
      templateId: parameters.templateId,
      variables: this.extractVariables(eventData),
    };

    await this.emailService.sendEmail(emailData);
  }

  private async executeCreateTaskAction(parameters: any, eventData: any): Promise<void> {
    // Mock task creation - in production, integrate with task management system
    console.log('📋 Creating task:', {
      title: this.processTemplate(parameters.title, eventData),
      assignedTo: this.processTemplate(parameters.assignedTo, eventData),
      dueDate: this.processTemplate(parameters.dueDate, eventData),
    });
  }

  private async executeUpdateStatusAction(parameters: any, eventData: any): Promise<void> {
    // Mock status update - in production, update database
    console.log('🔄 Updating status:', parameters);
  }

  private async executeSendSmsAction(parameters: any, eventData: any): Promise<void> {
    // Mock SMS sending - in production, integrate with SMS service
    console.log('📱 Sending SMS:', {
      to: this.processTemplate(parameters.to, eventData),
      message: this.processTemplate(parameters.message, eventData),
    });
  }

  private processTemplate(template: string, data: any): string {
    return template.replace(/{{([^}]+)}}/g, (match, path) => {
      const value = this.getNestedValue(data, path.trim());
      return value || match;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  private extractVariables(eventData: any): Record<string, string> {
    // Extract common variables from event data
    const variables: Record<string, string> = {};

    if (eventData.customer) {
      variables.customerName = eventData.customer.name || '';
      variables.customerEmail = eventData.customer.email || '';
      variables.customerPhone = eventData.customer.phone || '';
    }

    if (eventData.booking) {
      variables.date = eventData.booking.scheduledDate ? 
        new Date(eventData.booking.scheduledDate).toLocaleDateString('en-GB') : '';
      variables.time = eventData.booking.scheduledDate ? 
        new Date(eventData.booking.scheduledDate).toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '';
      variables.serviceType = eventData.booking.serviceType || '';
      variables.address = eventData.booking.address || '';
    }

    if (eventData.project) {
      variables.projectTitle = eventData.project.title || '';
      variables.currentPhase = eventData.project.currentPhase || '';
      variables.progressPercentage = eventData.project.progressPercentage?.toString() || '0';
    }

    if (eventData.quote) {
      variables.totalCost = eventData.quote.totalCost?.toLocaleString() || '0';
      variables.quoteNumber = eventData.quote.number || '';
      variables.validUntil = eventData.quote.validUntil ? 
        new Date(eventData.quote.validUntil).toLocaleDateString('en-GB') : '';
    }

    return variables;
  }

  // Public methods for managing automation rules
  async createRule(rule: Omit<AutomationRule, 'id' | 'triggerCount'>): Promise<string> {
    const id = `rule_${Date.now()}`;
    const newRule: AutomationRule = {
      ...rule,
      id,
      triggerCount: 0,
    };

    this.rules.set(id, newRule);
    return id;
  }

  async updateRule(id: string, updates: Partial<AutomationRule>): Promise<boolean> {
    const rule = this.rules.get(id);
    if (!rule) return false;

    Object.assign(rule, updates);
    return true;
  }

  async deleteRule(id: string): Promise<boolean> {
    return this.rules.delete(id);
  }

  async getRules(): Promise<AutomationRule[]> {
    return Array.from(this.rules.values());
  }

  async getRule(id: string): Promise<AutomationRule | null> {
    return this.rules.get(id) || null;
  }

  async toggleRule(id: string): Promise<boolean> {
    const rule = this.rules.get(id);
    if (!rule) return false;

    rule.isActive = !rule.isActive;
    return true;
  }

  // Method to run time-based automations (called by scheduler)
  async processScheduledAutomations(): Promise<void> {
    console.log('🕐 Processing scheduled automations...');

    for (const rule of this.rules.values()) {
      if (!rule.isActive || rule.trigger.type !== 'time_based') continue;

      try {
        await this.processTimeBasedRule(rule);
      } catch (error) {
        console.error(`Error processing time-based rule ${rule.name}:`, error);
      }
    }
  }

  private async processTimeBasedRule(rule: AutomationRule): Promise<void> {
    // Mock implementation - in production, query database for entities matching conditions
    const conditions = rule.trigger.conditions;
    if (!conditions) return;

    console.log(`Processing time-based rule: ${rule.name}`, conditions);

    // This would typically query the database for entities that match the time conditions
    // For example: quotes sent 3 days ago, projects completing in 2 days, etc.
  }
}

export default AutomationService;
