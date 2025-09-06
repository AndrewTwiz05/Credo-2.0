// This is the stable Node.js server for Credo 2.0.
// It uses the advanced prompt to get a structured analysis from the Gemini AI.

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- CONFIGURATION ---
const app = express();
const port = 3000;
require('dotenv').config();
const API_KEY = process.env.API_KEY;
// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// --- AI MODEL INITIALIZATION ---
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- API ENDPOINT ---
app.post('/analyze', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided for analysis.' });
    }

    console.log(`Received request to analyze text of length: ${text.length}`);

    // --- ADVANCED PROMPT ENGINEERING ---
    // This prompt asks the AI to act as a media literacy expert and return a detailed JSON object.
    const prompt = `
        Act as a media literacy expert. Analyze the following article text. Your goal is to assess its credibility, summarize its content, and find alternative perspectives for a general audience.

        Provide your analysis ONLY in a valid JSON object format with the following structure:
        {
          "summary": "A neutral, concise, 3-sentence summary of the article's main points.",
          "credibilityScore": A number from 1 to 10, where 1 is highly untrustworthy and 10 is highly credible.,
          "justification": "A brief, one-sentence explanation for your credibility score, mentioning the overall tone and sourcing.",
          "flags": [
            "A list of strings identifying potential red flags. Examples: 'Emotionally Charged Language', 'Lack of Specific Sources', 'Potential Political Bias', 'One-Sided Argument', 'Uses Generalizations'. If no flags, return an empty array."
          ],
          "perspectives": [
            {
              "title": "Use your knowledge to find a REAL article title from a different credible source that covers the same topic. Do not make one up.",
              "url": "http://example.com/link1",
              "source": "The real name of the news source (e.g., 'Reuters', 'BBC News')."
            },
            {
              "title": "Use your knowledge to find a SECOND REAL article title from another different credible source on the same topic.",
              "url": "http://example.com/link2",
              "source": "The real name of the second news source."
            }
          ]
        }

        Do not include any text or formatting outside of this JSON object.

        Article Text to Analyze:
        ---
        ${text}
        ---
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        console.log("AI Response received.");

        // Clean the response to ensure it's valid JSON
        const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const jsonResponse = JSON.parse(cleanedJsonString);
        
        res.json(jsonResponse);

    } catch (error) {
        console.error('Error processing AI request:', error);
        res.status(500).json({ error: 'Failed to analyze text with AI model.' });
    }
});

// --- START SERVER ---
app.listen(port, () => {
    console.log(`Credo 2.0 server listening on port ${port}`);
});