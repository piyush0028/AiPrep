// debug-ollama.js
const ollama = require('ollama');

async function testOllama() {
  try {
    console.log("Testing Ollama with simple question...");

    const response = await ollama.generate({
      model: "llama3.2",
      prompt: "Explain what hydrogen is in simple terms.",
      options: {
        temperature: 0.1
      }
    });

    console.log("✅ Ollama response:");
    console.log(response.response);

  } catch (err) {
    console.error("❌ Ollama test failed:", err.message);
  }
}

testOllama();
