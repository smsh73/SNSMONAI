/**
 * Keyword DTOs
 * Data transfer objects for keyword management
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum KeywordCategory {
  CRISIS_CIVIL_UNREST = 'CRISIS_CIVIL_UNREST',
  CRISIS_VIOLENCE = 'CRISIS_VIOLENCE',
  CRISIS_DISASTER = 'CRISIS_DISASTER',
  CRISIS_INCIDENT = 'CRISIS_INCIDENT',
  GOVERNMENT = 'GOVERNMENT',
  BRAND = 'BRAND',
  COMPETITOR = 'COMPETITOR',
  CUSTOM = 'CUSTOM',
}

export enum Platform {
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  WHATSAPP = 'WHATSAPP',
  LINE = 'LINE',
  TELEGRAM = 'TELEGRAM',
  YOUTUBE = 'YOUTUBE',
}

// ============================================
// Keyword Item DTO
// ============================================

export class KeywordItemDto {
  @ApiProperty({ description: 'The keyword term' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  term: string;

  @ApiPropertyOptional({ description: 'Keyword variants/synonyms', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variants?: string[];

  @ApiPropertyOptional({ description: 'Keyword weight (1-10)', default: 5 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ description: 'Language', enum: ['id', 'en', 'both'], default: 'both' })
  @IsOptional()
  @IsString()
  language?: 'id' | 'en' | 'both';
}

// ============================================
// Match Settings DTO
// ============================================

export class MatchSettingsDto {
  @ApiPropertyOptional({ description: 'Case sensitive matching', default: false })
  @IsOptional()
  @IsBoolean()
  caseSensitive?: boolean;

  @ApiPropertyOptional({ description: 'Exact match only', default: false })
  @IsOptional()
  @IsBoolean()
  exactMatch?: boolean;

  @ApiPropertyOptional({ description: 'Include hashtags', default: true })
  @IsOptional()
  @IsBoolean()
  includeHashtags?: boolean;

  @ApiPropertyOptional({ description: 'Include mentions', default: true })
  @IsOptional()
  @IsBoolean()
  includeMentions?: boolean;
}

// ============================================
// Create Keyword DTO
// ============================================

export class CreateKeywordDto {
  @ApiProperty({ enum: KeywordCategory, description: 'Keyword category' })
  @IsEnum(KeywordCategory)
  category: KeywordCategory;

  @ApiProperty({ description: 'Display name for this keyword set' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Keywords to track', type: [KeywordItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => KeywordItemDto)
  keywords: KeywordItemDto[];

  @ApiPropertyOptional({ description: 'Keywords to exclude', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeKeywords?: string[];

  @ApiPropertyOptional({ description: 'Match settings', type: MatchSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchSettingsDto)
  matchSettings?: MatchSettingsDto;

  @ApiPropertyOptional({ description: 'Platforms to monitor', enum: Platform, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Platform, { each: true })
  platforms?: Platform[];

  @ApiPropertyOptional({ description: 'Region codes to apply', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[];
}

// ============================================
// Update Keyword DTO
// ============================================

export class UpdateKeywordDto {
  @ApiPropertyOptional({ enum: KeywordCategory })
  @IsOptional()
  @IsEnum(KeywordCategory)
  category?: KeywordCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ type: [KeywordItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeywordItemDto)
  keywords?: KeywordItemDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeKeywords?: string[];

  @ApiPropertyOptional({ type: MatchSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchSettingsDto)
  matchSettings?: MatchSettingsDto;

  @ApiPropertyOptional({ enum: Platform, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Platform, { each: true })
  platforms?: Platform[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============================================
// Query DTOs
// ============================================

export class ListKeywordsQueryDto {
  @ApiPropertyOptional({ enum: KeywordCategory })
  @IsOptional()
  @IsEnum(KeywordCategory)
  category?: KeywordCategory;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

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
// Response DTOs
// ============================================

export class KeywordResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty({ enum: KeywordCategory })
  category: KeywordCategory;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: [KeywordItemDto] })
  keywords: KeywordItemDto[];

  @ApiProperty({ type: [String] })
  excludeKeywords: string[];

  @ApiProperty({ type: MatchSettingsDto })
  matchSettings: MatchSettingsDto;

  @ApiProperty({ enum: Platform, isArray: true })
  platforms: Platform[];

  @ApiProperty({ type: [String] })
  regions: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// ============================================
// Default Keywords Response
// ============================================

export class DefaultKeywordsResponseDto {
  @ApiProperty({ description: 'Crisis keywords by category' })
  crisis: Record<string, { id: string[]; en: string[] }>;
}
