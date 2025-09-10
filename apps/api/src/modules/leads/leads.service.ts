import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLeadDto, UpdateLeadDto, LeadStatus } from './dto/lead.dto';
import { Prisma } from '@crm/database/generated';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        ...createLeadDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        client: true,
        owner: true,
      },
    });
  }

  async findAll(query?: {
    status?: LeadStatus;
    source?: string;
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, source, ownerId, search, page = 1, limit = 10 } = query || {};
    
    const where: Prisma.LeadWhereInput = {};
    
    if (status) where.status = status;
    if (source) where.source = source;
    if (ownerId) where.ownerId = ownerId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { client: { firstName: { contains: search, mode: 'insensitive' } } },
        { client: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          client: true,
          owner: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        client: true,
        owner: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    return this.prisma.lead.update({
      where: { id },
      data: {
        ...updateLeadDto,
        updatedAt: new Date(),
      },
      include: {
        client: true,
        owner: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.lead.delete({
      where: { id },
    });
  }

  async getStats(userId?: string) {
    const where: Prisma.LeadWhereInput = userId ? { ownerId: userId } : {};
    
    const [total, newLeads, qualified, lost] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.count({ where: { ...where, status: LeadStatus.NEW } }),
      this.prisma.lead.count({ where: { ...where, status: LeadStatus.QUALIFIED } }),
      this.prisma.lead.count({ where: { ...where, status: LeadStatus.LOST } }),
    ]);

    return { total, new: newLeads, qualified, lost };
  }
}
