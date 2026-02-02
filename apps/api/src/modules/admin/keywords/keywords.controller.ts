/**
 * Keywords Controller
 * REST endpoints for keyword management
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
import { KeywordsService } from './keywords.service';
import {
  CreateKeywordDto,
  UpdateKeywordDto,
  ListKeywordsQueryDto,
  KeywordResponseDto,
  DefaultKeywordsResponseDto,
} from './dto/keyword.dto';

// TODO: Replace with actual organization ID from JWT token
const TEMP_ORG_ID = 'temp-org-id';

@ApiTags('keywords')
@ApiBearerAuth()
@Controller('admin/keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new keyword configuration' })
  @ApiResponse({
    status: 201,
    description: 'Keyword configuration created successfully',
    type: KeywordResponseDto,
  })
  async create(@Body() dto: CreateKeywordDto): Promise<KeywordResponseDto> {
    return this.keywordsService.create(TEMP_ORG_ID, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all keyword configurations' })
  @ApiResponse({ status: 200, description: 'List of keyword configurations' })
  async findAll(@Query() query: ListKeywordsQueryDto) {
    return this.keywordsService.findAll(TEMP_ORG_ID, query);
  }

  @Get('defaults')
  @ApiOperation({ summary: 'Get default crisis keywords (Indonesian)' })
  @ApiResponse({
    status: 200,
    description: 'Default crisis keywords by category',
    type: DefaultKeywordsResponseDto,
  })
  getDefaultKeywords(): DefaultKeywordsResponseDto {
    return this.keywordsService.getDefaultKeywords();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a keyword configuration by ID' })
  @ApiParam({ name: 'id', description: 'Keyword configuration ID' })
  @ApiResponse({
    status: 200,
    description: 'Keyword configuration details',
    type: KeywordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Keyword configuration not found' })
  async findOne(@Param('id') id: string): Promise<KeywordResponseDto> {
    return this.keywordsService.findOne(TEMP_ORG_ID, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a keyword configuration' })
  @ApiParam({ name: 'id', description: 'Keyword configuration ID' })
  @ApiResponse({
    status: 200,
    description: 'Keyword configuration updated successfully',
    type: KeywordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Keyword configuration not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateKeywordDto,
  ): Promise<KeywordResponseDto> {
    return this.keywordsService.update(TEMP_ORG_ID, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a keyword configuration' })
  @ApiParam({ name: 'id', description: 'Keyword configuration ID' })
  @ApiResponse({ status: 204, description: 'Keyword configuration deleted successfully' })
  @ApiResponse({ status: 404, description: 'Keyword configuration not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.keywordsService.delete(TEMP_ORG_ID, id);
  }
}
