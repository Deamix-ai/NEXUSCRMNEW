import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto, UpdateEnquiryDto } from './dto/enquiry.dto';

@ApiTags('enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new enquiry' })
  @ApiResponse({ status: 201, description: 'The enquiry has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all enquiries' })
  @ApiResponse({ status: 200, description: 'Return all enquiries.' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiQuery({ name: 'ownerId', required: false, description: 'Filter by owner ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filter by priority' })
  findAll(
    @Query('accountId') accountId?: string,
    @Query('ownerId') ownerId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.enquiriesService.findAll({
      accountId,
      ownerId,
      status,
      priority,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an enquiry by id' })
  @ApiResponse({ status: 200, description: 'Return the enquiry.' })
  @ApiResponse({ status: 404, description: 'Enquiry not found.' })
  findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an enquiry' })
  @ApiResponse({ status: 200, description: 'The enquiry has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Enquiry not found.' })
  update(@Param('id') id: string, @Body() updateEnquiryDto: UpdateEnquiryDto) {
    return this.enquiriesService.update(id, updateEnquiryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an enquiry' })
  @ApiResponse({ status: 200, description: 'The enquiry has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Enquiry not found.' })
  remove(@Param('id') id: string) {
    return this.enquiriesService.remove(id);
  }

  @Post(':id/convert-to-lead')
  @ApiOperation({ summary: 'Convert an enquiry to a lead' })
  @ApiResponse({ status: 201, description: 'The enquiry has been successfully converted to a lead.' })
  @ApiResponse({ status: 404, description: 'Enquiry not found.' })
  convertToLead(@Param('id') id: string, @Body() leadData?: any) {
    return this.enquiriesService.convertToLead(id, leadData);
  }
}