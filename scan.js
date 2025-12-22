export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY; // This pulls your secret from Vercel
  const { image } = JSON.parse(req.body);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [
        { text: "Extract part codes (Letter + 2 digits). Return ONLY a JSON array of strings." },
        { inlineData: { mimeType: "image/jpeg", data: image } }
      ]
    }],
    generationConfig: { responseMimeType: "application/json" }
  };

  try {
    const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to reach AI" });
  }
}