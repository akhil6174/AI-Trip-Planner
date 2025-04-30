import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_APIKEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

async function run(details) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const prompt = `Generate a detailed ${details.tripDays}-day travel itinerary for ${details.numTravelers} people visiting ${details.destination} on a ${details.budget}. The itinerary should focus on ${details.interests}. Provide a structured daily plan including morning, afternoon, evening and night activities. Also, include a JSON list of ${details.budget} hotels with: name, location, geo-coordinates, rating, pricing, image URL, and website. 

  Additionally, provide a JSON array of 5 beautiful, high-quality images representing ${details.destination} and its attractions, each with an image URL and a short description.
  
  Format the entire response as valid JSON with no markdown formatting.
  
  Use this exact structure for the response:
  
  {
    "destination": "${details.destination}",
    "duration": "${details.tripDays} days",
    "focus": "${details.interests}",
    "travelers": "${details.numTravelers}",
    "hotels": [
      {
        "name": "Hotel Name",
        "location": "Area, City",
        "geo": { "lat": 0.0, "lng": 0.0 },
        "pricing": "₹xxxx/night",
        "rating": "x.x",
        "imageURL": "https://example.com/hotel.jpg",
        "website": "https://hotelwebsite.com"
      }
    ],
    "images": [
      {
        "imageURL": "https://example.com/place.jpg",
        "description": "Short description of the image"
      }
    ],
    "itinerary": {
      "dailyPlan": [
        {
          "day": 1,
          "theme": "Theme of the Day",
          "morning": {
            "activity": "Activity Name",
            "time": "Time",
            "duration": "Duration",
            "description": "Short description of the activity"
          },
          "afternoon": {
            "activity": "Activity Name",
            "time": "Time",
            "duration": "Duration",
            "description": "Short description of the activity"
          },
          "evening": {
            "activity": "Activity Name",
            "time": "Time",
            "duration": "Duration",
            "description": "Short description of the activity"
          },
          "night": {
            "activity": "Activity Name",
            "time": "Time",
            "duration": "Duration",
            "description": "Short description of the activity"
          }
        }
      ]
    }
  }
  ;`
  

  try {
    const result = await chatSession.sendMessage(prompt);
    let responseText = result.response.candidates[0]?.content?.parts[0]?.text || "";
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating trip:", error);
    return { error: "Failed to generate trip details." };
  }
}

export default run;
