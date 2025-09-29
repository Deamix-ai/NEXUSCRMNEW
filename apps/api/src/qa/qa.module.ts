import { Module } from '@nestjs/common';
import { QAController } from './qa.controller';
import { QAService } from './qa.service';
import { DatabaseModule } from '../modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [QAController],
  providers: [QAService],
  exports: [QAService],
})
export class QAModule {}