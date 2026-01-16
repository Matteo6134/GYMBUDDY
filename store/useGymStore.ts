import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    restSec: number;
    tips: string;
}

export interface DaySchedule {
    day: string; // e.g., "Monday"
    title: string; // e.g., "Chest & Triceps"
    exercises: Exercise[];
}

export interface ActivePlan {
    weekSchedule: DaySchedule[];
}

export interface UserProfile {
    name: string;
    birthYear: number;
    height: number;
    weight: number;
    goal: string;
    days: number;
    gender: 'male' | 'female';
    focusAreas: string[];
    waterIntake: string;
    sleepHours: number;
    stressLevel: string; // "Low", "Medium", "High"
    dietType: string; // "Omnivore", "Vegan", "Keto", etc.
    badHabits: string[];
    experienceYears: number;
    otherActivities: string;
    otherSportsFrequency: number;
    hypertrophyFocus: string; // "Glutes", "Arms", "Chest", etc.
}

interface GymState {
    language: 'en' | 'it' | 'pl';
    userProfile: UserProfile | null;
    activePlan: ActivePlan | null;
    workoutProgress: Record<string, number[]>; // exerciseId -> [setIndices]

    setLanguage: (lang: 'en' | 'it' | 'pl') => void;
    setUserProfile: (profile: UserProfile) => void;
    setActivePlan: (plan: ActivePlan) => void;
    updateDaySchedule: (dayName: string, newSchedule: DaySchedule) => void;
    toggleSetComplete: (exerciseId: string, setIndex: number) => void; // New Action
    reset: () => void;
}

// Logic to get device language
const deviceLang = getLocales()[0]?.languageCode;
const defaultLang = (deviceLang === 'it' || deviceLang === 'pl') ? deviceLang : 'en';

export const useGymStore = create<GymState>()(
    persist(
        (set) => ({
            language: defaultLang,
            userProfile: null,
            activePlan: null,
            workoutProgress: {},

            setLanguage: (lang) => set({ language: lang }),
            setUserProfile: (profile) => set({ userProfile: profile }),
            setActivePlan: (plan) => set({ activePlan: plan }),

            updateDaySchedule: (dayName, newSchedule) => set((state) => {
                if (!state.activePlan) return {};
                const newWeek = state.activePlan.weekSchedule.map(d =>
                    d.day === dayName ? newSchedule : d
                );
                return { activePlan: { ...state.activePlan, weekSchedule: newWeek } };
            }),

            toggleSetComplete: (exerciseId, setIndex) => set((state) => {
                const current = state.workoutProgress[exerciseId] || [];
                const exists = current.includes(setIndex);
                const newSets = exists
                    ? current.filter(i => i !== setIndex)
                    : [...current, setIndex];

                return {
                    workoutProgress: {
                        ...state.workoutProgress,
                        [exerciseId]: newSets
                    }
                };
            }),

            reset: () => set({ userProfile: null, activePlan: null, workoutProgress: {} }),
        }),
        {
            name: 'gym-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
