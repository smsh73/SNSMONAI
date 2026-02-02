/**
 * Keywords Service
 * Business logic for keyword management
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  CreateKeywordDto,
  UpdateKeywordDto,
  ListKeywordsQueryDto,
  KeywordResponseDto,
  DefaultKeywordsResponseDto,
} from './dto/keyword.dto';
import { CRISIS_KEYWORDS } from '@snsmon/shared/constants';
import { KeywordCategory } from '@prisma/client';

@Injectable()
export class KeywordsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new keyword configuration
   */
  async create(
    organizationId: string,
    dto: CreateKeywordDto,
  ): Promise<KeywordResponseDto> {
    // Check for duplicate
    const existing = await this.prisma.keyword.findFirst({
      where: {
        organizationId,
        name: dto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Keyword configuration with name "${dto.name}" already exists`,
      );
    }

    const keyword = await this.prisma.keyword.create({
      data: {
        organizationId,
        category: dto.category as KeywordCategory,
        name: dto.name,
        description: dto.description,
        keywords: dto.keywords,
        excludeKeywords: dto.excludeKeywords || [],
        matchSettings: dto.matchSettings || {
          caseSensitive: false,
          exactMatch: false,
          includeHashtags: true,
          includeMentions: true,
        },
        platforms: dto.platforms || [],
        regions: dto.regions || [],
      },
    });

    return this.toResponseDto(keyword);
  }

  /**
   * Get all keywords for an organization
   */
  async findAll(
    organizationId: string,
    query: ListKeywordsQueryDto,
  ): Promise<{ items: KeywordResponseDto[]; total: number }> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = { organizationId };

    if (query.category) {
      where.category = query.category;
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.keyword.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.keyword.count({ where }),
    ]);

    return {
      items: items.map(this.toResponseDto.bind(this)),
      total,
    };
  }

  /**
   * Get a single keyword by ID
   */
  async findOne(
    organizationId: string,
    id: string,
  ): Promise<KeywordResponseDto> {
    const keyword = await this.prisma.keyword.findFirst({
      where: { id, organizationId },
    });

    if (!keyword) {
      throw new NotFoundException(`Keyword configuration with ID "${id}" not found`);
    }

    return this.toResponseDto(keyword);
  }

  /**
   * Update a keyword configuration
   */
  async update(
    organizationId: string,
    id: string,
    dto: UpdateKeywordDto,
  ): Promise<KeywordResponseDto> {
    const existing = await this.prisma.keyword.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      throw new NotFoundException(`Keyword configuration with ID "${id}" not found`);
    }

    const updateData: any = {};

    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.keywords !== undefined) updateData.keywords = dto.keywords;
    if (dto.excludeKeywords !== undefined) updateData.excludeKeywords = dto.excludeKeywords;
    if (dto.matchSettings !== undefined) updateData.matchSettings = dto.matchSettings;
    if (dto.platforms !== undefined) updateData.platforms = dto.platforms;
    if (dto.regions !== undefined) updateData.regions = dto.regions;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const keyword = await this.prisma.keyword.update({
      where: { id },
      data: updateData,
    });

    return this.toResponseDto(keyword);
  }

  /**
   * Delete a keyword configuration
   */
  async delete(organizationId: string, id: string): Promise<void> {
    const existing = await this.prisma.keyword.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      throw new NotFoundException(`Keyword configuration with ID "${id}" not found`);
    }

    await this.prisma.keyword.delete({ where: { id } });
  }

  /**
   * Get default crisis keywords (from constants)
   */
  getDefaultKeywords(): DefaultKeywordsResponseDto {
    return {
      crisis: CRISIS_KEYWORDS,
    };
  }

  /**
   * Get all active keywords for matching
   */
  async getActiveKeywords(
    organizationId: string,
    options?: {
      category?: KeywordCategory;
      platform?: string;
      region?: string;
    },
  ): Promise<KeywordResponseDto[]> {
    const where: any = {
      organizationId,
      isActive: true,
    };

    if (options?.category) {
      where.category = options.category;
    }

    const keywords = await this.prisma.keyword.findMany({
      where,
    });

    // Filter by platform and region if provided
    let filtered = keywords;

    if (options?.platform) {
      filtered = filtered.filter(
        (k) =>
          k.platforms.length === 0 ||
          k.platforms.includes(options.platform as any),
      );
    }

    if (options?.region) {
      filtered = filtered.filter(
        (k) =>
          k.regions.length === 0 ||
          k.regions.includes(options.region),
      );
    }

    return filtered.map(this.toResponseDto.bind(this));
  }

  /**
   * Convert database entity to response DTO
   */
  private toResponseDto(keyword: any): KeywordResponseDto {
    return {
      id: keyword.id,
      organizationId: keyword.organizationId,
      category: keyword.category,
      name: keyword.name,
      description: keyword.description,
      keywords: keyword.keywords as any[],
      excludeKeywords: keyword.excludeKeywords,
      matchSettings: keyword.matchSettings as any,
      platforms: keyword.platforms,
      regions: keyword.regions,
      isActive: keyword.isActive,
      createdAt: keyword.createdAt,
      updatedAt: keyword.updatedAt,
    };
  }
}
