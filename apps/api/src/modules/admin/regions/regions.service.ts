/**
 * Regions Service
 * Business logic for geographic region management
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { INDONESIA_PROVINCES, INDONESIA_MAJOR_CITIES } from '@snsmon/shared/constants';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all Indonesia provinces
   */
  getProvinces() {
    return {
      provinces: INDONESIA_PROVINCES,
      total: INDONESIA_PROVINCES.length,
    };
  }

  /**
   * Get all major cities
   */
  getMajorCities() {
    return {
      cities: INDONESIA_MAJOR_CITIES,
      total: INDONESIA_MAJOR_CITIES.length,
    };
  }

  /**
   * Get cities by province code
   */
  getCitiesByProvince(provinceCode: string) {
    const cities = INDONESIA_MAJOR_CITIES.filter(
      (city) => city.parentCode === provinceCode,
    );
    return {
      cities,
      total: cities.length,
    };
  }

  /**
   * Get region configuration for an organization
   */
  async getConfig(organizationId: string) {
    let config = await this.prisma.regionConfig.findUnique({
      where: { organizationId },
    });

    if (!config) {
      // Create default config
      config = await this.prisma.regionConfig.create({
        data: {
          organizationId,
          enabledCountries: ['ID'],
          enabledProvinces: [],
          enabledCities: [],
          regionalKeywords: [],
          regionalAlerts: [],
        },
      });
    }

    return config;
  }

  /**
   * Update region configuration
   */
  async updateConfig(
    organizationId: string,
    data: {
      enabledCountries?: string[];
      enabledProvinces?: string[];
      enabledCities?: string[];
      regionalKeywords?: any[];
      regionalAlerts?: any[];
    },
  ) {
    const existing = await this.prisma.regionConfig.findUnique({
      where: { organizationId },
    });

    if (!existing) {
      return this.prisma.regionConfig.create({
        data: {
          organizationId,
          ...data,
        },
      });
    }

    return this.prisma.regionConfig.update({
      where: { organizationId },
      data,
    });
  }

  /**
   * Get region by code
   */
  getRegionByCode(code: string) {
    // First check provinces
    const province = INDONESIA_PROVINCES.find((p) => p.code === code);
    if (province) {
      return province;
    }

    // Then check cities
    const city = INDONESIA_MAJOR_CITIES.find((c) => c.code === code);
    if (city) {
      return city;
    }

    throw new NotFoundException(`Region with code "${code}" not found`);
  }

  /**
   * Search regions by name
   */
  searchRegions(query: string, limit = 20) {
    const lowercaseQuery = query.toLowerCase();

    const matchingProvinces = INDONESIA_PROVINCES.filter(
      (p) =>
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.nameLocal.toLowerCase().includes(lowercaseQuery),
    );

    const matchingCities = INDONESIA_MAJOR_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(lowercaseQuery) ||
        c.nameLocal.toLowerCase().includes(lowercaseQuery),
    );

    const results = [...matchingProvinces, ...matchingCities].slice(0, limit);

    return {
      results,
      total: results.length,
    };
  }
}
