/**
 * Admin Module
 * System administration features
 */

import { Module } from '@nestjs/common';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { KeywordsModule } from './keywords/keywords.module';
import { SchedulesModule } from './schedules/schedules.module';
import { RegionsModule } from './regions/regions.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ApiKeysModule,
    KeywordsModule,
    SchedulesModule,
    RegionsModule,
    AccountsModule,
  ],
})
export class AdminModule {}
