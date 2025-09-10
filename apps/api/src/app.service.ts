import { Injectable } from '@nestjs/common';
import { PrismaService } from './modules/database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async getDashboardStats() {
    const [
      totalLeads,
      newLeads,
      totalClients,
      activeJobs,
      totalDeals,
      recentActivities,
    ] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { status: 'NEW' } }),
      this.prisma.client.count(),
      this.prisma.job.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.deal.count(),
      this.prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          lead: true,
          client: true,
        },
      }),
    ]);

    return {
      leads: {
        total: totalLeads,
        new: newLeads,
      },
      clients: {
        total: totalClients,
      },
      jobs: {
        active: activeJobs,
      },
      deals: {
        total: totalDeals,
      },
      recentActivities,
    };
  }
}
