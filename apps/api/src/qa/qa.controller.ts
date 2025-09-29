import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QAService, CreateTestPlanDto, CreateTestCaseDto, CreateTestExecutionDto, UpdateTestExecutionDto, CreateDefectDto } from './qa.service';

@ApiTags('Quality Assurance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('qa')
export class QAController {
  constructor(private readonly qaService: QAService) {}

  // Test Plan endpoints
  @Post('test-plans')
  @ApiOperation({ summary: 'Create a new test plan' })
  @ApiResponse({ status: 201, description: 'Test plan created successfully' })
  async createTestPlan(@Body() createTestPlanDto: CreateTestPlanDto, @Request() req: any) {
    return this.qaService.createTestPlan(createTestPlanDto, req.user.userId);
  }

  @Get('test-plans')
  @ApiOperation({ summary: 'Get all test plans with optional filters' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'assignedToId', required: false })
  async getTestPlans(
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.qaService.getTestPlans({
      status: status as any,
      projectId,
      assignedToId,
    });
  }

  @Get('test-plans/:id')
  @ApiOperation({ summary: 'Get test plan by ID' })
  async getTestPlan(@Param('id') id: string) {
    return this.qaService.getTestPlan(id);
  }

  @Put('test-plans/:id')
  @ApiOperation({ summary: 'Update test plan' })
  async updateTestPlan(@Param('id') id: string, @Body() updateTestPlanDto: Partial<CreateTestPlanDto>) {
    return this.qaService.updateTestPlan(id, updateTestPlanDto);
  }

  @Delete('test-plans/:id')
  @ApiOperation({ summary: 'Delete test plan' })
  async deleteTestPlan(@Param('id') id: string) {
    return this.qaService.deleteTestPlan(id);
  }

  @Get('test-plans/:id/coverage')
  @ApiOperation({ summary: 'Get test coverage for a test plan' })
  async getTestCoverage(@Param('id') id: string) {
    return this.qaService.getTestCoverageByPlan(id);
  }

  // Test Case endpoints
  @Post('test-cases')
  @ApiOperation({ summary: 'Create a new test case' })
  @ApiResponse({ status: 201, description: 'Test case created successfully' })
  async createTestCase(@Body() createTestCaseDto: CreateTestCaseDto, @Request() req: any) {
    return this.qaService.createTestCase(createTestCaseDto, req.user.userId);
  }

  @Get('test-cases')
  @ApiOperation({ summary: 'Get test cases with optional filters' })
  @ApiQuery({ name: 'testPlanId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  async getTestCases(
    @Query('testPlanId') testPlanId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('tags') tags?: string | string[],
  ) {
    const tagsArray = Array.isArray(tags) ? tags : tags ? [tags] : undefined;
    return this.qaService.getTestCases(testPlanId, {
      status: status as any,
      priority,
      tags: tagsArray,
    });
  }

  @Put('test-cases/:id')
  @ApiOperation({ summary: 'Update test case' })
  async updateTestCase(@Param('id') id: string, @Body() updateTestCaseDto: Partial<CreateTestCaseDto>) {
    return this.qaService.updateTestCase(id, updateTestCaseDto);
  }

  // Test Execution endpoints
  @Post('test-executions')
  @ApiOperation({ summary: 'Start a new test execution' })
  @ApiResponse({ status: 201, description: 'Test execution started successfully' })
  async createTestExecution(@Body() createTestExecutionDto: CreateTestExecutionDto, @Request() req: any) {
    return this.qaService.createTestExecution(createTestExecutionDto, req.user.userId);
  }

  @Get('test-executions')
  @ApiOperation({ summary: 'Get test executions with optional filters' })
  @ApiQuery({ name: 'testPlanId', required: false })
  @ApiQuery({ name: 'testCaseId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'executedById', required: false })
  async getTestExecutions(
    @Query('testPlanId') testPlanId?: string,
    @Query('testCaseId') testCaseId?: string,
    @Query('status') status?: string,
    @Query('executedById') executedById?: string,
  ) {
    return this.qaService.getTestExecutions({
      testPlanId,
      testCaseId,
      status: status as any,
      executedById,
    });
  }

  @Put('test-executions/:id')
  @ApiOperation({ summary: 'Update test execution results' })
  async updateTestExecution(@Param('id') id: string, @Body() updateTestExecutionDto: UpdateTestExecutionDto) {
    return this.qaService.updateTestExecution(id, updateTestExecutionDto);
  }

  // Defect endpoints
  @Post('defects')
  @ApiOperation({ summary: 'Report a new defect' })
  @ApiResponse({ status: 201, description: 'Defect reported successfully' })
  async createDefect(@Body() createDefectDto: CreateDefectDto, @Request() req: any) {
    return this.qaService.createDefect(createDefectDto, req.user.userId);
  }

  @Get('defects')
  @ApiOperation({ summary: 'Get defects with optional filters' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'assignedToId', required: false })
  @ApiQuery({ name: 'reportedById', required: false })
  @ApiQuery({ name: 'testExecutionId', required: false })
  async getDefects(
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('priority') priority?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('reportedById') reportedById?: string,
    @Query('testExecutionId') testExecutionId?: string,
  ) {
    return this.qaService.getDefects({
      status: status as any,
      severity: severity as any,
      priority: priority as any,
      assignedToId,
      reportedById,
      testExecutionId,
    });
  }

  @Get('defects/:id')
  @ApiOperation({ summary: 'Get defect by ID' })
  async getDefect(@Param('id') id: string) {
    return this.qaService.getDefect(id);
  }

  @Put('defects/:id')
  @ApiOperation({ summary: 'Update defect' })
  async updateDefect(@Param('id') id: string, @Body() updateDefectDto: Partial<CreateDefectDto>) {
    return this.qaService.updateDefect(id, updateDefectDto);
  }

  @Post('defects/:id/comments')
  @ApiOperation({ summary: 'Add comment to defect' })
  async addDefectComment(
    @Param('id') id: string,
    @Body() body: { content: string; isInternal?: boolean },
    @Request() req: any,
  ) {
    return this.qaService.addDefectComment(id, body.content, req.user.userId, body.isInternal);
  }

  // QA Review endpoints
  @Post('reviews')
  @ApiOperation({ summary: 'Create a new QA review' })
  @ApiResponse({ status: 201, description: 'QA review created successfully' })
  async createQAReview(
    @Body() body: {
      title: string;
      description: string;
      type: string;
      entityId: string;
      testPlanId?: string;
    },
    @Request() req: any,
  ) {
    return this.qaService.createQAReview(
      body.title,
      body.description,
      body.type,
      body.entityId,
      req.user.userId,
      body.testPlanId,
    );
  }

  @Put('reviews/:id')
  @ApiOperation({ summary: 'Update QA review' })
  async updateQAReview(
    @Param('id') id: string,
    @Body() body: {
      status?: string;
      findings?: string;
      recommendations?: string;
      approved?: boolean;
    },
  ) {
    return this.qaService.updateQAReview(id, {
      status: body.status as any,
      findings: body.findings,
      recommendations: body.recommendations,
      approved: body.approved,
    });
  }

  // Analytics endpoints
  @Get('metrics')
  @ApiOperation({ summary: 'Get QA metrics and analytics' })
  async getQAMetrics() {
    return this.qaService.getQAMetrics();
  }
}