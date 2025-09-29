import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { WorkflowModule } from './workflow/workflow.module';
import { QAModule } from './qa/qa.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    DatabaseModule,
    AuthModule,
    LeadsModule,
    AccountsModule,
    EnquiriesModule,
    RoomsModule,
    ClientsModule,
    ActivitiesModule,
    ProjectsModule,
    DocumentsModule,
    WorkflowModule,
    QAModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
