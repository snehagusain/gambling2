// Test script for Sports API connectivity
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Get API config from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_SPORTS_API_BASE_URL || 'https://www.thesportsdb.com/api/v1/json/3';
const API_KEY = process.env.NEXT_PUBLIC_SPORTS_API_KEY || '3'; // Default to free tier if not specified

console.log('Testing Sports API connectivity...');
console.log('API Base URL:', API_BASE_URL);
console.log('API Key:', API_KEY ? '✅ Set' : '❌ Missing');

// Test fetching some basic data
async function testSportsApi() {
  try {
    // Test with a simple API call to get all sports
    const response = await fetch(`${API_BASE_URL}/${API_KEY}/all_sports.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.sports && Array.isArray(data.sports)) {
      console.log(`✅ Sports API connection successful! Found ${data.sports.length} sports.`);
      console.log('Sample sports:', data.sports.slice(0, 3).map(sport => sport.strSport).join(', '), '...');
      return true;
    } else {
      console.error('❌ Sports API returned unexpected data format');
      console.log('Received:', JSON.stringify(data).substring(0, 100) + '...');
      return false;
    }
  } catch (error) {
    console.error('❌ Sports API error:', error.message);
    return false;
  }
}

// Run the test
testSportsApi()
  .then(success => {
    if (success) {
      console.log('✅ Sports API test passed!');
      process.exit(0);
    } else {
      console.error('❌ Sports API test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }); 