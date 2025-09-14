async function test() {
  try {
    console.log('Testing Ollama HTTP connection...');
    
    // Test if Ollama is responding
    const response = await fetch('http://localhost:11434/api/tags');
    const data = await response.json();
    console.log('✅ Ollama is running! Available models:', data.models);
    
    // Test generating a response
    console.log('\nTesting generation...');
    const genResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: 'What is hydrogen? Answer in one sentence.',
        stream: false
      })
    });
    
    const genData = await genResponse.json();
    console.log('✅ Generation test successful!');
    console.log('Response:', genData.response);
    
  } catch (error) {
    console.error('❌ Ollama test failed:', error.message);
  }
}

test();