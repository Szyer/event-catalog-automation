const axios = require('axios');

// Function to send a request to the ChatGPT API
async function getChatGPTResponse(text) {
  const apiKey = 'MYik1HmyEKCRgtvMlfMRT3BlbkFJiaPPpdiwcDF8MmvVt33i'; 
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await axios.post(endpoint, {
      model: 'text-davinci-003',
      messages: [
        {
          role: 'user',
          content: text
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Return the generated response
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting response from ChatGPT:', error);
    return null;
  }
}

// Example usage
async function main() {
  const userInput = 'Hello, how are you?';
  const chatGPTResponse = await getChatGPTResponse(userInput);
  console.log('ChatGPT Response:', chatGPTResponse);
}

main();
