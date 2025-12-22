export default async function handler(req, res) {
  // 1. Pull the secret key safely from the server environment
  const apiKey = process.env.GEMINI_API_KEY; 

  // 2. Parse the image data sent from your index.html
  const { image } = JSON.parse(req.body);

  // 3. Define the stable model URL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [
        { text: "Extract part codes (Letter + 2 digits). Return ONLY a JSON array of strings." },
        { inlineData: { mimeType: "image/jpeg", data: image } }
      ]
    }],
    generationConfig: { 
      responseMimeType: "application/json" 
    }
  };

  try {
    const response = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) 
    });

    if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ error: errorData.error?.message || "AI API Error" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server failed to reach AI provider" });
  }
}
