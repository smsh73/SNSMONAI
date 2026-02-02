/**
 * API Keys Controller
 * REST endpoints for API key management
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import {
  CreateApiKeyDto,
  UpdateApiKeyDto,
  ListApiKeysQueryDto,
  ApiKeyResponseDto,
  ValidateApiKeyResponseDto,
} from './dto/api-key.dto';

// TODO: Replace with actual organization ID from JWT token
const TEMP_ORG_ID = 'temp-org-id';

@ApiTags('api-keys')
@ApiBearerAuth()
@Controller('admin/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({
    status: 201,
    description: 'API key created successfully',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'API key already exists' })
  async create(@Body() dto: CreateApiKeyDto): Promise<ApiKeyResponseDto> {
    return this.apiKeysService.create(TEMP_ORG_ID, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys' })
  @ApiResponse({
    status: 200,
    description: 'List of API keys',
  })
  async findAll(@Query() query: ListApiKeysQueryDto) {
    return this.apiKeysService.findAll(TEMP_ORG_ID, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API key by ID' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({
    status: 200,
    description: 'API key details',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async findOne(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeysService.findOne(TEMP_ORG_ID, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an API key' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({
    status: 200,
    description: 'API key updated successfully',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeysService.update(TEMP_ORG_ID, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({ status: 204, description: 'API key deleted successfully' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.apiKeysService.delete(TEMP_ORG_ID, id);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate an API key' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({
    status: 200,
    description: 'Validation result',
    type: ValidateApiKeyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async validate(@Param('id') id: string): Promise<ValidateApiKeyResponseDto> {
    return this.apiKeysService.validate(TEMP_ORG_ID, id);
  }
}
