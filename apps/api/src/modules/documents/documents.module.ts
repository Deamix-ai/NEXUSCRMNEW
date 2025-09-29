import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController, ClientDocumentsController, RoomDocumentsController } from './documents.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentsController, ClientDocumentsController, RoomDocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
