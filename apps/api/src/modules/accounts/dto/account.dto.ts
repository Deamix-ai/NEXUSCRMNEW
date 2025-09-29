import { IsString, IsOptional, IsEnum, IsBoolean, IsEmail, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  billingAddress?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  siteAddresses?: any;

  @ApiProperty({ required: false, description: 'Owner ID - defaults to system user if not provided' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ enum: AccountStatus, default: AccountStatus.ACTIVE })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  designFeePaid?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  consentMarketing?: boolean;
}

export class UpdateAccountDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  billingAddress?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  siteAddresses?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ enum: AccountStatus, required: false })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  designFeePaid?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  consentMarketing?: boolean;
}
