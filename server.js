import express from 'express';
import { OpenAI } from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MEALS_CACHE_FILE = path.resolve('./meal_analysis_cache.json');

async function loadCache(filename, defaultValue) {
  try {
    const content = await fs.readFile(filename, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filename, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    throw err;
  }
}

async function saveCache(filename, cache) {
  await fs.writeFile(filename, JSON.stringify(cache, null, 2));
}

async function askOpenAI(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that analyzes food items and dietary preferences. Always respond with valid JSON when requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 512,
      temperature: 0.1
    });

    const content = completion.choices[0]?.message?.content || '';
    return { content };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

app.post('/api/ai-analyze-meals', async (req, res) => {
  const { meals } = req.body;
  if (!Array.isArray(meals) || meals.length === 0) {
    return res.status(400).json({ error: "meals (array) is required" });
  }

  try {
    let cache = await loadCache(MEALS_CACHE_FILE, { meals: [] });
    let analyzed = [];
    let mealsToAnalyze = [];

    for (const meal of meals) {
      const found = cache.meals.find(
        (m) =>
          m.name === meal.name &&
          (m.description || "") === (meal.description || "")
      );
      if (found) {
        analyzed.push(found.analysis);
      } else {
        mealsToAnalyze.push(meal);
      }
    }

    if (mealsToAnalyze.length > 10) {
      mealsToAnalyze = mealsToAnalyze.slice(0, 10);
    }

    let newAnalyses = [];
    if (mealsToAnalyze.length > 0) {
      const prompt = `
You are an AI food analyzer. For each of the following menu items, return a JSON array where each item has:
- name
- containsMeat (true/false)
- containsChicken (true/false)
- containsFishSeafood (true/false)
- notcontainsGluten (true/false)
- isVegetarian (true/false)
- isVegan (true/false)

Analyze the following menu items (names and optional descriptions):

${mealsToAnalyze.map(
        (item, i) =>
          `${i + 1}. Name: "${item.name}"${item.description ? `, Description: "${item.description}"` : ''}`
      ).join('\n')}

Return only the JSON array, nothing else.
`;

      const { content } = await askOpenAI(prompt);

      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        newAnalyses = JSON.parse(match[0]);
        console.dir(newAnalyses, { depth: null });
      }

      for (let i = 0; i < mealsToAnalyze.length; i++) {
        const meal = mealsToAnalyze[i];
        const analysis = newAnalyses[i];
        cache.meals.push({
          name: meal.name,
          description: meal.description || "",
          analysis: analysis
        });
        analyzed.push(analysis);
      }

      await saveCache(MEALS_CACHE_FILE, cache);
    }

    res.json({ analysis: analyzed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error", details: error.toString() });
  }
});

app.listen(3001, () => {
  console.log("AI meal analyzer server running at http://localhost:3001");
});
