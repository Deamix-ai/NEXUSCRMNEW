import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@crm/database/generated';

interface FindAllClientsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

interface FindClientRoomsOptions {
  page?: number;
  limit?: number;
}

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: FindAllClientsOptions = {}) {
    const { page = 1, limit = 10, search } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.AccountWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { legalName: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { emails: { has: search } },
          ],
        }
      : {};

    const [clients, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        skip,
        take: limit,
        include: {
          contacts: {
            where: { isPrimary: true },
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              isPrimary: true,
            },
          },
          _count: {
            select: {
              contacts: true,
              projects: true,
              leads: true,
              enquiries: true,
              activities: true,
              documents: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.account.count({ where }),
    ]);

    return {
      clients: clients.map(this.mapAccountToClient),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        contacts: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isPrimary: true,
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            amountGrossIncVat: true,
            _count: {
              select: {
                tasks: true,
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
        _count: {
          select: {
            contacts: true,
            projects: true,
            leads: true,
            enquiries: true,
            activities: true,
            documents: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return this.mapAccountToClientDetails(account);
  }

  async getClientRooms(clientId: string, options: FindClientRoomsOptions = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    // First verify the client exists
    const account = await this.prisma.account.findUnique({
      where: { id: clientId },
    });

    if (!account) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Get projects (mapped as rooms)
    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { accountId: clientId },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          amountGrossIncVat: true,
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({
        where: { accountId: clientId },
      }),
    ]);

    return {
      rooms: projects.map(this.mapProjectToRoom),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapAccountToClient(account: any) {
    return {
      id: account.id,
      name: account.name,
      legalName: account.legalName,
      emails: account.emails,
      phones: account.phones,
      status: account.status,
      tags: account.tags,
      contacts: account.contacts,
      _count: {
        contacts: account._count.contacts,
        rooms: account._count.projects, // Map projects to rooms
        leads: account._count.leads,
        deals: account._count.enquiries, // Map enquiries to deals
        jobs: account._count.projects, // Map projects to jobs
        activities: account._count.activities,
        documents: account._count.documents,
      },
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  private mapAccountToClientDetails(account: any) {
    return {
      id: account.id,
      name: account.name,
      legalName: account.legalName,
      emails: account.emails,
      phones: account.phones,
      status: account.status,
      tags: account.tags,
      billingAddress: account.billingAddress,
      siteAddresses: account.siteAddresses,
      contacts: account.contacts,
      rooms: account.projects.map(this.mapProjectToRoom), // Map projects to rooms
      activities: account.activities.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        title: activity.summary, // Map summary to title
        description: activity.body, // Map body to description
        createdAt: activity.createdAt,
        user: activity.user,
      })),
      _count: {
        contacts: account._count.contacts,
        rooms: account._count.projects,
        leads: account._count.leads,
        deals: account._count.enquiries,
        jobs: account._count.projects,
        activities: account._count.activities,
        documents: account._count.documents,
      },
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  private mapProjectToRoom(project: any) {
    return {
      id: project.id,
      name: project.title,
      type: project.type,
      jobs: [], // Projects are mapped as rooms, but jobs would be tasks/subtasks
      _count: {
        jobs: project._count?.tasks || 0,
      },
      status: project.status,
      quotedValue: project.amountGrossIncVat ? project.amountGrossIncVat / 100 : null, // Convert from pence to pounds
    };
  }
}