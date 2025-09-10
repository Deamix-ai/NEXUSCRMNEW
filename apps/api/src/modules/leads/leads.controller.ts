import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto, LeadStatus } from './dto/lead.dto';

@ApiTags('leads')
@Controller('api/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads with optional filtering' })
  @ApiQuery({ name: 'status', enum: LeadStatus, required: false })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of leads retrieved successfully' })
  findAll(
    @Query('status') status?: LeadStatus,
    @Query('source') source?: string,
    @Query('ownerId') ownerId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.leadsService.findAll({
      status,
      source,
      ownerId,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get lead statistics' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiResponse({ status: 200, description: 'Lead statistics retrieved successfully' })
  getStats(@Query('userId') userId?: string) {
    return this.leadsService.getStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lead by ID' })
  @ApiResponse({ status: 200, description: 'Lead retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiResponse({ status: 204, description: 'Lead deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
