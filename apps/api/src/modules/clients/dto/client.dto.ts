import { IsString, IsOptional, IsEnum, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ClientType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  TRADE = 'TRADE',
}

export class CreateClientDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  county?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postcode?: string;

  @ApiProperty({ default: 'GB' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ enum: ClientType, default: ClientType.RESIDENTIAL })
  @IsOptional()
  @IsEnum(ClientType)
  clientType?: ClientType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  leadSource?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referralSource?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  emailConsent?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  smsConsent?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  callRecordingConsent?: boolean;

  @ApiProperty()
  @IsString()
  ownerId: string;
}

export class UpdateClientDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  county?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postcode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ enum: ClientType, required: false })
  @IsOptional()
  @IsEnum(ClientType)
  clientType?: ClientType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  leadSource?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referralSource?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailConsent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  smsConsent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  callRecordingConsent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ownerId?: string;
}
