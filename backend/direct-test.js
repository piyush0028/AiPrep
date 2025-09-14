require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testSimple() {
  try {
    console.log('Testing simple OpenAI call...');
    
    // Very simple test without JSON response format
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "user", 
          content: "Just say 'hello world' without any formatting" 
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 10
    });

    console.log('✅ SUCCESS! Response:', completion.choices[0].message.content);
    return true;
    
  } catch (error) {
    console.error('❌ FAILED:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return false;
  }
}

// Test without JSON format first
testSimple().then(success => {
  if (success) {
    console.log('\nNow testing with JSON format...');
    testWithJSON();
  }
});

async function testWithJSON() {
  try {
    console.log('Testing with JSON response format...');
    
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "user", 
          content: "Respond with JSON: {\\\"message\\\": \\\"hello\\\"}" 
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    console.log('✅ JSON SUCCESS! Response:', completion.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ JSON FAILED:');
    console.error('Error message:', error.message);
  }
}