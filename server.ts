import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup Express JSON body parsing
app.use(express.json());

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Complete Menu Items list served dynamically from server db level
const MENU_ITEMS = [
  {
    id: 's1',
    name: 'Bo-Kaap Spiced Samosas',
    description: 'Crispy pastry pockets filled with potato, pea, and traditional Cape aromatic spices, served with a tangy apricot chutney.',
    price: 65,
    category: 'starters',
    tag: 'Vegetarian'
  },
  {
    id: 's2',
    name: 'Kalahari Biltong Carpaccio',
    description: 'Thinly sliced premium beef biltong, cured with coriander and black pepper, drizzled with olive oil and wild rocket.',
    price: 95,
    category: 'starters',
    tag: 'Local Favorite'
  },
  {
    id: 's3',
    name: 'Salted Cape Squid',
    description: 'Tender squid rings dusted in Kalahari salt and white pepper, flash-fried and served with a wild garlic aioli.',
    price: 85,
    category: 'starters',
    tag: 'Fresh Catch'
  },
  {
    id: 'm1',
    name: 'Plattekloof Flame-Grilled Lamb Chops',
    description: 'Three local Karoo loin chops rubbed in house terracotta clay spice blend, flame-grilled to medium, served with garlic roasted fingerling potatoes and mint pesto.',
    price: 240,
    category: 'mains',
    tag: 'Signature Item',
    image: '/src/assets/images/dish_lamb_chop_1781223352655.jpg'
  },
  {
    id: 'm2',
    name: 'Artisanal Wood-Fired Mozzarella Pizza',
    description: 'Rustic double-fermented sourdough base, with a rich, reduction of home-grown sweet red tomatoes, thick rounds of fresh buffalo mozzarella, olive oil, and fresh basil.',
    price: 180,
    category: 'mains',
    tag: 'Wood-Fired',
    image: '/src/assets/images/dish_wood_pizza_1781223369034.jpg'
  },
  {
    id: 'm3',
    name: 'Cape Malay Seafood Curry',
    description: 'Assorted fresh line fish, mussels, and squid slow-simmered in a fragrant coconut curry with turmeric, star anise, and ginger, served with savory basmati rice and sambals.',
    price: 210,
    category: 'mains',
    tag: 'Spicy'
  },
  {
    id: 'm4',
    name: 'Karoo Ribeye Steak with Red Chimichurri',
    description: '300g grass-fed ribeye steak aged for 28 days, seared over open coals, served with a bright red pepper chimichurri salsa and crispy sea-salted block chips.',
    price: 295,
    category: 'mains',
    tag: 'Chef Recommendation'
  },
  {
    id: 'd1',
    name: 'Warm Cape Malva Pudding',
    description: 'Traditional apricot-infused sweet caramelized sponge pudding, baked warm and accompanied by rich velvety vanilla bean crème anglaise custard.',
    price: 85,
    category: 'desserts',
    tag: 'Signature Dessert',
    image: '/src/assets/images/dish_malva_pudding_1781223382661.jpg'
  },
  {
    id: 'd2',
    name: 'Rooibos Crème Brûlée',
    description: 'Classic rich cream custard infused with organic Cederberg red espresso, topped with a perfectly cracked caramelized sugar crust.',
    price: 75,
    category: 'desserts',
    tag: 'Local Favorite'
  },
  {
    id: 'dr1',
    name: 'Plattekloof Pinotage Red Wine',
    description: 'A glass of exceptional, full-bodied local Stellenbosch Pinotage, carrying dark berry notes and smoked oak accents.',
    price: 60,
    category: 'drinks'
  },
  {
    id: 'dr2',
    name: 'Traditional Rooibos Iced Tea',
    description: 'House-brewed mountain rooibos tea cold-infused with fresh lemon zest, wild honey, and mint sprigs.',
    price: 40,
    category: 'drinks',
    tag: 'Refreshing'
  },
  {
    id: 'dr3',
    name: 'Cape Craft Ale',
    description: 'Crisp artisanal amber ale brewed locally in Cape Town. Smooth finish with floral citrus hop notes.',
    price: 55,
    category: 'drinks'
  }
];

// Server API Routes
app.get("/api/menu", (req, res) => {
  res.json(MENU_ITEMS);
});

// AI Autoreply generator using Gemini to draft friendly host replies
app.post("/api/reviews/respond", async (req, res) => {
  const { name, rating, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ error: "Name and comment are required." });
  }

  if (!ai) {
    const fallbackTemplate = `Hi ${name}, thank you so much for taking the time to share your review! The team at Terracotta Eatery loves hearing your thoughts and we look forward to serving you again real soon. Warm regards!`;
    return res.json({ responseText: fallbackTemplate, isFallback: true });
  }

  try {
    const prompt = `You are the Chef and Owner of the modern and cozy "Terracotta Eatery", a Halal-friendly restaurant situated in Plattekloof Village Shopping Centre, Cape Town.
We are known for local Karoo lamb chops, wood-fired artisanal sourdough pizzas, Bo-Kaap spiced samosas, Cape Malay seafood curries, scenic Table Mountain deck views, hospitable decencies, family vibe, and competitive R200-R300 target price ranges.

Please draft a warm, polite, professional, and personalized owner reply. Speak with genuine Cape Town hospitality and address any praises or complaints.

Review Details:
- Guest Name: ${name}
- Star Rating: ${rating}/5
- Guest Review: "${comment}"

Requirements:
- Keep the response brief, polite, and under 3-4 sentences.
- Never mention internal technical details or code.
- Write standard hospitable human reply.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const responseText = response.text?.trim() || "";
    res.json({ responseText, isFallback: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
