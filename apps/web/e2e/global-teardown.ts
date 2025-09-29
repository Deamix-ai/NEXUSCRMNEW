import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up E2E test environment...')
  
  try {
    // Clean up test data
    await cleanupTestData()
    
    console.log('✅ E2E test environment cleanup complete')
  } catch (error) {
    console.error('❌ E2E teardown failed:', error)
    // Don't throw to avoid masking test failures
  }
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...')
  
  try {
    // Example: Delete test clients
    const response = await fetch('http://localhost:3001/api/clients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const testClients = data.clients?.filter((client: any) => 
        client.email?.includes('e2e-test') || client.name?.includes('E2E Test')
      )
      
      for (const client of testClients || []) {
        await fetch(`http://localhost:3001/api/clients/${client.id}`, {
          method: 'DELETE'
        })
      }
    }
    
    console.log('✅ Test data cleaned up')
  } catch (error) {
    console.warn('⚠️ Could not clean up test data:', error)
  }
}

export default globalTeardown