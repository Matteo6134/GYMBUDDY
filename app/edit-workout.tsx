import { GlassCard } from '@/components/GlassCard';
import { HapticSlider } from '@/components/HapticSlider';
import { TRANSLATIONS } from '@/constants/Translations';
import { DaySchedule, Exercise, useGymStore } from '@/store/useGymStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: PAGE_WIDTH } = Dimensions.get('window');

export default function EditWorkoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { day } = useLocalSearchParams();
    const { activePlan, updateDaySchedule, language } = useGymStore();
    const t = TRANSLATIONS[language || 'en'];

    const [daySchedule, setDaySchedule] = useState<DaySchedule | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [dayNameInput, setDayNameInput] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<ICarouselInstance>(null);

    // If exercises array is empty, we show a "No Exercises" view or a special card.
    // To match active mode carousel, we need data.
    // If empty, we can just show a helper view outside carousel.

    useEffect(() => {
        if (activePlan && day) {
            const dayName = Array.isArray(day) ? day[0] : day;
            const schedule = activePlan.weekSchedule.find(d => d.day === dayName);
            if (schedule) {
                setDaySchedule(schedule);
                setExercises(JSON.parse(JSON.stringify(schedule.exercises)));
                setDayNameInput(schedule.day);
            }
        }
    }, [activePlan, day]);

    const hasUnsavedChanges = () => {
        if (!daySchedule) return false;
        const exercisesChanged = JSON.stringify(exercises) !== JSON.stringify(daySchedule.exercises);
        const nameChanged = dayNameInput !== daySchedule.day;
        return exercisesChanged || nameChanged;
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        if (hasUnsavedChanges()) {
            Alert.alert(
                t.discard_changes,
                t.unsaved_changes_desc,
                [
                    { text: t.keep_editing, style: "cancel" },
                    {
                        text: t.discard,
                        style: "destructive",
                        onPress: () => router.back()
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (!daySchedule) return;

        if (exercises.length === 0) {
            Alert.alert(t.error, "You must have at least one exercise."); // TODO: Translate this Error msg if critical, keeping EN for now as per instructions strict set
            return;
        }

        const newSchedule = { ...daySchedule, exercises, day: dayNameInput };
        updateDaySchedule(daySchedule.day, newSchedule);
        router.back();
    };

    const handleUpdateExercise = (id: string, field: keyof Exercise, value: string | number) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id === id) {
                return { ...ex, [field]: value };
            }
            return ex;
        }));
    };

    const handleDeleteCurrent = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        if (exercises.length === 0) return;

        const exerciseToDelete = exercises[currentIndex];

        Alert.alert(t.confirm_delete, t.delete_exercise_desc, [
            { text: t.cancel, style: "cancel" },
            {
                text: t.delete, style: "destructive", onPress: () => {
                    const isLastItem = currentIndex === exercises.length - 1;
                    if (isLastItem && exercises.length > 1) {
                        carouselRef.current?.scrollTo({ index: currentIndex - 1, animated: true });
                        setTimeout(() => {
                            setExercises(prev => prev.filter(ex => ex.id !== exerciseToDelete.id));
                            setCurrentIndex(prev => prev - 1);
                        }, 300);
                    } else {
                        setExercises(prev => {
                            const newExercises = prev.filter(ex => ex.id !== exerciseToDelete.id);
                            if (currentIndex >= newExercises.length) {
                                setCurrentIndex(Math.max(0, newExercises.length - 1));
                            }
                            return newExercises;
                        });
                    }
                }
            }
        ]);
    };

    const handleAddExercise = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        const newId = `custom_${Date.now()}`;
        const newEx: Exercise = {
            id: newId,
            name: "New Exercise",
            sets: 3,
            reps: "10-12",
            restSec: 60,
            tips: "Added manually"
        };
        // Add to end
        setExercises(prev => [...prev, newEx]);

        // Scroll to new item
        setTimeout(() => {
            carouselRef.current?.scrollTo({ index: exercises.length, animated: true });
        }, 100);
    };

    if (!daySchedule) return null;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#1c1c1e']} style={StyleSheet.absoluteFill} />

            <KeyboardAwareScrollView
                bottomOffset={20}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <Pressable onPress={handleBack} style={styles.backBtn}>
                        <FontAwesome name="arrow-left" size={24} color="#fff" />
                    </Pressable>
                    <TextInput
                        style={styles.headerTitle}
                        value={dayNameInput}
                        onChangeText={setDayNameInput}
                        placeholder={t.day_name_placeholder}
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        selectionColor="#fff"
                    />
                    <Pressable onPress={handleAddExercise} style={styles.addBtnHeader}>
                        <FontAwesome name="plus" size={20} color="#fff" />
                    </Pressable>
                </View>

                {/* Carousel */}
                <View style={styles.carouselContainer}>
                    {exercises.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{t.no_exercises}</Text>
                            <Pressable onPress={handleAddExercise} style={styles.addFirstBtn}>
                                <Text style={styles.addFirstText}>{t.add_exercise}</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <Carousel
                            ref={carouselRef}
                            loop={false}
                            width={PAGE_WIDTH}
                            height={PAGE_WIDTH * 1.1}
                            data={exercises}
                            scrollAnimationDuration={500}
                            onSnapToItem={(index) => {
                                setCurrentIndex(index);
                                Haptics.selectionAsync();
                            }}
                            renderItem={({ item, index }) => {
                                if (!item) return <View />;
                                return (
                                    <GlassCard style={styles.card} glassEffectStyle="regular">
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.label}>{t.exercise_name}</Text>
                                            <TextInput
                                                style={styles.nameInput}
                                                value={item.name}
                                                onChangeText={(t) => handleUpdateExercise(item.id, 'name', t)}
                                                placeholder={t.exercise_name}
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                multiline
                                                numberOfLines={2}
                                                returnKeyType="done"
                                                blurOnSubmit={true}
                                                onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}
                                            />
                                        </View>

                                        <View style={styles.slidersWrapper}>
                                            <HapticSlider
                                                label={t.sets}
                                                unit=""
                                                value={item.sets}
                                                min={1}
                                                max={10}
                                                onValueChange={(v) => handleUpdateExercise(item.id, 'sets', v)}
                                                style={{ marginVertical: 8 }}
                                            />
                                            <HapticSlider
                                                label={t.reps}
                                                unit=""
                                                value={parseInt(item.reps) || 10}
                                                min={1}
                                                max={50}
                                                onValueChange={(v) => handleUpdateExercise(item.id, 'reps', v.toString())}
                                                style={{ marginVertical: 8 }}
                                            />
                                            <HapticSlider
                                                label={t.rest}
                                                unit="s"
                                                value={item.restSec}
                                                min={5}
                                                max={300}
                                                step={5}
                                                onValueChange={(v) => handleUpdateExercise(item.id, 'restSec', v)}
                                                style={{ marginVertical: 8 }}
                                            />
                                        </View>

                                        <Text style={styles.counter}>{index + 1} / {exercises.length}</Text>
                                    </GlassCard>
                                );
                            }}
                            mode="parallax"
                            modeConfig={{
                                parallaxScrollingScale: 0.9,
                                parallaxScrollingOffset: 25,
                            }}
                        />
                    )}
                </View>
            </KeyboardAwareScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDeleteCurrent}>
                    <FontAwesome name="trash" size={20} color="#fff" />
                    <Text style={styles.btnText}>{t.delete}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.saveBtn]} onPress={handleSave}>
                    <FontAwesome name="check" size={20} color="#fff" />
                    <Text style={styles.btnText}>{t.save}</Text>
                </Pressable>
            </View>

            <KeyboardToolbar />
        </View>
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
        marginBottom: 10,
    },
    backBtn: { padding: 10 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    addBtnHeader: { padding: 10 },

    carouselContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        marginHorizontal: 4, // Reduced gap
        padding: 16, // Reduced internal padding
        borderRadius: 30,
        backgroundColor: 'rgba(30,30,30, 0.5)',
        justifyContent: 'center',
    },
    cardHeader: {
        marginBottom: 10,
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: 1
    },
    nameInput: {
        color: '#fff',
        fontSize: 24, // Smaller font for readability
        fontWeight: '900',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 10
    },
    slidersWrapper: {
        marginTop: 10,
    },
    counter: {
        position: 'absolute',
        bottom: 20,
        right: 24,
        color: 'rgba(255,255,255,0.3)',
        fontWeight: 'bold'
    },

    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 10,
        gap: 15,
    },
    actionBtn: {
        flex: 1,
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    deleteBtn: { backgroundColor: 'rgba(255, 69, 58, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 69, 58, 0.5)' },
    saveBtn: { backgroundColor: '#34C759' }, // Solid green
    btnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },

    emptyContainer: { alignItems: 'center', gap: 20 },
    emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 18 },
    addFirstBtn: { padding: 15, backgroundColor: '#fff', borderRadius: 20 },
    addFirstText: { fontWeight: 'bold' }
});
