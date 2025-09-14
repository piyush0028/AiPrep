async function generateExplanation(question) {
  try {
    console.log('Generating explanation for:', question);

    // Ollama runs on http://localhost:11434
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: `Explain this concept in simple terms: "${question}". Keep it brief and educational.`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.response;
    
    console.log('Ollama response:', explanation);

    return {
      text: explanation,
      visualization: createVisualizationForQuestion(question)
    };

  } catch (error) {
    console.error('Ollama HTTP error:', error.message);
    return getSmartResponse(question);
  }
}

function createVisualizationForQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('hydrogen') || lowerQuestion.includes('element') || lowerQuestion.includes('atom')) {
    return {
      id: `vis_${Date.now()}`,
      duration: 4000,
      fps: 30,
      layers: [
        {
          id: 'nucleus',
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
    };
  }
  else if (lowerQuestion.includes('math') || lowerQuestion.includes('+') || lowerQuestion.includes('add')) {
    return {
      id: `vis_${Date.now()}`,
      duration: 3000,
      fps: 30,
      layers: [
        {
          id: 'number1',
          type: 'text',
          props: { x: 200, y: 200, text: '2', fontSize: 40, fill: '#000' },
          animations: []
        },
        {
          id: 'plus',
          type: 'text',
          props: { x: 250, y: 200, text: '+', fontSize: 40, fill: '#000' },
          animations: []
        },
        {
          id: 'number2',
          type: 'text',
          props: { x: 300, y: 200, text: '2', fontSize: 40, fill: '#000' },
          animations: []
        },
        {
          id: 'equals',
          type: 'text',
          props: { x: 350, y: 200, text: '=', fontSize: 40, fill: '#000' },
          animations: []
        },
        {
          id: 'result',
          type: 'text',
          props: { x: 400, y: 200, text: '4', fontSize: 40, fill: '#000' },
          animations: [
            { property: 'opacity', from: 0, to: 1, start: 2000, end: 3000 }
          ]
        }
      ]
    };
  }
  else {
    return {
      id: `vis_${Date.now()}`,
      duration: 4000,
      fps: 30,
      layers: [
        {
          id: 'element',
          type: 'circle',
          props: { x: 100, y: 200, r: 20, fill: '#3498db' },
          animations: [
            { property: 'x', from: 100, to: 400, start: 0, end: 3000 }
          ]
        }
      ]
    };
  }
}

function getSmartResponse(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('hydrogen')) {
    return {
      text: "Hydrogen is the first element on the periodic table. It's the lightest and most abundant element in the universe, consisting of one proton and one electron. Hydrogen is essential for water (H₂O) and many chemical processes.",
      visualization: createVisualizationForQuestion(question)
    };
  }
  else if (lowerQuestion.includes('newton') || lowerQuestion.includes('motion')) {
    return {
      text: "Newton's First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. This is also called the law of inertia.",
      visualization: {
        id: `vis_${Date.now()}`,
        duration: 5000,
        fps: 30,
        layers: [
          {
            id: 'ball',
            type: 'circle',
            props: { x: 50, y: 200, r: 20, fill: '#3498db' },
            animations: [
              { property: 'x', from: 50, to: 500, start: 0, end: 4000 }
            ]
          }
        ]
      }
    };
  }
  else {
    return {
      text: `"${question}" is an important concept that can be understood through visualizations and clear explanations.`,
      visualization: createVisualizationForQuestion(question)
    };
  }
}

module.exports = { generateExplanation };