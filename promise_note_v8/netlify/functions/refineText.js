const fetch = require('node-fetch');
exports.handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Je bent een professionele notulist. Maak van deze ruwe notitie een nette, bondige versie in het Nederlands.' },
          { role: 'user', content: text }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });
    const { choices } = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ refined: choices[0].message.content })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};