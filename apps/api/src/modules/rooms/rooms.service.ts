import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@crm/database/generated';

interface FindAllRoomsOptions {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: FindAllRoomsOptions = {}) {
    const { page = 1, limit = 10, type, status } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};
    if (type) {
      where.type = type as any;
    }
    if (status) {
      where.status = status as any;
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: {
            select: {
              id: true,
              name: true,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              status: true,
              dueDate: true,
            },
            orderBy: { updatedAt: 'desc' },
          },
          _count: {
            select: {
              tasks: true,
              activities: true,
              documents: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      rooms: projects.map(this.mapProjectToRoom),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            contacts: {
              where: { isPrimary: true },
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            assigneeId: true,
            assignee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
        activities: {
          take: 10,
          select: {
            id: true,
            type: true,
            summary: true,
            body: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          take: 10,
          select: {
            id: true,
            filename: true,
            fileSize: true,
            mimeType: true,
            type: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            tasks: true,
            activities: true,
            documents: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return this.mapProjectToRoomDetails(project);
  }

  private mapProjectToRoom(project: any) {
    return {
      id: project.id,
      name: project.title,
      type: project.type,
      status: project.status,
      quotedValue: project.amountGrossIncVat ? project.amountGrossIncVat / 100 : null,
      client: project.account,
      jobs: project.tasks?.map((task: any) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        dueDate: task.dueDate,
      })) || [],
      _count: {
        jobs: project._count?.tasks || 0,
        activities: project._count?.activities || 0,
        documents: project._count?.documents || 0,
      },
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private mapProjectToRoomDetails(project: any) {
    return {
      id: project.id,
      name: project.title,
      description: project.description,
      type: project.type,
      status: project.status,
      quotedValue: project.amountGrossIncVat ? project.amountGrossIncVat / 100 : null,
      vatRate: project.vatRate,
      probability: project.probability,
      source: project.source,
      client: {
        id: project.account.id,
        name: project.account.name,
        contacts: project.account.contacts,
      },
      jobs: project.tasks?.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee,
      })) || [],
      activities: project.activities?.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        title: activity.summary,
        description: activity.body,
        createdAt: activity.createdAt,
        user: activity.user,
      })) || [],
      documents: project.documents || [],
      _count: {
        jobs: project._count?.tasks || 0,
        activities: project._count?.activities || 0,
        documents: project._count?.documents || 0,
      },
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}