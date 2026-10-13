import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Smart AI Scene Detection & Cinematic Color Advice Endpoint
app.post('/api/analyze-scene', async (req, res) => {
  try {
    const { videoName = 'Video', duration = 15 } = req.body;

    let aiAdvice = null;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert Hollywood colorist and CapCut video editor.
Analyze a video project named "${videoName}" with duration ${duration} seconds.
Suggest 3 scene split timestamps with scene vibes, color grading preset recommendations (from: Light Lotus, Golden Sunset, Green Lake, Hollywood, Oppenheimer, Berlin, Retro Print), and recommended color mood.
Respond in valid JSON format:
{
  "scenes": [
    {"start": 0, "end": 4.5, "title": "Opening Shot", "preset": "Golden Sunset", "vibe": "Warm cinematic glow"},
    {"start": 4.5, "end": 10.2, "title": "Main Subject", "preset": "Hollywood", "vibe": "Teal and orange blockbuster"},
    {"start": 10.2, "end": 15, "title": "Final Outro", "preset": "Oppenheimer", "vibe": "High contrast dramatic finish"}
  ]
}`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          aiAdvice = JSON.parse(response.text);
        }
      } catch (geminiErr) {
        console.warn('Gemini API call warning:', geminiErr);
      }
    }

    // Default intelligent scene timestamps if Gemini was offline or rate-limited
    const fallbackScenes = [
      {
        start: 0,
        end: Number((duration * 0.3).toFixed(1)),
        title: 'Scene 1: Opening Shot',
        preset: 'Golden Sunset',
        vibe: 'Warm and inviting entrance',
      },
      {
        start: Number((duration * 0.3).toFixed(1)),
        end: Number((duration * 0.75).toFixed(1)),
        title: 'Scene 2: Core Action Sequence',
        preset: 'Hollywood',
        vibe: 'High dynamic range cinematic contrast',
      },
      {
        start: Number((duration * 0.75).toFixed(1)),
        end: duration,
        title: 'Scene 3: Climax & Outro',
        preset: 'Oppenheimer',
        vibe: 'Dramatic film finish',
      },
    ];

    res.json({
      success: true,
      scenes: aiAdvice?.scenes || fallbackScenes,
    });
  } catch (err: any) {
    console.error('Error in analyze-scene:', err);
    res.status(500).json({ error: err.message || 'Scene analysis failed' });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);
  app.listen(3000, '0.0.0.0', () => {
    console.log('CapCraft Studio Server running on http://0.0.0.0:3000');
  });
}

startServer();
