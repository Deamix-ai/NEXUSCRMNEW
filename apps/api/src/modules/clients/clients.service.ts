import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClientDto, UpdateClientDto, ClientType } from './dto/client.dto';
import { Prisma } from '@crm/database/generated';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        ...createClientDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        owner: true,
        contacts: true,
      },
    });
  }

  async findAll(query?: {
    clientType?: ClientType;
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { clientType, ownerId, search, page = 1, limit = 10 } = query || {};
    
    const where: Prisma.ClientWhereInput = {};
    
    if (clientType) where.clientType = clientType;
    if (ownerId) where.ownerId = ownerId;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        include: {
          owner: true,
          contacts: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      clients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        owner: true,
        contacts: true,
        leads: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        deals: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: {
        ...updateClientDto,
        updatedAt: new Date(),
      },
      include: {
        owner: true,
        contacts: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }

  async getStats(userId?: string) {
    const where: Prisma.ClientWhereInput = userId ? { ownerId: userId } : {};
    
    const [total, residential, commercial, trade] = await Promise.all([
      this.prisma.client.count({ where }),
      this.prisma.client.count({ where: { ...where, clientType: ClientType.RESIDENTIAL } }),
      this.prisma.client.count({ where: { ...where, clientType: ClientType.COMMERCIAL } }),
      this.prisma.client.count({ where: { ...where, clientType: ClientType.TRADE } }),
    ]);

    return { total, residential, commercial, trade };
  }
}
