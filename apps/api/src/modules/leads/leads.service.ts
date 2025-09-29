import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lead.findMany({
      include: {
        account: true,
        owner: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        account: true,
        owner: true,
      },
    });
  }
}
