export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
  }

  const { contents, systemInstruction, messages, system } = req.body;
  
  const geminiBody = {
    contents: contents || messages || [],
  };

  if (systemInstruction) {
    geminiBody.systemInstruction = systemInstruction;
  } else if (system) {
    geminiBody.systemInstruction = { parts: [{ text: system }] };
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      }
    );

    const data = await geminiRes.json();
    return res.status(geminiRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Gemini API', details: err.message });
  }
}
