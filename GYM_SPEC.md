# PROJECT BLUEPRINT: AeroGym AI (iOS 26 Native)

## 1. Project Overview
App di allenamento personale generata da AI.
**Platform:** iOS (Expo Go SDK 54).
**Visual Style:** "Deep Glass". L'interfaccia deve sembrare vetro scuro fluttuante su sfondo nero.
**Navigation:** Expo Router con **Native Bottom Tabs** trasparenti.

## 2. Tech Stack & Dependencies
- **Core:** React Native, Expo SDK 54, TypeScript.
- **Router:** `expo-router` (File-based routing).
- **Visuals:**
  - `expo-glass-effect` (Usare la props `systemUltraThinMaterial`).
  - `expo-linear-gradient` (Per i progress rings e sfondi).
  - `react-native-reanimated` (Per le transizioni fluide durante il workout).
- **Data/State:** `zustand` (State management), `react-native-mmkv` (Persistenza dati).
- **AI:** Google Gemini (per generare il piano JSON).

## 3. Data Structure (The Contract)
L'AI deve generare e l'App deve salvare questo formato:
```json
{
  "userProfile": { "height": 180, "weight": 75, "goal": "muscle", "days": 4 },
  "activePlan": {
    "weekSchedule": [
      {
        "day": "Monday",
        "title": "Chest & Triceps",
        "exercises": [
          {
            "id": "ex1",
            "name": "Bench Press",
            "sets": 4,
            "reps": "8-12",
            "restSec": 90,
            "tips": "Focus on eccentric movement"
          }
        ]
      }
    ]
  }
}