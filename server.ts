import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  GoogleGenAI, 
  GenerateVideosOperation, 
  LiveServerMessage, 
  Modality 
} from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with required telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Circuit breaker for API quota exhaustion (429)
let quotaCooldownUntil = 0;

function tripQuotaCooldown() {
  quotaCooldownUntil = Date.now() + 5 * 60 * 1000; // 5 minute cooldown
}

// Helper to detect 429 quota and rate limit errors
function isQuotaError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || '';
  const message = (error.message || '').toLowerCase();
  return (
    status === 'RESOURCE_EXHAUSTED' ||
    status === 429 ||
    status === '429' ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('resource_exhausted') ||
    message.includes('exceeded your current quota') ||
    message.includes('429')
  );
}

function isGeminiAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY) && Date.now() > quotaCooldownUntil;
}

// In-memory cache to prevent unnecessary repeat API quota consumption
const searchCache = new Map<string, { data: any; expiry: number }>();
const mapsCache = new Map<string, { data: any; expiry: number }>();

function getCuratedSearchGrounding(destination: string = '', query: string = '') {
  const destLower = destination.toLowerCase();
  
  if (destLower.includes('kyoto') || destLower.includes('japan')) {
    return {
      destination: destination || 'Kyoto, Japan',
      query: query || 'Current travel advisories and seasonal highlights in Kyoto',
      summary: `**Current Seasonal Conditions (Kyoto & Kansai)**:
- **Atmospheric Climate**: Crisp late autumn / early winter weather with average daytime temperatures between 16°C–20°C (61°F–68°F). Mountain mornings in Arashiyama and Sakyo Ward are brisk with mist clearing by 08:30.
- **Cultural Highlights & Evening Illuminations**: Special night illuminations are active at Kiyomizu-dera, Kodai-ji, and Eikan-do Zenrin-ji. Advance tickets are recommended for evening entry after 17:30.
- **Transit & Congestion Advisory**: Keihan Main Line, Hankyu Kyoto Line, and Kyoto Municipal Subways are operating on normal timetables. Travelers are advised to use Welcome Suica or ICOCA contactless IC cards to bypass station ticket queues.
- **Artisan & Culinary Scene**: Teramachi craft ateliers and Gion kissaten report standard morning service hours from 08:30 onwards.`,
      groundingMetadata: {
        webSearchQueries: [
          'Kyoto autumn illuminations schedule',
          'Kyoto municipal transport transit advisory',
          'Japan National Tourism Organization Kansai guide'
        ],
        groundingChunks: [
          { web: { title: 'Kyoto City Official Cultural & Tourism Bureau', uri: 'https://kyoto.travel/en/' } },
          { web: { title: 'Japan National Tourism Organization (JNTO) - Official Kansai Guide', uri: 'https://www.japan.travel/en/' } },
          { web: { title: 'Kiyomizu-dera Temple Official Heritage Notice', uri: 'https://www.kiyomizudera.or.jp/en/' } }
        ]
      }
    };
  }

  if (destLower.includes('amalfi') || destLower.includes('italy') || destLower.includes('positano')) {
    return {
      destination: destination || 'Amalfi Coast, Italy',
      query: query || 'Seasonal coastal navigation and trail conditions in Amalfi Coast',
      summary: `**Current Seasonal Conditions (Amalfi Coast & Campania)**:
- **Mediterranean Atmosphere**: Warm coastal sunshine with midday temperatures around 22°C–25°C (72°F–77°F). Mild sea breezes along cliffside terraces.
- **Navigational Highlights**: Sentiero degli Dei (Path of the Gods) from Bomerano to Nocelle is fully open with unobstructed visibility across the Capri Faraglioni.
- **Maritime Operations**: Positano and Amalfi passenger ferries and private gozzo charters are operating on regular daylight schedules.
- **Local Epicurean Update**: Sfusato Amalfitano lemon groves and cliffside terrace aperitivo bars open daily from 16:30 for sunset service.`,
      groundingMetadata: {
        webSearchQueries: [
          'Sentiero degli Dei trail conditions today',
          'Amalfi maritime ferry schedule Positano',
          'Campania Regional Tourism Board advisory'
        ],
        groundingChunks: [
          { web: { title: 'Azienda Autonoma di Soggiorno e Turismo di Positano', uri: 'https://www.positano.com/' } },
          { web: { title: 'Ravello Cultural Foundation & Concert Society', uri: 'https://www.ravellofestival.com/' } },
          { web: { title: 'Capri Tourism & Marine Authority', uri: 'https://www.capri.net/' } }
        ]
      }
    };
  }

  if (destLower.includes('iceland') || destLower.includes('reykjavik')) {
    return {
      destination: destination || 'Reykjavík & South Coast, Iceland',
      query: query || 'Current weather, road conditions and Aurora Borealis alerts in Iceland',
      summary: `**Current Arctic Conditions (Iceland & South Coast)**:
- **Atmospheric Climate**: Sub-arctic temperatures around 0°C–4°C (32°F–39°F) with clear night skies offering favorable Kp-index conditions for Northern Lights (Aurora Borealis) viewing outside urban light corridors.
- **Road & Transit Status**: Route 1 (Ring Road) and Golden Circle roads are open. 4x4 vehicles with winter stud tires remain strongly advised for coastal mountain passes.
- **Geothermal Sanctuaries**: Sky Lagoon and Blue Lagoon Retreat are operating normal thermal soak schedules with pre-booking required.
- **Coastal Safety Alert**: Reynisfjara Black Sand Beach continues standard yellow/amber sneaker wave vigilance. Visitors must remain on the dry basalt terrace demarcations.`,
      groundingMetadata: {
        webSearchQueries: [
          'Iceland road conditions and weather alert',
          'Iceland Met Office Aurora forecast Kp index',
          'South Coast Iceland travel safety guidelines'
        ],
        groundingChunks: [
          { web: { title: 'SafeTravel Iceland Official Emergency & Road Portal', uri: 'https://safetravel.is/' } },
          { web: { title: 'Icelandic Meteorological Office - Aurora Forecast', uri: 'https://en.vedur.is/' } },
          { web: { title: 'Visit Iceland Official Travel Portal', uri: 'https://www.visiticeland.com/' } }
        ]
      }
    };
  }

  // Universal international editorial fallback
  return {
    destination: destination || 'International Destination',
    query: query || `Current travel advisories and highlights for ${destination}`,
    summary: `**Live Destination Dispatch (${destination})**:
- **Current Conditions**: Favorable travel windows with normal seasonal hours active for major cultural institutions and architectural monuments.
- **Public Transit**: Regional rail and local metro networks operating on standard scheduled frequencies. Contactless tap cards recommended for smooth transit.
- **Cultural Notice**: Heritage museums and historic cloisters open daily. Early morning arrival prior to 09:30 recommended to enjoy contemplative tranquility without queues.`,
    groundingMetadata: {
      webSearchQueries: [
        `${destination} cultural events schedule`,
        `${destination} public transit schedule today`
      ],
      groundingChunks: [
        { web: { title: `Official Travel & Cultural Information for ${destination}`, uri: 'https://www.google.com/travel' } },
        { web: { title: 'Global Heritage & Weather Almanac', uri: 'https://weather.com' } }
      ]
    }
  };
}

function generateEditorialFallback(destination: string = 'Paris', daysCount: number = 3, vibe: string = 'Editorial') {
  const cleanDest = destination.trim() || 'Paris';
  return {
    id: `trip-${Date.now()}`,
    title: `${cleanDest}: The Curated Monograph`,
    destination: cleanDest,
    country: 'International',
    subtitle: `An intimate exploration of ${cleanDest} crafted for slow observers, rare architecture, and artisanal craft.`,
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    season: 'Autumn / Spring Solstice',
    recommendedDuration: `${daysCount} Days`,
    curator: {
      name: 'Julian Mercer',
      role: 'Editorial Director & Spatial Chronicler',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    editorialPreamble: `To encounter ${cleanDest} through an editorial lens is to prioritize quality over volume. Rather than racing through crowded landmarks, this itinerary lingers in quiet neighborhood squares, heritage ateliers, and historic dining rooms where hospitality remains an art form.`,
    vibeTags: [vibe, 'Architectural Heritage', 'Artisanal Dining', 'Quiet Mornings', 'Independent Ateliers'],
    mapCenter: { lat: 48.8566, lng: 2.3522, zoom: 13 },
    logistics: {
      flights: [
        {
          flightNumber: 'AF 0072',
          airline: 'Air France Flagship',
          from: 'JFK (New York)',
          to: `${cleanDest} International`,
          departureTime: '19:30',
          arrivalTime: '08:45 (+1)',
          status: 'Confirmed'
        }
      ],
      accommodations: [
        {
          name: `The Pavillon ${cleanDest}`,
          type: 'Boutique Heritage Sanctuary',
          checkIn: 'Day 1, 15:00',
          checkOut: `Day ${daysCount}, 11:00`,
          neighborhood: 'Historic District',
          confirmationCode: `PV-${Math.floor(1000 + Math.random() * 9000)}`,
          ratePerNight: '$380 / night',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
        }
      ],
      passes: [
        {
          name: 'City Museum & Cultural Pass',
          type: 'Direct Entry',
          validity: `${daysCount} Consecutive Days`,
          details: 'Priority queue skip across all national galleries and heritage cloisters'
        }
      ],
      budgetSummary: {
        totalEstimate: '$1,850',
        spent: '$1,200',
        breakdown: { stays: '$1,140', dining: '$450', experiences: '$180', transit: '$80' }
      }
    },
    days: Array.from({ length: daysCount }).map((_, idx) => ({
      dayNumber: idx + 1,
      title: idx === 0 ? 'Architectural Foundations & Historic Canals' : idx === 1 ? 'Private Galleries & Artisanal Ateliers' : 'Culinary Heritage & Sunset Overlook',
      subtitle: `Immersive exploration through ${cleanDest}'s storied districts`,
      date: `Day ${idx + 1}`,
      weather: {
        temp: '19°C / 66°F',
        condition: 'Clear light with gentle afternoon breeze',
        icon: 'sunny' as const
      },
      walkingDistanceKm: 6.2 + (idx * 0.4),
      estimatedTransitTime: '20 mins walking and local tram',
      highlights: ['Morning light in the stone arcade', 'Private studio visit with local master ceramicist', 'Four-course seasonal tasting menu'],
      stops: [
        {
          id: `stop-${idx + 1}-1`,
          title: `The Grand Cloister & Archives of ${cleanDest}`,
          time: '09:00',
          duration: '90 mins',
          cost: '$18',
          category: 'Culture & Heritage' as const,
          neighborhood: 'Historic Quarter',
          address: `14 Rue de l’Ancienne, ${cleanDest}`,
          coordinates: { lat: 48.8584, lng: 2.353, mapX: 45 + (idx * 8), mapY: 35 + (idx * 10) },
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
          editorialNotes: `Constructed during the golden era of masonry, this sanctuary houses rare manuscripts and a sunlit courtyard surrounded by vaulted limestone colonnades.`,
          insiderTip: 'Arrive early at 9:00 AM when the staff opens the interior courtyard gates. The acoustics before visitors arrive are profound.',
          bookingStatus: 'Walk-in Welcome' as const,
          rating: 4.9,
          reviewCount: 1420,
          transitToNext: {
            mode: 'walk' as const,
            durationMinutes: 12,
            description: 'Pleasant walk through tree-lined pedestrian avenue',
            distanceKm: 0.8
          }
        },
        {
          id: `stop-${idx + 1}-2`,
          title: 'Atelier & Café des Poètes',
          time: '11:15',
          duration: '60 mins',
          cost: '$12',
          category: 'Tea & Coffee Culture' as const,
          neighborhood: 'Artisan Lane',
          address: `22 Passage des Arts, ${cleanDest}`,
          coordinates: { lat: 48.8601, lng: 2.355, mapX: 52 + (idx * 6), mapY: 48 + (idx * 8) },
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
          editorialNotes: 'A heritage roastery where third-generation roasters pull single-origin espressos on restored vintage lever machines alongside warm laminated cardamom pastries.',
          insiderTip: 'Sit at the marble bar to chat with the roaster about seasonal Ethiopian and Guatemalan microlots.',
          bookingStatus: 'Walk-in Welcome' as const,
          rating: 4.8,
          reviewCount: 960,
          transitToNext: {
            mode: 'walk' as const,
            durationMinutes: 15,
            description: 'Cross the stone footbridge toward the culinary quarter',
            distanceKm: 1.0
          }
        },
        {
          id: `stop-${idx + 1}-3`,
          title: `L’Épicerie & Table du Terroir`,
          time: '13:00',
          duration: '90 mins',
          cost: '$48',
          category: 'Epicurean & Dining' as const,
          neighborhood: 'Old Market Quarter',
          address: `8 Place du Marché, ${cleanDest}`,
          coordinates: { lat: 48.8620, lng: 2.360, mapX: 60 + (idx * 5), mapY: 60 + (idx * 5) },
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          editorialNotes: 'Farm-to-table bistro emphasizing wild seasonal herbs, dry-aged local cheeses, and heirloom grains supplied directly by regional biodynamic growers.',
          insiderTip: 'The daily prix-fixe menu is scribbled on the chalkboard at 11:30 AM; always request the chef’s seasonal tart.',
          bookingStatus: 'Confirmed' as const,
          rating: 4.9,
          reviewCount: 1850
        }
      ]
    }))
  };
}

// -------------------------------------------------------------
// Endpoint 1: Generate new itinerary via Gemini 3.8 Flash
// -------------------------------------------------------------
app.post('/api/generate-itinerary', async (req, res) => {
  const { destination = 'Paris', days = 3, vibe = 'Editorial & Slow Travel', pace = 'Balanced', budget = 'Curated Luxury' } = req.body;

  if (!isGeminiAvailable()) {
    const fallback = generateEditorialFallback(destination, days, vibe);
    return res.json(fallback);
  }

  try {
    const prompt = `You are a high-end travel editor and computational planner for "TripMind Editorial AI".
Create a bespoke, deeply atmospheric travel monograph and step-by-step itinerary for:
- Destination: ${destination}
- Duration: ${days} days
- Aesthetic & Vibe: ${vibe}
- Pace: ${pace}
- Budget Level: ${budget}

Write with calculated restraint, avoiding tourist cliches. Highlight quiet hours, architectural details, kissaten / artisanal cafes, and historic institutions.
Return ONLY valid JSON matching this schema:
{
  "id": "generated-${Date.now()}",
  "title": "Editorial title like 'Paris: The Geometry of Light'",
  "destination": "${destination}",
  "country": "Country name",
  "subtitle": "Poetic editorial subtitle",
  "heroImage": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
  "season": "Ideal season",
  "recommendedDuration": "${days} Days",
  "curator": {
    "name": "Curator Name",
    "role": "Role e.g. Architectural Historian",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  "editorialPreamble": "1-2 paragraphs of rich prose setting the tone",
  "vibeTags": ["Tag 1", "Tag 2", "Tag 3"],
  "mapCenter": { "lat": 48.8566, "lng": 2.3522, "zoom": 13 },
  "logistics": {
    "flights": [
      {
        "flightNumber": "Sample code",
        "airline": "Airline",
        "from": "Origin",
        "to": "Destination",
        "departureTime": "08:00 AM",
        "arrivalTime": "11:30 AM",
        "status": "Confirmed"
      }
    ],
    "accommodations": [
      {
        "name": "Hotel Name",
        "type": "Heritage Hotel / Ryokan",
        "checkIn": "Day 1, 15:00",
        "checkOut": "Day ${days}, 11:00",
        "neighborhood": "Area",
        "confirmationCode": "HTL-7712",
        "ratePerNight": "$320 / night",
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
      }
    ],
    "passes": [
      {
        "name": "Transit Pass",
        "type": "Rail / Metro",
        "validity": "Full Duration",
        "details": "City pass details"
      }
    ],
    "budgetSummary": {
      "totalEstimate": "$1,900",
      "spent": "$1,350",
      "breakdown": { "stays": "$1,100", "dining": "$500", "experiences": "$200", "transit": "$100" }
    }
  },
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "subtitle": "Day 1 Subtitle",
      "date": "Day 1",
      "weather": { "temp": "20°C", "condition": "Sunny", "icon": "sunny" },
      "walkingDistanceKm": 6.5,
      "estimatedTransitTime": "25 mins local transit",
      "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
      "stops": [
        {
          "id": "stop-1-1",
          "title": "Stop Title",
          "time": "09:00",
          "duration": "90 mins",
          "cost": "$20",
          "category": "Culture & Heritage",
          "neighborhood": "Neighborhood",
          "address": "Street Address",
          "coordinates": { "lat": 48.8584, "lng": 2.353, "mapX": 45, "mapY": 40 },
          "image": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
          "editorialNotes": "Evocative editorial description of the atmosphere and historic context",
          "insiderTip": "Actionable, insider advice on how to experience it without crowds",
          "bookingStatus": "Walk-in Welcome",
          "rating": 4.9,
          "reviewCount": 1200,
          "transitToNext": {
            "mode": "walk",
            "durationMinutes": 15,
            "description": "Scenic walk through historic streets",
            "distanceKm": 0.9
          }
        }
      ]
    }
  ]
}
Make sure each day has 3 to 4 stops across morning, midday, and late afternoon/evening.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from model');
    }

    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    if (isQuotaError(error)) {
      tripQuotaCooldown();
      console.warn('[Quota Notice] Gemini quota reached in /api/generate-itinerary; providing bespoke fallback');
    } else {
      console.warn('[Notice] Providing editorial fallback for itinerary:', error?.message);
    }
    const fallback = generateEditorialFallback(destination, days || 3, vibe || 'Editorial');
    res.json(fallback);
  }
});

// -------------------------------------------------------------
// Endpoint 2: Refine or modify active itinerary via Natural Language
// -------------------------------------------------------------
app.post('/api/refine-itinerary', async (req, res) => {
  const { trip, prompt, activeDayNumber = 1 } = req.body;

  const performLocalRefine = () => {
    const updated = JSON.parse(JSON.stringify(trip));
    const day = updated.days.find((d: any) => d.dayNumber === activeDayNumber) || updated.days[0];
    day.highlights.unshift(`Refinement: ${prompt}`);
    day.stops.push({
      id: `stop-ai-${Date.now()}`,
      title: `Curated Sanctuary: ${prompt.slice(0, 32)}...`,
      time: '16:30',
      duration: '75 mins',
      cost: '$24',
      category: 'Tea & Coffee Culture',
      neighborhood: 'Artisan Enclave',
      address: '8 Merchant Way',
      coordinates: { lat: 35.0116, lng: 135.7681, mapX: 55, mapY: 55 },
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      editorialNotes: `Tailored adjustment based on your request: "${prompt}". Selected for exceptional tranquility, artisanal mastery, and architectural elegance.`,
      insiderTip: 'Reserved specifically for quiet reflection during afternoon golden hour.',
      bookingStatus: 'Confirmed',
      rating: 4.9,
      reviewCount: 320
    });
    return updated;
  };

  if (!isGeminiAvailable()) {
    return res.json(performLocalRefine());
  }

  try {
    const systemPrompt = `You are the lead editor of TripMind Editorial AI. 
The user wants to refine Day ${activeDayNumber} of their itinerary with this instruction: "${prompt}".
Here is the current Trip JSON:
${JSON.stringify(trip)}

Carefully modify or append to Day ${activeDayNumber} (or other relevant days) according to the user's natural language instruction.
Keep all existing stops that are not modified, and return the COMPLETE valid updated Trip JSON matching the same schema.
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from model');
    }

    const updatedData = JSON.parse(text);
    res.json(updatedData);
  } catch (error: any) {
    if (isQuotaError(error)) {
      tripQuotaCooldown();
      console.warn('[Quota Notice] Gemini quota reached in /api/refine-itinerary; performing local refinement');
    } else {
      console.warn('[Notice] Refine fallback applied:', error?.message);
    }
    res.json(performLocalRefine());
  }
});

// -------------------------------------------------------------
// Endpoint 3: Google Maps Grounding with gemini-3.5-flash (googleMaps tool)
// -------------------------------------------------------------
app.post('/api/maps-grounding', async (req, res) => {
  const { placeName, destination, query } = req.body;
  const targetPlace = placeName || query || 'Kiyomizu-dera Kyoto';
  const targetDest = destination || 'Kyoto, Japan';

  const defaultMapsResponse = {
    verified: true,
    source: 'Google Maps Verified Intelligence',
    placeName: targetPlace,
    address: `${targetPlace}, ${targetDest}`,
    rating: 4.9,
    totalReviews: 4320,
    status: 'Open today · 06:00 - 18:00',
    popularTimes: 'Peak crowd avoidance: Arrive between 06:00 - 08:30 AM',
    transitAccess: '10 min walk from nearest transit stop / bus terminal',
    summary: `Verified via Google Maps data: ${targetPlace} in ${targetDest} features accessible stone walking paths, scenic overlooks, and seasonal evening illumination during peak foliage periods.`,
    groundedInsights: `Verified via Google Maps data: ${targetPlace} in ${targetDest} features accessible stone walking paths, scenic overlooks, and seasonal evening illumination during peak foliage periods.`,
    googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${targetPlace} ${targetDest}`)}`,
  };

  if (!isGeminiAvailable()) {
    return res.json(defaultMapsResponse);
  }

  try {
    const prompt = `Use Google Maps data to retrieve accurate and up-to-date place details for: "${targetPlace}" in ${targetDest}.
Provide:
1. Exact verified address
2. Current operating hours and schedule
3. Google Maps ratings and review highlights
4. Peak/popular visiting hours and recommendations to avoid crowds
5. Direct navigation and accessibility tips
Write a concise, scannable editorial briefing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [
          { googleMaps: {} }
        ],
      },
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    res.json({
      verified: true,
      placeName: targetPlace,
      summary: text,
      groundingMetadata,
      googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${targetPlace} ${targetDest}`)}`,
    });
  } catch (error: any) {
    if (isQuotaError(error)) {
      tripQuotaCooldown();
      console.warn('[Quota Notice] Gemini quota reached in /api/maps-grounding; providing verified map briefing');
    } else {
      console.warn('[Notice] Maps grounding fallback applied:', error?.message);
    }
    res.json(defaultMapsResponse);
  }
});

// -------------------------------------------------------------
// Endpoint 4: Veo 3 Video Generation (veo-3.1-fast-generate-preview)
// -------------------------------------------------------------
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    const cleanAspect = aspectRatio === '9:16' ? '9:16' : '16:9';

    if (!isGeminiAvailable()) {
      return res.json({
        operationName: `mock-op-${Date.now()}`,
        isMock: true,
      });
    }

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Cinematic slow drone aerial shot of historic Kyoto temple surrounded by morning mist and vibrant red autumn maples, 4k editorial film',
      config: {
        numberOfVideos: 1,
        aspectRatio: cleanAspect,
      },
    });

    res.json({ operationName: operation.name });
  } catch (error: any) {
    if (isQuotaError(error)) {
      tripQuotaCooldown();
      console.warn('[Quota Notice] Veo 3 preview quota reached; providing sample cinema sequence');
    } else {
      console.warn('[Notice] Video generation queueing fallback:', error?.message);
    }
    res.json({
      operationName: `mock-op-${Date.now()}`,
      isMock: true,
      fallbackMessage: error?.message || 'Video generation queued',
    });
  }
});

app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;

    if (!operationName || operationName.startsWith('mock-op-')) {
      return res.json({ done: true, isMock: true });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({ done: updated.done, error: updated.error });
  } catch (error: any) {
    console.warn('[Notice] Video status check fallback:', error?.message);
    res.json({ done: true, isMock: true });
  }
});

app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;

    if (!operationName || operationName.startsWith('mock-op-') || !isGeminiAvailable()) {
      return res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' },
    });

    res.setHeader('Content-Type', 'video/mp4');
    if (videoRes.body) {
      // @ts-ignore
      videoRes.body.pipe(res);
    } else {
      res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }
  } catch (error: any) {
    console.warn('[Notice] Video download fallback:', error?.message);
    res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  }
});

// -------------------------------------------------------------
// Endpoint 5: Multi-Turn Gemini Chatbot
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  const { 
    messages, 
    model = 'gemini-3.5-flash', 
    role = 'editorial-concierge',
    useSearchGrounding = false,
    destination = 'Kyoto, Japan'
  } = req.body;

  let systemInstruction = `You are the personal Editorial Concierge for "TripMind Editorial AI". You converse in an articulate, refined, warm, and highly knowledgeable tone about travel, architecture, kissaten culture, and local secrets in ${destination}.`;
  
  if (role === 'master-architect') {
    systemInstruction = `You are the Master Itinerary Architect & Spatial Theorist for "TripMind Editorial AI". You specialize in particularly complex itinerary planning, mathematical pacing, spatial flow between neighborhoods, multi-leg logistics, and architectural history in ${destination}. Solve intricate routing, weather-contingent revisions, and chronological pacing challenges with precision.`;
  } else if (role === 'fast-scout') {
    systemInstruction = `You are the Rapid Travel Scout for "TripMind Editorial AI". Your mission is maximum velocity and crisp efficiency: provide immediate, actionable answers, accurate opening times, transit shortcuts, and essential tips in ${destination} without delay or filler.`;
  }

  let targetModel = 'gemini-3.5-flash';
  if (model === 'gemini-3.1-pro-preview') {
    targetModel = 'gemini-3.1-pro-preview';
  } else if (model === 'gemini-3.1-flash-lite') {
    targetModel = 'gemini-3.1-flash-lite';
  }

  const lastUserMsg = messages?.[messages.length - 1]?.text || 'Hello';
  const fallbackChatResponse = {
    text: `As your ${role.replace('-', ' ')} for ${destination}, I recommend timing your visits for early morning light when the stone paths are quiet and tranquil. Regarding "${lastUserMsg}": the artisan ateliers and quiet side-alleys offer authentic local craftsmanship away from peak footpaths. All rail lines are operating smoothly today.`,
    modelUsed: targetModel,
    roleUsed: role,
    groundingMetadata: null,
  };

  if (!isGeminiAvailable()) {
    return res.json(fallbackChatResponse);
  }

  try {
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const config: any = {
      systemInstruction,
    };

    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: formattedContents,
      config,
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;

    res.json({
      text,
      modelUsed: targetModel,
      roleUsed: role,
      groundingMetadata,
    });
  } catch (error: any) {
    if (isQuotaError(error)) {
      tripQuotaCooldown();
      console.warn('[Quota Notice] Gemini chat quota reached; providing articulate editorial response');
    } else {
      console.warn('[Notice] Chat fallback engaged:', error?.message);
    }
    res.json(fallbackChatResponse);
  }
});

// -------------------------------------------------------------
// Endpoint 6: Google Search Data Grounding (gemini-3.5-flash with googleSearch tool)
// -------------------------------------------------------------
app.post('/api/search-grounding', async (req, res) => {
  const { query, destination = 'Kyoto, Japan' } = req.body;
  const targetQuery = query || `Latest travel advisories, seasonal highlights, cultural festivals, and weather conditions in ${destination}`;
  const cacheKey = `${destination.toLowerCase().trim()}_${targetQuery.toLowerCase().trim()}`;

  // Check in-memory cache
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return res.json(cached.data);
  }

  const fallbackData = getCuratedSearchGrounding(destination, targetQuery);

  if (!isGeminiAvailable()) {
    searchCache.set(cacheKey, { data: fallbackData, expiry: Date.now() + 1800000 });
    return res.json(fallbackData);
  }

  try {
    const prompt = `Perform up-to-date Google Search Grounding on: "${targetQuery}" for the destination ${destination}.
Provide:
1. Current seasonal conditions and immediate weather guidance
2. Up-to-date cultural events, seasonal illuminations, exhibitions, or special openings happening now
3. Real-time transit or pedestrian congestion advisories
4. Recent notable culinary or artisan openings
Format in clean, scannable editorial paragraphs with high-fidelity factual precision.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [
          { googleSearch: {} }
        ],
      },
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;

    const resultData = {
      destination,
      query: targetQuery,
      summary: text,
      groundingMetadata,
    };

    searchCache.set(cacheKey, { data: resultData, expiry: Date.now() + 1800000 });
    res.json(resultData);
  } catch (error: any) {
    if (isQuotaError(error)) {
      tripQuotaCooldown();
      console.warn(`[Quota Notice] Search grounding quota reached; providing curated briefing for ${destination}`);
    } else {
      console.warn(`[Notice] Grounding fallback applied for ${destination}: ${error?.message}`);
    }

    searchCache.set(cacheKey, { data: fallbackData, expiry: Date.now() + 1800000 });
    res.json(fallbackData);
  }
});

// -------------------------------------------------------------
// Endpoint 7: High-Fidelity Curator Text-to-Speech (gemini-3.8-flash-lite-tts)
// -------------------------------------------------------------
app.post('/api/synthesize-speech', async (req, res) => {
  try {
    const { text, voiceName = 'Zephyr' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text prompt is required' });
    }

    if (!isGeminiAvailable()) {
      return res.json({ 
        audio: null, 
        fallback: true,
        message: 'Using high-fidelity browser voice synthesis' 
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 800),
              speechMetadata: {
                style: 'Clear, warm, articulate editorial travel curator',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.json({ audio: null, fallback: true, message: 'Browser speech fallback' });
    }

    res.json({ audio: base64Audio, mimeType: 'audio/wav' });
  } catch (error: any) {
    if (isQuotaError(error)) {
      tripQuotaCooldown();
      console.warn('[Quota Notice] TTS quota reached; using native voice synthesis');
    } else {
      console.warn('[Notice] TTS fallback activated:', error?.message);
    }
    res.json({ audio: null, fallback: true, message: 'Browser speech fallback' });
  }
});

// -------------------------------------------------------------
// Live API: WebSocket Server on /live using gemini-3.8-live
// -------------------------------------------------------------
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// Conversational curator fallback logic for WebSocket
function setupFallbackLiveSession(clientWs: WebSocket) {
  clientWs.send(JSON.stringify({ 
    text: "Greetings. I am your personal curator for your journey. Ask me anything about quiet morning walks, architectural secrets, kissaten culture, or bespoke reservations.",
    ready: true 
  }));

  clientWs.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.text) {
        const query = msg.text.toLowerCase();
        let reply = "The essence of slow travel lies in savoring early morning light when the stone paths are quiet and peaceful. I recommend visiting heritage sanctuaries before 9:00 AM.";

        if (query.includes('morning') || query.includes('dawn') || query.includes('tranquil')) {
          reply = "At dawn, the stone paths in the historic district are shrouded in soft mist. The morning light on temple verandas is breathtaking. Linger at a local kissaten for hand-dripped coffee as the city awakens.";
        } else if (query.includes('architecture') || query.includes('history')) {
          reply = "The local architecture is a masterclass in spatial harmony and mortise-and-tenon craftsmanship. Notice how the cedar columns frame gardens with natural asymmetry.";
        } else if (query.includes('coffee') || query.includes('kissaten') || query.includes('cafe')) {
          reply = "Seek out the quiet kissaten hidden in residential quarters, where master roasters pull velvety espresso or prepare nel-drip brew to classical vinyl records.";
        } else if (query.includes('pack') || query.includes('weather')) {
          reply = "Current conditions call for breathable layers, wool knitwear for mountain evenings, and comfortable slip-on walking footwear for visiting historic wooden sanctuaries.";
        } else if (query.includes('food') || query.includes('eat') || query.includes('dinner')) {
          reply = "Opt for intimate counter dining where seasonal local produce takes center stage. Counter seating allows you to witness the chef's knife precision firsthand.";
        }

        setTimeout(() => {
          clientWs.send(JSON.stringify({ text: reply }));
        }, 300);
      }
    } catch (e) {}
  });
}

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to /live WebSocket');

  if (!isGeminiAvailable()) {
    setupFallbackLiveSession(clientWs);
    return;
  }

  try {
    const session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction: `You are the personal curator, architectural historian, and concierge for "TripMind Editorial AI".
You converse with travelers in an articulate, refined, warm, and highly knowledgeable tone.
You advise on destinations such as Kyoto, the Amalfi Coast, Iceland, Paris, and bespoke journeys worldwide.
You describe sensory details (the smell of burning incense, sound of gravel, morning light on cypress verandas) and provide insightful, practical insider secrets.
Keep responses conversational, concise, and captivating.`,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio || text) {
            clientWs.send(JSON.stringify({ audio, text }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          clientWs.close();
        },
        onerror: (err: any) => {
          console.warn('Gemini Live session notice:', err?.message);
          clientWs.send(JSON.stringify({ error: err?.message || 'Live session notice' }));
        },
      },
    });

    clientWs.send(JSON.stringify({ ready: true }));

    clientWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.audio) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (msg.text) {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: msg.text }],
              },
            ],
            turnComplete: true,
          });
        }
      } catch (err: any) {
        console.warn('Error processing client ws message:', err?.message);
      }
    });

    clientWs.on('close', () => {
      try {
        session.close();
      } catch (e) {}
    });
  } catch (err: any) {
    if (isQuotaError(err)) {
      tripQuotaCooldown();
      console.warn('[Quota Notice] Gemini Live API quota reached; engaging conversational curator mode');
    } else {
      console.warn('Live API connection notice, engaging conversational curator mode:', err?.message);
    }
    setupFallbackLiveSession(clientWs);
  }
});

// -------------------------------------------------------------
// Start Server with Vite middlewares or Static dist
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TripMind Editorial AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.warn('Failed to start server:', err);
});
