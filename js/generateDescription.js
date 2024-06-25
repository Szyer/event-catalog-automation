const axios = require('axios');

async function generateEventDescription(event, apiKey) {
  const prompt = `Generate a detailed description for the following event:
  Event Type: ${event.type}
  Event Version: ${event.version}
  Event Summary: ${event.summary}
  Event Details: ${event.details || "No additional details provided."}
  
  Description:`;

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "text-davinci-003",  // You can use any model available in the OpenAI API
      prompt: prompt,
      max_tokens: 150,  // Adjust the number of tokens based on your needs
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const description = response.data.choices[0].text.trim();
    return description;
  } catch (error) {
    console.error('Error generating description:', error);
    return "No description available.";
  }
}
