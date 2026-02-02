/**
 * Regions Controller
 * REST endpoints for region management
 */

import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RegionsService } from './regions.service';

// TODO: Replace with actual organization ID from JWT token
const TEMP_ORG_ID = 'temp-org-id';

@ApiTags('regions')
@ApiBearerAuth()
@Controller('admin/regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Get all Indonesia provinces (38 total)' })
  @ApiResponse({ status: 200, description: 'List of Indonesia provinces' })
  getProvinces() {
    return this.regionsService.getProvinces();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get all major cities' })
  @ApiResponse({ status: 200, description: 'List of major cities' })
  getMajorCities() {
    return this.regionsService.getMajorCities();
  }

  @Get('cities/:provinceCode')
  @ApiOperation({ summary: 'Get cities by province code' })
  @ApiParam({ name: 'provinceCode', description: 'Province code (e.g., 31 for Jakarta)' })
  @ApiResponse({ status: 200, description: 'List of cities in the province' })
  getCitiesByProvince(@Param('provinceCode') provinceCode: string) {
    return this.regionsService.getCitiesByProvince(provinceCode);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search regions by name' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results (default: 20)' })
  @ApiResponse({ status: 200, description: 'Search results' })
  searchRegions(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.regionsService.searchRegions(query, limit || 20);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get region configuration for organization' })
  @ApiResponse({ status: 200, description: 'Region configuration' })
  async getConfig() {
    return this.regionsService.getConfig(TEMP_ORG_ID);
  }

  @Put('config')
  @ApiOperation({ summary: 'Update region configuration' })
  @ApiResponse({ status: 200, description: 'Updated region configuration' })
  async updateConfig(
    @Body() data: {
      enabledCountries?: string[];
      enabledProvinces?: string[];
      enabledCities?: string[];
      regionalKeywords?: any[];
      regionalAlerts?: any[];
    },
  ) {
    return this.regionsService.updateConfig(TEMP_ORG_ID, data);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get region by code' })
  @ApiParam({ name: 'code', description: 'Region code' })
  @ApiResponse({ status: 200, description: 'Region details' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  getRegionByCode(@Param('code') code: string) {
    return this.regionsService.getRegionByCode(code);
  }
}
