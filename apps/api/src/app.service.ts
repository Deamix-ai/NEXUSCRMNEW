import { Injectable } from '@nestjs/common';
import { PrismaService } from './modules/database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'CRM API is running!';
  }

  async getStats() {
    try {
      const [
        totalLeads,
        newLeads,
        totalAccounts,
        totalProjects,
      ] = await Promise.all([
        this.prisma.lead.count(),
        this.prisma.lead.count({ where: { status: 'NEW' } }),
        this.prisma.account.count(),
        this.prisma.project.count(),
      ]);

      return {
        totalLeads,
        newLeads,
        totalAccounts,
        totalProjects,
        recentActivities: [], // Simplified for now
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalLeads: 0,
        newLeads: 0,
        totalAccounts: 0,
        totalProjects: 0,
        recentActivities: [],
      };
    }
  }
}
