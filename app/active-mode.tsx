import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { RestTimerOverlay } from '@/components/RestTimerOverlay';
import { TRANSLATIONS } from '@/constants/Translations';
import { Exercise, useGymStore } from '@/store/useGymStore';

const { width: PAGE_WIDTH } = Dimensions.get('window');

export default function ActiveModeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { activePlan, workoutProgress, toggleSetComplete, language } = useGymStore();
    const t = TRANSLATIONS[language || 'en'];

    const { day } = useLocalSearchParams();
    const dayName = Array.isArray(day) ? day[0] : day;
    const todaySchedule = activePlan?.weekSchedule.find(d => d.day === dayName);

    const [timerState, setTimerState] = useState<{ visible: boolean; duration: number }>({ visible: false, duration: 60 });

    const exercises = useMemo(() => todaySchedule?.exercises || [], [todaySchedule]);

    const isWorkoutComplete = useMemo(() => {
        if (exercises.length === 0) return false;
        return exercises.every(ex => {
            const completed = (workoutProgress && workoutProgress[ex.id]) || [];
            return completed.length === ex.sets;
        });
    }, [exercises, workoutProgress]);

    const handleToggleSet = (exerciseId: string, setIndex: number, restSec: number) => {
        // Safe check for store action existence (though it should exist)
        if (!toggleSetComplete) return;

        const currentCompleted = (workoutProgress && workoutProgress[exerciseId]) || [];
        const isCompleted = currentCompleted.includes(setIndex);

        if (!isCompleted) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimerState({ visible: true, duration: restSec });
        } else {
            Haptics.selectionAsync();
        }

        toggleSetComplete(exerciseId, setIndex);
    };

    if (!todaySchedule) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>No workout for today.</Text>
                <Pressable onPress={() => router.back()}><Text style={{ color: 'blue' }}>Go Back</Text></Pressable>
            </View>
        );
    }

    const handleFinishWorkout = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
    };

    const renderExerciseCard = ({ item }: { item: Exercise }) => {
        const completedSets = (workoutProgress && workoutProgress[item.id]) || [];

        return (
            <GlassCard style={styles.card} glassEffectStyle="regular">
                <View style={styles.cardHeader}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <View style={styles.tipContainer}>
                        <FontAwesome name="lightbulb-o" size={24} color="#FFD700" />
                        <Text style={styles.tipText}>{item.tips}</Text>
                    </View>
                </View>

                <ScrollView style={styles.setsContainer} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: item.sets }).map((_, idx) => {
                        const isDone = completedSets.includes(idx);
                        return (
                            <Pressable
                                key={idx}
                                style={[styles.setRow, isDone && styles.setRowDone]}
                                onPress={() => handleToggleSet(item.id, idx, item.restSec)}
                            >
                                <View style={styles.setInfo}>
                                    <Text style={[styles.setText, isDone && styles.setTextDone]}>SET {idx + 1}</Text>
                                    <Text style={[styles.setReps, isDone && styles.setTextDone]}>{item.reps} Reps</Text>
                                </View>

                                <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                                    {isDone && <FontAwesome name="check" size={16} color="#000" />}
                                </View>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </GlassCard>
        );
    };

    if (!todaySchedule) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>No workout for today.</Text>
                <Pressable onPress={() => router.back()}><Text style={{ color: 'blue' }}>Go Back</Text></Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000000', '#1c1c1e']}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.closeBtn}>
                    <FontAwesome name="close" size={24} color="#fff" />
                </Pressable>
            </View>

            <View style={styles.carouselContainer}>
                <Carousel
                    loop={false}
                    width={PAGE_WIDTH}
                    height={PAGE_WIDTH * 1.5}
                    data={exercises}
                    scrollAnimationDuration={500}
                    onSnapToItem={(index) => Haptics.selectionAsync()}
                    renderItem={renderExerciseCard}
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 50,
                    }}
                />
            </View>



            <Pressable
                style={[styles.finishBtn, { paddingBottom: insets.bottom + 10 }]}
                onPress={handleFinishWorkout}
                disabled={!isWorkoutComplete}
            >
                <GlassCard
                    style={[styles.finishBtnInner, !isWorkoutComplete && styles.finishBtnDisabled]}
                    glassEffectStyle="regular"
                    tintColor={isWorkoutComplete ? "#fff" : "rgba(255,255,255,0.1)"}
                >
                    <Text style={[styles.finishText, !isWorkoutComplete && styles.finishTextDisabled]}>
                        {isWorkoutComplete ? t.finish_workout : `${exercises.length - Object.keys(workoutProgress || {}).filter(k => ((workoutProgress?.[k] || []).length === (exercises.find(e => e.id === k)?.sets || 0))).length} ${t.exercises_left}`}
                    </Text>
                </GlassCard>
            </Pressable>

            <RestTimerOverlay
                visible={timerState.visible}
                durationSec={timerState.duration}
                onComplete={() => setTimerState(prev => ({ ...prev, visible: false }))}
                onClose={() => setTimerState(prev => ({ ...prev, visible: false }))}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    closeBtn: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    carouselContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 30,
        backgroundColor: 'rgba(30,30,30, 0.5)',
    },
    cardHeader: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 20,
    },
    exerciseName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 10,
    },
    tipContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Light gold bg
        padding: 12,
        borderRadius: 12,
        marginTop: 5
    },
    tipText: {
        color: '#FFD700',
        flex: 1,
        fontSize: 16, // Bigger font
        fontWeight: '600',
        lineHeight: 22
    },
    setsContainer: {
        flex: 1,
    },
    setRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    setRowDone: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderColor: 'rgba(0, 255, 0, 0.3)',
    },
    setInfo: {
        flex: 1,
    },
    setText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    setReps: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
    setTextDone: {
        color: '#fff', // Keep bright
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxDone: {
        backgroundColor: '#fff', // White checkbox for contrast
        borderColor: '#fff',
    },
    finishBtn: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    finishBtnInner: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 30,
    },
    finishText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
    finishBtnDisabled: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
    },
    finishTextDisabled: {
        color: 'rgba(255,255,255,0.3)'
    }
});
