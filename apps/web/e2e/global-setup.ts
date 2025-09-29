import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Start with a clean browser context
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  console.log('🚀 Setting up E2E test environment...')
  
  try {
    // Wait for the web server to be ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
    console.log(`📡 Checking if web server is ready at ${baseURL}`)
    
    await page.goto(baseURL, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    })
    
    console.log('✅ Web server is ready')
    
    // Check if API server is ready
    const apiResponse = await page.request.get('http://localhost:3001/api')
    if (!apiResponse.ok()) {
      throw new Error(`API server not ready: ${apiResponse.status()}`)
    }
    
    console.log('✅ API server is ready')
    
    // Set up test data if needed
    await setupTestData(page)
    
    console.log('✅ E2E test environment setup complete')
    
  } catch (error) {
    console.error('❌ E2E setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

async function setupTestData(page: any) {
  // Create test users, clients, projects etc. if needed
  console.log('📊 Setting up test data...')
  
  // Example: Create test client via API
  try {
    const testClient = {
      name: 'E2E Test Client',
      email: 'e2e-test@example.com',
      phone: '+44 20 1234 5678',
      type: 'INDIVIDUAL',
      status: 'ACTIVE'
    }
    
    await page.request.post('http://localhost:3001/api/clients', {
      data: testClient,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Test data created')
  } catch (error) {
    console.warn('⚠️ Could not create test data:', error)
    // Don't fail setup if test data creation fails
  }
}

export default globalSetup