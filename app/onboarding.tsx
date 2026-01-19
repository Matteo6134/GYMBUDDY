import { GlassCard } from '@/components/GlassCard';
import { HapticSlider } from '@/components/HapticSlider';
import { GEMINI_API_KEY } from '@/constants/Keys';
import { TRANSLATIONS } from '@/constants/Translations';
import { generateWorkoutPlan } from '@/services/geminiService';
import { useGymStore } from '@/store/useGymStore';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
    const router = useRouter();
    const { setUserProfile, setActivePlan, language, setLanguage } = useGymStore();
    const t = TRANSLATIONS[language || 'en'];

    // Steps: 1=Bio, 2=Stats, 3=Lifestyle, 4=Experience, 5=Goals, 6=Loading
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // --- FORM DATA ---
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [birthYear, setBirthYear] = useState(2000);

    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);

    // Lifestyle
    const [waterIntake, setWaterIntake] = useState(2);
    const [sleepHours, setSleepHours] = useState(7);
    const [stressLevel, setStressLevel] = useState('Medium');
    const [dietType, setDietType] = useState('Omnivore');
    const [badHabits, setBadHabits] = useState<string[]>([]);

    // Activity
    const [experienceYears, setExperienceYears] = useState(1);
    const [otherActivities, setOtherActivities] = useState('');
    const [otherSportsFrequency, setOtherSportsFrequency] = useState(0);

    // Goals
    const [days, setDays] = useState(4);
    const [goal, setGoal] = useState('muscle'); // muscle, weight_loss
    const [hypertrophyFocus, setHypertrophyFocus] = useState<string[]>([]);



    const toggleLanguage = () => {
        Haptics.selectionAsync();
        const nextLang = language === 'en' ? 'it' : language === 'it' ? 'pl' : 'en';
        setLanguage(nextLang);
    };

    const getFlag = () => {
        switch (language) {
            case 'it': return '🇮🇹';
            case 'pl': return '🇵🇱';
            default: return '🇬🇧';
        }
    };

    const toggleFocus = (area: string) => {
        Haptics.selectionAsync();
        if (hypertrophyFocus.includes(area)) {
            setHypertrophyFocus(hypertrophyFocus.filter(a => a !== area));
        } else {
            setHypertrophyFocus([...hypertrophyFocus, area]);
        }
    };

    const toggleHabit = (habit: string) => { // habit not used in UI yet? keeping just in case
        Haptics.selectionAsync();
        if (badHabits.includes(habit)) {
            setBadHabits(badHabits.filter(h => h !== habit));
        } else {
            setBadHabits([...badHabits, habit]);
        }
    };

    const nextStep = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (step === 1 && !name.trim()) {
            Alert.alert(t.error, t.error); // Simplify error msg
            return;
        }
        setStep(p => p + 1);
    };

    const prevStep = () => {
        Haptics.selectionAsync();
        setStep(p => p - 1);
    };

    const handleGenerate = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setLoading(true);

        try {
            const profile = {
                name,
                gender,
                birthYear,
                height,
                weight,

                waterIntake: `${waterIntake}L`,
                sleepHours,
                stressLevel,
                dietType,
                badHabits,
                experienceYears,
                otherActivities,
                otherSportsFrequency,

                days,
                goal,
                hypertrophyFocus: hypertrophyFocus.join(', '),
                focusAreas: hypertrophyFocus
            };

            const plan = await generateWorkoutPlan(profile, GEMINI_API_KEY, language || 'en');

            setUserProfile(profile);
            setActivePlan(plan);

            // router.replace('/(tabs)/index' as any); // Let _layout.tsx handle the redirect when userProfile is updated
        } catch (e: any) {
            console.error(e);
            Alert.alert(t.error, "Check API Key or Connection.");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERERS ---

    const renderStep1 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <View style={{ marginBottom: 15 }}>
                <Text style={styles.stepTitle}>{t.welcome}</Text>
                <Text style={styles.stepDesc}>{t.lets_start}</Text>
            </View>

            <GlassCard style={[styles.card, { padding: 20 }]} glassEffectStyle="regular">
                <Text style={styles.label}>{t.name_label}</Text>
                <TextInput
                    style={styles.hugeInput}
                    placeholder={t.name_placeholder}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                />

                <Text style={[styles.label, { marginTop: 20 }]}>{t.gender_label}</Text>
                <View style={styles.chipRow}>
                    {(['male', 'female'] as const).map((g) => (
                        <Pressable
                            key={g}
                            onPress={() => setGender(g)}
                            style={[styles.chip, gender === g && styles.chipActive, { flex: 1, alignItems: 'center', paddingVertical: 12 }]}
                        >
                            <Text style={[styles.chipText, gender === g && styles.chipTextActive, { fontSize: 14 }]}>
                                {g === 'male' ? t.male : t.female}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <HapticSlider label={t.year_birth} unit="" value={birthYear} onValueChange={setBirthYear} min={1960} max={2015} step={1} />
            </GlassCard>

            <Pressable onPress={nextStep} style={styles.nextBtn}>
                <GlassCard style={styles.nextBtnInner} tintColor="#FF9500"><Text style={styles.nextBtnText}>{t.next_step}</Text></GlassCard>
            </Pressable>
        </Animated.View>
    );

    const renderStep2 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{t.body_stats}</Text>
            <Text style={styles.stepDesc}>{t.required_calcs}</Text>
            <GlassCard style={styles.card} glassEffectStyle="regular">
                <HapticSlider label={t.height} unit="cm" value={height} onValueChange={setHeight} min={140} max={220} />
                <HapticSlider label={t.weight} unit="kg" value={weight} onValueChange={setWeight} min={40} max={150} />
            </GlassCard>
            <View style={styles.btnRow}>
                <Pressable onPress={prevStep} style={styles.backBtn}><Text style={styles.backText}>{t.back}</Text></Pressable>
                <Pressable onPress={nextStep} style={styles.nextBtn}><GlassCard style={styles.nextBtnInner} tintColor="#FF9500"><Text style={styles.nextBtnText}>{t.next}</Text></GlassCard></Pressable>
            </View>
        </Animated.View>
    );

    const renderStep3 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{t.lifestyle}</Text>
            <GlassCard style={[styles.card, { padding: 15 }]} glassEffectStyle="regular">
                <HapticSlider label={t.sleep} unit={t.hrs} value={sleepHours} onValueChange={setSleepHours} min={4} max={12} step={0.5} />
                <HapticSlider label={t.water} unit="L" value={waterIntake} onValueChange={setWaterIntake} min={0.5} max={5} step={0.5} />

                <Text style={[styles.label, { marginTop: 15 }]}>{t.diet}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {t.diet_options.map(d => (
                        <Pressable key={d} onPress={() => setDietType(d)} style={[styles.chip, dietType === d && styles.chipActive]}>
                            <Text style={[styles.chipText, dietType === d && styles.chipTextActive]}>{d}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <Text style={[styles.label, { marginTop: 15 }]}>{t.bad_habits_q}</Text>
                <View style={styles.chipRow}>
                    {t.bad_habit_options.map(h => (
                        <Pressable key={h} onPress={() => toggleHabit(h)} style={[styles.chip, badHabits.includes(h) && styles.chipActive]}>
                            <Text style={[styles.chipText, badHabits.includes(h) && styles.chipTextActive]}>{h}</Text>
                        </Pressable>
                    ))}
                </View>
            </GlassCard>
            <View style={styles.btnRow}>
                <Pressable onPress={prevStep} style={styles.backBtn}><Text style={styles.backText}>{t.back}</Text></Pressable>
                <Pressable onPress={nextStep} style={styles.nextBtn}>
                    <GlassCard style={styles.nextBtnInner} tintColor="#FF9500">
                        <Text style={styles.nextBtnText}>{t.next}</Text>
                    </GlassCard>
                </Pressable>
            </View>
        </Animated.View>
    );

    const renderStep4 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{t.experience}</Text>
            <GlassCard style={[styles.card, { padding: 15 }]} glassEffectStyle="regular">
                <HapticSlider label={t.experience} unit={t.yrs} value={experienceYears} onValueChange={setExperienceYears} min={0} max={20} />

                <Text style={[styles.label, { marginTop: 15 }]}>{t.other_activity}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Football, Yoga..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={otherActivities}
                    onChangeText={setOtherActivities}
                />
                <HapticSlider label={t.frequency} unit={t.x_wk} value={otherSportsFrequency} onValueChange={setOtherSportsFrequency} min={0} max={7} step={1} />
            </GlassCard>
            <View style={styles.btnRow}>
                <Pressable onPress={prevStep} style={styles.backBtn}><Text style={styles.backText}>{t.back}</Text></Pressable>
                <Pressable onPress={nextStep} style={styles.nextBtn}>
                    <GlassCard style={styles.nextBtnInner} tintColor="#FF9500">
                        <Text style={styles.nextBtnText}>{t.next}</Text>
                    </GlassCard>
                </Pressable>
            </View>
        </Animated.View>
    );

    const renderStep5 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.stepTitle}>{t.your_goal}</Text>
                <Text style={styles.stepDesc}>{t.what_to_build}</Text>
            </View>

            <GlassCard style={[styles.card, { flex: 1, marginBottom: 20 }]} glassEffectStyle="regular">
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <HapticSlider label={t.training_days} unit={t.wk} value={days} onValueChange={setDays} min={2} max={7} step={1} />

                    <View>
                        <Text style={styles.label}>{t.primary_focus}</Text>
                        <View style={styles.chipRow}>
                            {Object.keys(t.goals).map((g) => (
                                <Pressable
                                    key={g}
                                    onPress={() => setGoal(g)}
                                    style={[styles.chip, goal === g && styles.chipActive, { width: '48%', paddingVertical: 12, alignItems: 'center' }]}
                                >
                                    <Text style={[styles.chipText, goal === g && styles.chipTextActive, { fontSize: 12 }]}>{(t.goals as any)[g].toUpperCase()}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View>
                        <Text style={styles.label}>{t.bigger_focus_q}</Text>
                        <Text style={styles.subLabel}>{t.select_multiple}</Text>
                        <View style={styles.chipRow}>
                            {t.focus_options.map(a => (
                                <Pressable key={a} onPress={() => toggleFocus(a)} style={[styles.chip, hypertrophyFocus.includes(a) && styles.chipActive, { paddingVertical: 8 }]}>
                                    <Text style={[styles.chipText, hypertrophyFocus.includes(a) && styles.chipTextActive, { fontSize: 12 }]}>{a}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </GlassCard>

            <View style={[styles.btnRow, { marginBottom: 20 }]}>
                <Pressable onPress={prevStep} style={styles.backBtn}><Text style={styles.backText}>{t.back}</Text></Pressable>
                <Pressable onPress={handleGenerate} style={[styles.nextBtn, { flex: 2 }]}>
                    <GlassCard style={styles.nextBtnInner} tintColor="#FF9500">
                        <Text style={styles.nextBtnText}>{loading ? t.loading : t.start_training}</Text>
                    </GlassCard>
                </Pressable>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#0a0a0a']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <View key={s} style={[styles.dot, step >= s && styles.dotActive]} />
                        ))}
                    </View>

                    {/* Language Flag at top right */}
                    <Pressable onPress={toggleLanguage} style={styles.flagBtn}>
                        <Text style={{ fontSize: 24 }}>{getFlag()}</Text>
                    </Pressable>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={styles.content}
                        bounces={false}
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                    >
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                        {step === 5 && renderStep5()}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { padding: 25, flexGrow: 1, justifyContent: 'center' },

    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, position: 'relative', height: 40 },
    progressContainer: { flexDirection: 'row', gap: 10 },
    flagBtn: { position: 'absolute', right: 20, padding: 5 },

    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
    dotActive: { backgroundColor: '#FF9500', width: 24 },

    stepContainer: { flex: 1, justifyContent: 'center' }, // Centered content
    stepTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 5 },
    stepDesc: { fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 20 },

    card: { padding: 25, borderRadius: 30, marginBottom: 30 },
    label: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
    subLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 15, marginTop: -5 },
    hugeInput: {
        fontSize: 32, fontWeight: 'bold', color: '#fff',
        borderBottomWidth: 2, borderBottomColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 5
    },
    input: {
        fontSize: 16, color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 10
    },

    row: { flexDirection: 'row', gap: 12, marginBottom: 10 },

    bigToggleBtn: { paddingVertical: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 0 },
    bigToggleBtnActive: {},
    bigToggleText: { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', fontSize: 14 },
    bigToggleTextActive: { color: '#fff' },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    chipActive: { borderColor: '#FF9500', backgroundColor: 'rgba(255, 149, 0, 0.3)' },
    chipText: { color: 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: 12 },
    chipTextActive: { color: '#fff' },

    btnRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 'auto' }, // Push to bottom if needed
    backBtn: { padding: 15 },
    backText: { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' },
    nextBtn: { flex: 1, height: 60 },
    nextBtnInner: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: '#FF9500' },
    nextBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
});
