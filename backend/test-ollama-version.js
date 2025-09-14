const ollama = require('ollama');

async function test() {
  try {
    console.log('Testing Ollama with version 0.5.17 syntax...');
    
    // Try different syntax options
    console.log('1. Testing ollama.pull()...');
    const models = await ollama.pull({ model: 'llama3.2' });
    console.log('Pull result:', models);
    
    console.log('2. Testing ollama.generate()...');
    const response = await ollama.generate({ model: 'llama3.2', prompt: 'Hello' });
    console.log('Generate result:', response);
    
    console.log('3. Testing ollama.list()...');
    const list = await ollama.list();
    console.log('List result:', list);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

test();