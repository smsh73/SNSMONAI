/**
 * API Key DTOs
 * Data transfer objects for API key management
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ApiKeyType {
  AI = 'AI',
  SOCIAL = 'SOCIAL',
  THIRD_PARTY = 'THIRD_PARTY',
}

export enum AiProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  PROSA = 'prosa',
  AZURE = 'azure',
  GOOGLE = 'google',
}

export enum SocialProvider {
  TWITTER = 'twitter',
  META = 'meta',
  TIKTOK = 'tiktok',
  TELEGRAM = 'telegram',
  LINE = 'line',
}

export enum ThirdPartyProvider {
  DATAXET = 'dataxet',
  MEDIAWAVE = 'mediawave',
  BRIGHTDATA = 'brightdata',
  APIFY = 'apify',
}

// ============================================
// Create API Key DTO
// ============================================

export class CreateApiKeyDto {
  @ApiProperty({ enum: ApiKeyType, description: 'Type of API key' })
  @IsEnum(ApiKeyType)
  keyType: ApiKeyType;

  @ApiProperty({ description: 'Provider name (e.g., openai, twitter, dataxet)' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  provider: string;

  @ApiProperty({ description: 'Display name for this API key' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'The API key value' })
  @IsString()
  @MinLength(10)
  apiKey: string;

  @ApiPropertyOptional({ description: 'Secret key (if required by provider)' })
  @IsOptional()
  @IsString()
  secretKey?: string;

  @ApiPropertyOptional({ description: 'Access token (if required by provider)' })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional({ description: 'Additional configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Usage limit per period' })
  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

// ============================================
// Update API Key DTO
// ============================================

export class UpdateApiKeyDto {
  @ApiPropertyOptional({ description: 'Display name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'New API key value' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  apiKey?: string;

  @ApiPropertyOptional({ description: 'New secret key' })
  @IsOptional()
  @IsString()
  secretKey?: string;

  @ApiPropertyOptional({ description: 'New access token' })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional({ description: 'Additional configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Usage limit per period' })
  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============================================
// API Key Response DTO
// ============================================

export class ApiKeyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty({ enum: ApiKeyType })
  keyType: ApiKeyType;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Masked API key for display' })
  maskedApiKey: string;

  @ApiProperty({ description: 'Whether secret key is set' })
  hasSecretKey: boolean;

  @ApiProperty({ description: 'Whether access token is set' })
  hasAccessToken: boolean;

  @ApiPropertyOptional()
  config?: Record<string, unknown>;

  @ApiProperty()
  usageCurrent: number;

  @ApiProperty()
  usageLimit: number;

  @ApiPropertyOptional()
  usageResetAt?: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  lastValidated?: Date;

  @ApiPropertyOptional()
  expiresAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// ============================================
// Query DTOs
// ============================================

export class ListApiKeysQueryDto {
  @ApiPropertyOptional({ enum: ApiKeyType })
  @IsOptional()
  @IsEnum(ApiKeyType)
  keyType?: ApiKeyType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}

// ============================================
// Validate API Key DTO
// ============================================

export class ValidateApiKeyDto {
  @ApiProperty({ description: 'API key ID to validate' })
  @IsString()
  apiKeyId: string;
}

export class ValidateApiKeyResponseDto {
  @ApiProperty()
  isValid: boolean;

  @ApiPropertyOptional()
  error?: string;

  @ApiPropertyOptional()
  remainingQuota?: number;

  @ApiProperty()
  validatedAt: Date;
}
