/**
 * API Keys Service
 * Business logic for API key management
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CryptoService } from '../../common/crypto.service';
import {
  CreateApiKeyDto,
  UpdateApiKeyDto,
  ListApiKeysQueryDto,
  ApiKeyResponseDto,
  ValidateApiKeyResponseDto,
} from './dto/api-key.dto';
import { ApiKeyType } from '@prisma/client';

@Injectable()
export class ApiKeysService {
  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
  ) {}

  /**
   * Create a new API key
   */
  async create(
    organizationId: string,
    dto: CreateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    // Check for duplicate
    const existing = await this.prisma.apiKey.findFirst({
      where: {
        organizationId,
        provider: dto.provider,
        name: dto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        `API key with name "${dto.name}" for provider "${dto.provider}" already exists`,
      );
    }

    // Encrypt sensitive data
    const encryptedApiKey = this.crypto.encrypt(dto.apiKey);
    const encryptedSecretKey = dto.secretKey
      ? this.crypto.encrypt(dto.secretKey)
      : null;
    const encryptedAccessToken = dto.accessToken
      ? this.crypto.encrypt(dto.accessToken)
      : null;

    // Create the API key
    const apiKey = await this.prisma.apiKey.create({
      data: {
        organizationId,
        keyType: dto.keyType as ApiKeyType,
        provider: dto.provider,
        name: dto.name,
        encryptedApiKey,
        encryptedSecretKey,
        encryptedAccessToken,
        config: dto.config || {},
        usageLimit: dto.usageLimit || 10000,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    return this.toResponseDto(apiKey);
  }

  /**
   * Get all API keys for an organization
   */
  async findAll(
    organizationId: string,
    query: ListApiKeysQueryDto,
  ): Promise<{ items: ApiKeyResponseDto[]; total: number }> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = { organizationId };

    if (query.keyType) {
      where.keyType = query.keyType;
    }
    if (query.provider) {
      where.provider = query.provider;
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [items, total] = await Promise.all([
      this.prisma.apiKey.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apiKey.count({ where }),
    ]);

    return {
      items: items.map(this.toResponseDto.bind(this)),
      total,
    };
  }

  /**
   * Get a single API key by ID
   */
  async findOne(
    organizationId: string,
    id: string,
  ): Promise<ApiKeyResponseDto> {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, organizationId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key with ID "${id}" not found`);
    }

    return this.toResponseDto(apiKey);
  }

  /**
   * Update an API key
   */
  async update(
    organizationId: string,
    id: string,
    dto: UpdateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    // Check if exists
    const existing = await this.prisma.apiKey.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      throw new NotFoundException(`API key with ID "${id}" not found`);
    }

    // Build update data
    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.config !== undefined) updateData.config = dto.config;
    if (dto.usageLimit !== undefined) updateData.usageLimit = dto.usageLimit;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.expiresAt !== undefined) {
      updateData.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    }

    // Encrypt new credentials if provided
    if (dto.apiKey) {
      updateData.encryptedApiKey = this.crypto.encrypt(dto.apiKey);
    }
    if (dto.secretKey) {
      updateData.encryptedSecretKey = this.crypto.encrypt(dto.secretKey);
    }
    if (dto.accessToken) {
      updateData.encryptedAccessToken = this.crypto.encrypt(dto.accessToken);
    }

    const apiKey = await this.prisma.apiKey.update({
      where: { id },
      data: updateData,
    });

    return this.toResponseDto(apiKey);
  }

  /**
   * Delete an API key
   */
  async delete(organizationId: string, id: string): Promise<void> {
    const existing = await this.prisma.apiKey.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      throw new NotFoundException(`API key with ID "${id}" not found`);
    }

    await this.prisma.apiKey.delete({ where: { id } });
  }

  /**
   * Validate an API key (check if it works)
   */
  async validate(
    organizationId: string,
    id: string,
  ): Promise<ValidateApiKeyResponseDto> {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, organizationId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key with ID "${id}" not found`);
    }

    // Decrypt the API key
    const decryptedApiKey = this.crypto.decrypt(apiKey.encryptedApiKey);

    // TODO: Implement provider-specific validation
    // For now, just mark as validated
    let isValid = true;
    let error: string | undefined;
    let remainingQuota: number | undefined;

    try {
      // Placeholder for provider-specific validation
      switch (apiKey.provider) {
        case 'openai':
          // TODO: Call OpenAI API to validate
          break;
        case 'anthropic':
          // TODO: Call Anthropic API to validate
          break;
        case 'twitter':
          // TODO: Call Twitter API to validate
          break;
        // Add more providers as needed
      }

      // Update last validated timestamp
      await this.prisma.apiKey.update({
        where: { id },
        data: { lastValidated: new Date() },
      });
    } catch (err) {
      isValid = false;
      error = err instanceof Error ? err.message : 'Validation failed';
    }

    return {
      isValid,
      error,
      remainingQuota,
      validatedAt: new Date(),
    };
  }

  /**
   * Get decrypted API key (for internal use)
   */
  async getDecryptedKey(
    organizationId: string,
    provider: string,
  ): Promise<{ apiKey: string; secretKey?: string; accessToken?: string } | null> {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        organizationId,
        provider,
        isActive: true,
      },
    });

    if (!apiKey) {
      return null;
    }

    // Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    return {
      apiKey: this.crypto.decrypt(apiKey.encryptedApiKey),
      secretKey: apiKey.encryptedSecretKey
        ? this.crypto.decrypt(apiKey.encryptedSecretKey)
        : undefined,
      accessToken: apiKey.encryptedAccessToken
        ? this.crypto.decrypt(apiKey.encryptedAccessToken)
        : undefined,
    };
  }

  /**
   * Increment usage counter
   */
  async incrementUsage(organizationId: string, provider: string): Promise<void> {
    await this.prisma.apiKey.updateMany({
      where: {
        organizationId,
        provider,
        isActive: true,
      },
      data: {
        usageCurrent: { increment: 1 },
      },
    });
  }

  /**
   * Convert database entity to response DTO
   */
  private toResponseDto(apiKey: any): ApiKeyResponseDto {
    const decryptedApiKey = this.crypto.decrypt(apiKey.encryptedApiKey);

    return {
      id: apiKey.id,
      organizationId: apiKey.organizationId,
      keyType: apiKey.keyType,
      provider: apiKey.provider,
      name: apiKey.name,
      maskedApiKey: this.crypto.maskApiKey(decryptedApiKey),
      hasSecretKey: !!apiKey.encryptedSecretKey,
      hasAccessToken: !!apiKey.encryptedAccessToken,
      config: apiKey.config as Record<string, unknown>,
      usageCurrent: apiKey.usageCurrent,
      usageLimit: apiKey.usageLimit,
      usageResetAt: apiKey.usageResetAt,
      isActive: apiKey.isActive,
      lastValidated: apiKey.lastValidated,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
    };
  }
}
