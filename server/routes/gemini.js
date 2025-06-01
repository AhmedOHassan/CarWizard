import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import SerpApi from "google-search-results-nodejs";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

function cleanPartKeywords(parts) {
  return parts.map(part =>
    part
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
  );
}

const getSearchLinks = (query) => {
  return new Promise((resolve) => {
    const params = {
      engine: "google",
      q: query,
      location: "United States",
      hl: "en",
      gl: "us",
    };

    search.json(params, (data) => {
      const results = data.organic_results?.slice(0, 3).map(r => ({
        title: r.title,
        link: r.link,
        snippet: r.snippet,
      })) || [];
      resolve(results);
    });
  });
};

router.post("/", async (req, res) => {
  const { make, model: carModel, year, problem } = req.body;

  try {
    const prompt = `
You are CarWizard, an expert AI car mechanic.

A user is reporting a car issue:
- Make: ${make}
- Model: ${carModel}
- Year: ${year}
- Problem: ${problem}

Please respond ONLY in JSON format like this:

{
  "diagnosis": "A brief paragraph identifying the likely cause of the issue.",
  "troubleshootingSteps": ["Step 1", "Step 2", "Step 3"],
  "replacementParts": ["Part name 1", "Part name 2"],
  "videoSearchTerms": ["Search term 1", "Search term 2"]
}
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const candidate = response.candidates?.[0];
    let content = candidate?.content?.parts?.[0]?.text;

    if (!content) {
      return res.status(500).json({ error: "No content returned from Gemini." });
    }

    content = content.replace(/^```json\s*|\s*```$/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("JSON parsing failed. Gemini returned:", content);
      return res.status(500).json({ error: "Gemini did not return valid JSON." });
    }

    console.log("Parsed response:", parsed);

    const cleanedParts = cleanPartKeywords(parsed.replacementParts);
    const partsQuery = `${make} ${carModel} ${year} (${cleanedParts.join(" OR ")}) site:amazon.com OR site:autozone.com OR site:shop.advanceautoparts.com`;

    const videoSearchQueries = parsed.videoSearchTerms.map(term =>
      `${year} ${make} ${carModel} ${term} site:youtube.com`
    );

    const videoSearches = await Promise.all(
      videoSearchQueries.map(getSearchLinks)
    );
    const videoResults = videoSearches.flat().slice(0, 3);

    const productResults = await getSearchLinks(partsQuery);

    res.json({
      diagnosis: parsed.diagnosis,
      troubleshootingSteps: parsed.troubleshootingSteps,
      replacementParts: productResults,
      tutorials: videoResults,
    });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
