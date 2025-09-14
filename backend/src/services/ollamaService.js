const ollama = require('ollama');

async function generateExplanation(question) {
  try {
    console.log('Generating explanation for:', question);

    // Simpler, more direct prompt
    const prompt = `
Create an educational explanation and visualization for: "${question}"

RETURN ONLY THIS JSON FORMAT (NO OTHER TEXT):
{
  "text": "Simple explanation here",
  "visualization": {
    "layers": [
      {
        "type": "shape",
        "props": { "color": "blue", "size": 20 },
        "animations": []
      }
    ]
  }
}
`;

    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [
        { 
          role: 'system', 
          content: 'You are a teacher. Always return ONLY valid JSON. No other text.' 
        },
        { role: 'user', content: prompt }
      ],
      format: 'json',
      options: {
        temperature: 0.1
      }
    });

    console.log('Ollama response:', response.message.content);

    // Extract JSON from response (even if there's extra text)
    const jsonMatch = response.message.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        
        // Ensure basic structure exists
        if (!result.text) result.text = `Explanation of: ${question}`;
        if (!result.visualization) result.visualization = createBasicVisualization();
        
        return result;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
      }
    }

    // If JSON extraction fails, use smart fallback
    return getSmartResponse(question, response.message.content);

  } catch (error) {
    console.error('Ollama error:', error);
    return getSmartResponse(question);
  }
}

// Smart response generator that uses the actual response text
function getSmartResponse(question, rawResponse = '') {
  // Try to extract meaningful text from the raw response
  let explanationText = rawResponse;
  
  // Remove JSON artifacts and get clean text
  explanationText = explanationText
    .replace(/\{[\s\S]*?\}/g, '') // Remove JSON blocks
    .replace(/```/g, '') // Remove code blocks
    .trim();
  
  // If we have meaningful text, use it
  if (explanationText && explanationText.length > 20) {
    return {
      text: explanationText,
      visualization: createBasicVisualization()
    };
  }
  
  // Otherwise use question-specific mock responses
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('hydrogen')) {
    return {
      text: "Hydrogen is the first element on the periodic table. It's the lightest and most abundant element in the universe, consisting of one proton and one electron. Hydrogen is essential for water (H₂O) and many chemical processes.",
      visualization: {
        id: `vis_${Date.now()}`,
        duration: 4000,
        fps: 30,
        layers: [
          {
            id: 'atom',
            type: 'circle',
            props: { x: 300, y: 200, r: 30, fill: '#e74c3c' },
            animations: []
          },
          {
            id: 'electron',
            type: 'circle',
            props: { x: 250, y: 200, r: 8, fill: '#3498db' },
            animations: [
              { property: 'orbit', centerX: 300, centerY: 200, radius: 50, duration: 3000 }
            ]
          }
        ]
      }
    };
  }
  else if (lowerQuestion.includes('water') || lowerQuestion.includes('h2o')) {
    return {
      text: "Water (H₂O) is a molecule made of two hydrogen atoms and one oxygen atom. It's essential for all known forms of life and covers about 71% of Earth's surface.",
      visualization: {
        id: `vis_${Date.now()}`,
        duration: 5000,
        fps: 30,
        layers: [
          {
            id: 'oxygen',
            type: 'circle',
            props: { x: 300, y: 200, r: 25, fill: '#e74c3c' },
            animations: []
          },
          {
            id: 'hydrogen1',
            type: 'circle',
            props: { x: 270, y: 180, r: 15, fill: '#3498db' },
            animations: []
          },
          {
            id: 'hydrogen2',
            type: 'circle',
            props: { x: 270, y: 220, r: 15, fill: '#3498db' },
            animations: []
          }
        ]
      }
    };
  }
  else {
    return {
      text: `"${question}" is an important concept. ${rawResponse || 'It can be understood through simple visualizations and clear explanations.'}`,
      visualization: createBasicVisualization()
    };
  }
}

function createBasicVisualization() {
  return {
    id: `vis_${Date.now()}`,
    duration: 4000,
    fps: 30,
    layers: [
      {
        id: 'element1',
        type: 'circle',
        props: { x: 100, y: 200, r: 20, fill: '#3498db' },
        animations: [
          { property: 'x', from: 100, to: 400, start: 0, end: 3000 }
        ]
      }
    ]
  };
}

module.exports = { generateExplanation };