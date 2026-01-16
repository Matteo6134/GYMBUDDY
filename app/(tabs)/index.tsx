import { DayCard } from '@/components/DayCard';
import { GlassCard } from '@/components/GlassCard';
import { TRANSLATIONS } from '@/constants/Translations';
import { useGymStore } from '@/store/useGymStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutsScreen() {
    const { activePlan, userProfile, language } = useGymStore();
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);

    const t = TRANSLATIONS[language || 'en'];

    if (!activePlan || !userProfile) return null;

    const daysMap = t.weekDays || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = daysMap[new Date().getDay()];

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#121212']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>{t.greeting}, {userProfile.name}</Text>
                        </View>
                        <Pressable onPress={() => setIsEditMode(!isEditMode)}>
                            <GlassCard
                                style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                                glassEffectStyle="regular"
                                tintColor={isEditMode ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 122, 255, 0.8)'}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 }}>
                                    {isEditMode ? 'DONE' : 'EDIT'}
                                </Text>
                            </GlassCard>
                        </Pressable>
                    </View>

                    {/* Week Grid */}
                    <Text style={styles.sectionTitle}>{t.your_week}</Text>
                    <View style={styles.grid}>
                        {(activePlan.weekSchedule || []).map((day, index) => (
                            <View key={day.day} style={styles.gridItem}>
                                <DayCard
                                    daySchedule={day}
                                    isToday={day.day === todayName}
                                    isEditMode={isEditMode}
                                    onPressStart={() => router.push({ pathname: '/active-mode', params: { day: day.day } })}
                                    onEdit={() => router.push({ pathname: '/edit-workout', params: { day: day.day } })}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    safeArea: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 30, marginTop: 10 },
    greeting: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
    subtext: { fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 5 },

    sectionTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItem: { width: '48%', marginBottom: 15 }
});
