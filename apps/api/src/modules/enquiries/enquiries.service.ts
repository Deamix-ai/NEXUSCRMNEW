import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateEnquiryDto, UpdateEnquiryDto, EnquiryStatus } from './dto/enquiry.dto';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(createEnquiryDto: CreateEnquiryDto) {
    // Validate that the account exists
    if (createEnquiryDto.accountId) {
      const accountExists = await this.prisma.account.findUnique({
        where: { id: createEnquiryDto.accountId }
      });
      
      if (!accountExists) {
        throw new NotFoundException(`Account with ID ${createEnquiryDto.accountId} not found`);
      }
    }

    // Validate that the owner exists
    if (createEnquiryDto.ownerId) {
      const ownerExists = await this.prisma.user.findUnique({
        where: { id: createEnquiryDto.ownerId }
      });
      
      if (!ownerExists) {
        throw new NotFoundException(`User with ID ${createEnquiryDto.ownerId} not found`);
      }
    }

    const enquiryData = {
      title: createEnquiryDto.title,
      description: createEnquiryDto.description,
      status: createEnquiryDto.status || EnquiryStatus.NEW,
      priority: createEnquiryDto.priority || 'MEDIUM',
      source: createEnquiryDto.source,
      campaign: createEnquiryDto.campaign,
      medium: createEnquiryDto.medium,
      estimatedValue: createEnquiryDto.estimatedValue ? Number(createEnquiryDto.estimatedValue) : null,
      contactMethod: createEnquiryDto.contactMethod,
      firstName: createEnquiryDto.firstName,
      lastName: createEnquiryDto.lastName,
      email: createEnquiryDto.email,
      phone: createEnquiryDto.phone,
      mobile: createEnquiryDto.mobile,
      company: createEnquiryDto.company,
      message: createEnquiryDto.message,
      owner: {
        connect: { id: createEnquiryDto.ownerId }
      }
    } as any;

    // Connect to account if provided
    if (createEnquiryDto.accountId) {
      enquiryData.account = {
        connect: { id: createEnquiryDto.accountId }
      };
    }

    return this.prisma.enquiry.create({
      data: enquiryData,
      include: {
        account: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lead: true
      }
    });
  }

  async findAll(filters?: {
    accountId?: string;
    ownerId?: string;
    status?: string;
    priority?: string;
  }) {
    const where: any = {};

    if (filters?.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    return this.prisma.enquiry.findMany({
      where,
      include: {
        account: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lead: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id },
      include: {
        account: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lead: true
      }
    });

    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }

    return enquiry;
  }

  async update(id: string, updateEnquiryDto: UpdateEnquiryDto) {
    const existingEnquiry = await this.prisma.enquiry.findUnique({
      where: { id }
    });

    if (!existingEnquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }

    const updateData: any = {};

    if (updateEnquiryDto.title !== undefined) {
      updateData.title = updateEnquiryDto.title;
    }

    if (updateEnquiryDto.description !== undefined) {
      updateData.description = updateEnquiryDto.description;
    }

    if (updateEnquiryDto.status !== undefined) {
      updateData.status = updateEnquiryDto.status;
    }

    if (updateEnquiryDto.priority !== undefined) {
      updateData.priority = updateEnquiryDto.priority;
    }

    if (updateEnquiryDto.source !== undefined) {
      updateData.source = updateEnquiryDto.source;
    }

    if (updateEnquiryDto.campaign !== undefined) {
      updateData.campaign = updateEnquiryDto.campaign;
    }

    if (updateEnquiryDto.medium !== undefined) {
      updateData.medium = updateEnquiryDto.medium;
    }

    if (updateEnquiryDto.estimatedValue !== undefined) {
      updateData.estimatedValue = updateEnquiryDto.estimatedValue ? Number(updateEnquiryDto.estimatedValue) : null;
    }

    if (updateEnquiryDto.contactMethod !== undefined) {
      updateData.contactMethod = updateEnquiryDto.contactMethod;
    }

    if (updateEnquiryDto.firstName !== undefined) {
      updateData.firstName = updateEnquiryDto.firstName;
    }

    if (updateEnquiryDto.lastName !== undefined) {
      updateData.lastName = updateEnquiryDto.lastName;
    }

    if (updateEnquiryDto.email !== undefined) {
      updateData.email = updateEnquiryDto.email;
    }

    if (updateEnquiryDto.phone !== undefined) {
      updateData.phone = updateEnquiryDto.phone;
    }

    if (updateEnquiryDto.mobile !== undefined) {
      updateData.mobile = updateEnquiryDto.mobile;
    }

    if (updateEnquiryDto.company !== undefined) {
      updateData.company = updateEnquiryDto.company;
    }

    if (updateEnquiryDto.message !== undefined) {
      updateData.message = updateEnquiryDto.message;
    }

    if (updateEnquiryDto.accountId !== undefined) {
      if (updateEnquiryDto.accountId) {
        updateData.account = {
          connect: { id: updateEnquiryDto.accountId }
        };
      } else {
        updateData.account = {
          disconnect: true
        };
      }
    }

    return this.prisma.enquiry.update({
      where: { id },
      data: updateData,
      include: {
        account: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lead: true
      }
    });
  }

  async remove(id: string) {
    const existingEnquiry = await this.prisma.enquiry.findUnique({
      where: { id }
    });

    if (!existingEnquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }

    return this.prisma.enquiry.delete({
      where: { id }
    });
  }

  async convertToLead(enquiryId: string, leadData?: any) {
    const enquiry = await this.findOne(enquiryId);

    // Create lead from enquiry data
    const lead = await this.prisma.lead.create({
      data: {
        title: leadData?.title || `Lead from: ${enquiry.title}`,
        description: leadData?.description || enquiry.description,
        status: 'NEW',
        priority: enquiry.priority,
        source: enquiry.source,
        campaign: enquiry.campaign,
        medium: enquiry.medium,
        estimatedValue: enquiry.estimatedValue,
        account: enquiry.accountId ? {
          connect: { id: enquiry.accountId }
        } : undefined,
        owner: {
          connect: { id: enquiry.ownerId }
        },
        enquiry: {
          connect: { id: enquiryId }
        }
      },
      include: {
        account: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        enquiry: true
      }
    });

    // Update enquiry status to CONVERTED
    await this.update(enquiryId, { status: EnquiryStatus.CONVERTED });

    return lead;
  }
}