import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API status' })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  getHealthCheck(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }

  @Get('api/dashboard/stats')
  @ApiTags('Dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats() {
    return this.appService.getDashboardStats();
  }
}
