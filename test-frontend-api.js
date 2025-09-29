// Test the frontend API client
import { accountsApi } from './apps/web/src/lib/api-client.js';

async function testFrontendAPI() {
  try {
    console.log('Testing frontend API client...');
    const data = await accountsApi.getAll();
    console.log('Frontend API client result:', data);
  } catch (error) {
    console.error('Frontend API client error:', error);
  }
}

testFrontendAPI();