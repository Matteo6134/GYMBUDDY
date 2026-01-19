import { GEMINI_API_KEY } from "@/constants/Keys";
import { ActivePlan, UserProfile } from "@/store/useGymStore";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateWorkoutPlan(profile: UserProfile, _apiKeyIgnored?: string, language: 'en' | 'it' | 'pl' = 'en'): Promise<ActivePlan> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const age = new Date().getFullYear() - profile.birthYear;

  const langInstruction = language === 'it'
    ? "IMPORTANT: Translate ALL content (Day Titles, Exercise Names, Tips) into ITALIAN."
    : language === 'pl'
      ? "IMPORTANT: Translate ALL content (Day Titles, Exercise Names, Tips) into POLISH."
      : "Output in English.";

  const prompt = `
    You are an elite personal trainer and physiologist (PhD).
    Create the scientifically "Perfect Gym Schedule" (JSON) for:

    **CLIENT PROFILE**
    - Name: ${profile.name}
    - Age/Gender: ${age} / ${profile.gender}
    - Stats: ${profile.height}m / ${profile.weight}kg
    - Goal: ${profile.goal} (Focus: ${profile.hypertrophyFocus})
    - Schedule: ${profile.days} days/week

    **LIFESTYLE & RECOVERY**
    - Experience: ${profile.experienceYears} years
    - Sleep: ${profile.sleepHours} hrs/night
    - Stress: ${profile.stressLevel}
    - Diet: ${profile.dietType}
    - Hydration: ${profile.waterIntake}
    - Other Sports: ${profile.otherActivities} (${profile.otherSportsFrequency}x/week) --> MUST ACCOUNT FOR THIS FATIGUE!
    - Bad Habits: ${profile.badHabits.join(', ')}

    **INSTRUCTIONS**
    1. **Hypertrophy Focus:** If they want "Big Ass" (Glutes), program Hip Thrusts (2-3x/week), RDLs, Kickbacks. If "Arms", add dedicated arm days or high frequency.
    2. **Recovery Match:**
       - If Sleep < 6h or High Stress -> Reduce total sets, increase rest.
       - If Experience > 3y -> Increase volume/intensity.
    3. **Habits:** If "Smoking" -> Add cardio for lung capacity? If "Low Water" -> Add cues.
    4. **Rest Timing:** Precise (e.g. 3m for heavy squats, 60s for isolations).
    5. **LANGUAGE:** ${langInstruction}
    6. **IDs:** MUST be unique across the whole week. Use format "d{dayNum}_ex{exNum}" (e.g., "d1_e1", "d1_e2", "d2_e1").

    **OUTPUT SCHEMA (STRICT JSON)**
    {
      "weekSchedule": [
        {
          "day": "Monday", // Translate this (e.g. Lunedì)
          "title": "Glute & Hamstring Focus", // Translate this
          "exercises": [
            { "id": "d1_e1", "name": "Barbell Hip Thrust", "sets": 4, "reps": "8-10", "restSec": 120, "tips": "Chin tucked, pause at top." } // Translate name and tips
          ]
        }
      ]
    }

    Generate excactly ${profile.days} workout days.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON Mode guarantees pure JSON, but we'll trim just in case
    const parsed: ActivePlan = JSON.parse(text.trim());
    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate plan. Please checks your API Key and try again.");
  }
}

export const validateApiKey = (key: string) => key.startsWith('AIza');
