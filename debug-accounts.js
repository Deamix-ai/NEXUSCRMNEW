// Simple test to debug the accounts API issue
const API_BASE_URL = 'http://localhost:3001/api';

async function testAccountsAPI() {
  try {
    console.log('Testing direct API call...');
    const response = await fetch(`${API_BASE_URL}/accounts`);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      console.log('Number of accounts:', Array.isArray(data) ? data.length : 'Not an array');
    } else {
      console.error('API Error:', response.statusText);
      const errorText = await response.text();
      console.error('Error body:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testAccountsAPI();