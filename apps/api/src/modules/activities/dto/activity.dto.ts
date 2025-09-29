import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, Min, IsISO8601, IsJSON, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  MEETING = 'MEETING',
  NOTE = 'NOTE',
  TASK = 'TASK',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  PORTAL_ACCESS = 'PORTAL_ACCESS',
  SURVEY_SUBMITTED = 'SURVEY_SUBMITTED',
  DESIGN_VIEWED = 'DESIGN_VIEWED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
}

export enum Direction {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export class CreateActivityDto {
  @ApiProperty({ enum: ActivityType, description: 'Type of activity' })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty({ description: 'Activity title', example: 'Called customer about kitchen design' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed description of the activity', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Direction, description: 'Direction of communication', required: false })
  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @ApiProperty({ description: 'Duration in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  duration?: number;

  @ApiProperty({ description: 'Outcome of the activity', required: false })
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiProperty({ description: 'User ID who performed the activity' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Client ID this activity relates to', required: false })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({ description: 'Contact ID this activity relates to', required: false })
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @ApiProperty({ description: 'Lead ID this activity relates to', required: false })
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiProperty({ description: 'Deal ID this activity relates to', required: false })
  @IsOptional()
  @IsUUID()
  dealId?: string;

  @ApiProperty({ description: 'Email message ID for email activities', required: false })
  @IsOptional()
  @IsString()
  emailMessageId?: string;

  @ApiProperty({ description: 'Call recording URL', required: false })
  @IsOptional()
  @IsString()
  callRecordingUrl?: string;

  @ApiProperty({ description: 'Additional metadata as JSON', required: false })
  @IsOptional()
  @IsJSON()
  metadata?: string;

  @ApiProperty({ description: 'When the activity was scheduled for', required: false })
  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @ApiProperty({ description: 'When the activity was completed', required: false })
  @IsOptional()
  @IsISO8601()
  completedAt?: string;
}

export class UpdateActivityDto {
  @ApiProperty({ enum: ActivityType, description: 'Type of activity', required: false })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiProperty({ description: 'Activity title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Detailed description of the activity', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Direction, description: 'Direction of communication', required: false })
  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @ApiProperty({ description: 'Duration in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  duration?: number;

  @ApiProperty({ description: 'Outcome of the activity', required: false })
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiProperty({ description: 'Email message ID for email activities', required: false })
  @IsOptional()
  @IsString()
  emailMessageId?: string;

  @ApiProperty({ description: 'Call recording URL', required: false })
  @IsOptional()
  @IsString()
  callRecordingUrl?: string;

  @ApiProperty({ description: 'Additional metadata as JSON', required: false })
  @IsOptional()
  @IsJSON()
  metadata?: string;

  @ApiProperty({ description: 'When the activity was scheduled for', required: false })
  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @ApiProperty({ description: 'When the activity was completed', required: false })
  @IsOptional()
  @IsISO8601()
  completedAt?: string;
}

export class ActivityQueryDto {
  @ApiProperty({ description: 'Client ID to filter activities by', required: false })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({ description: 'User ID to filter activities by', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ enum: ActivityType, description: 'Filter by activity type', required: false })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiProperty({ description: 'Search in activity title or description', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter activities from this date (ISO 8601)', required: false })
  @IsOptional()
  @IsISO8601()
  fromDate?: string;

  @ApiProperty({ description: 'Filter activities to this date (ISO 8601)', required: false })
  @IsOptional()
  @IsISO8601()
  toDate?: string;

  @ApiProperty({ description: 'Page number for pagination', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Number of items per page', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
