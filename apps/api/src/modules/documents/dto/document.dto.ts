import { IsString, IsBoolean, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DocCategory {
  DRAWING = 'DRAWING',
  SURVEY_PACK = 'SURVEY_PACK',
  PRODUCT_LIST = 'PRODUCT_LIST',
  CONTRACT = 'CONTRACT',
  PHOTO = 'PHOTO',
  CERTIFICATE = 'CERTIFICATE',
  RENDER = 'RENDER',
  OTHER = 'OTHER',
}

export class CreateDocumentDto {
  @ApiProperty({ description: 'Client ID the document belongs to' })
  @IsString()
  clientId: string;

  @ApiProperty({ description: 'Room ID the document belongs to', required: false })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiProperty({ enum: DocCategory, description: 'Document category' })
  @IsEnum(DocCategory)
  category: DocCategory;

  @ApiProperty({ description: 'Whether the document is visible to the client', default: false })
  @IsOptional()
  @IsBoolean()
  clientVisible?: boolean;

  @ApiProperty({ description: 'Whether to add company watermark', default: false })
  @IsOptional()
  @IsBoolean()
  clientWatermark?: boolean;

  @ApiProperty({ description: 'Document labels', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiProperty({ description: 'Who captured the document', required: false })
  @IsOptional()
  @IsString()
  capturedBy?: string;
}

export class UpdateDocumentDto {
  @ApiProperty({ enum: DocCategory, description: 'Document category', required: false })
  @IsOptional()
  @IsEnum(DocCategory)
  category?: DocCategory;

  @ApiProperty({ description: 'Whether the document is visible to the client', required: false })
  @IsOptional()
  @IsBoolean()
  clientVisible?: boolean;

  @ApiProperty({ description: 'Whether to add company watermark', required: false })
  @IsOptional()
  @IsBoolean()
  clientWatermark?: boolean;

  @ApiProperty({ description: 'Document labels', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}

export class DocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty({ required: false })
  roomId?: string;

  @ApiProperty({ enum: DocCategory })
  category: DocCategory;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  thumbUrl?: string;

  @ApiProperty({ required: false })
  size?: number;

  @ApiProperty({ type: [String] })
  labels: string[];

  @ApiProperty({ required: false })
  capturedAt?: Date;

  @ApiProperty({ required: false })
  capturedBy?: string;

  @ApiProperty()
  clientVisible: boolean;

  @ApiProperty()
  clientWatermark: boolean;

  @ApiProperty()
  createdAt: Date;
}
