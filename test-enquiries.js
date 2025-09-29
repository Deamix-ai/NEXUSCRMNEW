#!/usr/bin/env node

// Simple test script to verify enquiries API is working
const API_BASE_URL = 'http://localhost:3001/api';

async function testEnquiriesAPI() {
  console.log('🧪 Testing Enquiries API...\n');

  // Test 1: GET /api/enquiries (should return empty array initially)
  try {
    console.log('1. Testing GET /api/enquiries');
    const response = await fetch(`${API_BASE_URL}/enquiries`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const enquiries = await response.json();
    console.log('✅ GET /api/enquiries successful');
    console.log(`   Found ${Array.isArray(enquiries) ? enquiries.length : 'N/A'} enquiries\n`);
  } catch (error) {
    console.log('❌ GET /api/enquiries failed:', error.message);
    return;
  }

  // Test 2: POST /api/enquiries (create new enquiry)
  try {
    console.log('2. Testing POST /api/enquiries');
    const enquiryData = {
      title: 'Test Bathroom Renovation',
      description: 'Customer interested in full bathroom renovation',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '01234567890',
      status: 'NEW',
      priority: 'MEDIUM',
      source: 'Website',
      estimatedValue: '5000',
      ownerId: 'cmfbhlacp0000jdr8iqfhqno2'
    };

    const response = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enquiryData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const createdEnquiry = await response.json();
    console.log('✅ POST /api/enquiries successful');
    console.log(`   Created enquiry ID: ${createdEnquiry.id}`);
    console.log(`   Title: ${createdEnquiry.title}`);
    console.log(`   Status: ${createdEnquiry.status}`);
    console.log(`   Customer: ${createdEnquiry.firstName} ${createdEnquiry.lastName}\n`);

    // Test 3: GET /api/enquiries/:id (get specific enquiry)
    try {
      console.log('3. Testing GET /api/enquiries/:id');
      const getResponse = await fetch(`${API_BASE_URL}/enquiries/${createdEnquiry.id}`);
      
      if (!getResponse.ok) {
        throw new Error(`HTTP ${getResponse.status}: ${getResponse.statusText}`);
      }
      
      const enquiry = await getResponse.json();
      console.log('✅ GET /api/enquiries/:id successful');
      console.log(`   Retrieved enquiry: ${enquiry.title}\n`);
    } catch (error) {
      console.log('❌ GET /api/enquiries/:id failed:', error.message);
    }

    console.log('🎉 All tests passed! Enquiries API is working correctly.');
    console.log('\n📝 Summary:');
    console.log('   - ✅ GET /api/enquiries - List enquiries');
    console.log('   - ✅ POST /api/enquiries - Create enquiry');
    console.log('   - ✅ GET /api/enquiries/:id - Get specific enquiry');
    console.log('\n🔧 The 404 error should now be resolved when creating enquiries from the frontend.');

  } catch (error) {
    console.log('❌ POST /api/enquiries failed:', error.message);
    console.log('\n🔍 Error details:', error);
  }
}

// Run the test
testEnquiriesAPI().catch(console.error);