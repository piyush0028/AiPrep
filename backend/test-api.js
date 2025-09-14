require('dotenv').config();

console.log('=== Testing OpenAI API Key ===');
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('API Key starts with:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'No key found');

// Test if the key is in the right format
if (process.env.OPENAI_API_KEY) {
  if (process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.log('✅ API key format looks correct (starts with sk-)');
  } else {
    console.log('❌ API key format may be wrong (should start with sk-)');
  }
}