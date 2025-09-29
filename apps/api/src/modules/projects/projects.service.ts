import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Project } from '@crm/database/generated';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<{ projects: Project[]; total: number }> {
    try {
      const [projects, total] = await Promise.all([
        this.prisma.project.findMany({
          include: {
            account: true,
            owner: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.project.count(),
      ]);

      return {
        projects,
        total,
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  async findOne(id: string): Promise<Project | null> {
    try {
      return this.prisma.project.findUnique({
        where: { id },
        include: {
          account: true,
          owner: true,
        },
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  async getStats() {
    try {
      const [total, inProgress, planning, completed] = await Promise.all([
        this.prisma.project.count(),
        this.prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
        this.prisma.project.count({ where: { status: 'PLANNING' } }),
        this.prisma.project.count({ where: { status: 'COMPLETED' } }),
      ]);

      return {
        total,
        inProgress,
        planning,
        completed,
      };
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw new Error('Failed to fetch project stats');
    }
  }
}
