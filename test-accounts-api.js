// Test API call directly
const API_BASE_URL = 'http://localhost:3001/api';

async function testAccountsAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`);
    const data = await response.json();
    console.log('Direct API test - Status:', response.status);
    console.log('Direct API test - Data:', data);
    return data;
  } catch (error) {
    console.error('Direct API test - Error:', error);
    throw error;
  }
}

// Test the function
testAccountsAPI()
  .then(data => {
    console.log('Success! Got', data?.data?.length || 0, 'accounts');
  })
  .catch(error => {
    console.error('Failed:', error);
  });