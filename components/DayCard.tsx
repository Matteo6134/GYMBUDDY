import { GlassCard } from '@/components/GlassCard';
import { TRANSLATIONS } from '@/constants/Translations';
import { DaySchedule, useGymStore } from '@/store/useGymStore';
import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface DayCardProps {
    daySchedule: DaySchedule;
    isToday: boolean;
    isEditMode?: boolean;
    onPressStart: () => void;
    onEdit: () => void;
}

export function DayCard({ daySchedule, isToday, isEditMode, onPressStart, onEdit }: DayCardProps) {
    const { workoutProgress, language } = useGymStore();
    const t = TRANSLATIONS[language || 'en'];

    const dayAbbr = daySchedule.day.substring(0, 3).toUpperCase();

    // Check progress
    const isStarted = useMemo(() => {
        return daySchedule.exercises.some(ex => (workoutProgress[ex.id]?.length || 0) > 0);
    }, [workoutProgress, daySchedule]);

    // Parse title for muscle groups
    const muscleGroups = useMemo(() => {
        return daySchedule.title
            .replace(/Day \d+:/i, '')
            .split(/,|&|\+|and/i)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }, [daySchedule.title]);

    const handlePress = () => {
        if (isEditMode) {
            onEdit();
        } else {
            onPressStart();
        }
    };

    const handleLongPress = () => {
        if (Platform.OS !== 'ios') {
            Alert.alert(
                "Modify Workout",
                `Edit ${daySchedule.day}'s workout?`,
                [
                    { text: t.cancel, style: "cancel" },
                    { text: t.edit, onPress: onEdit }
                ]
            );
        }
    };

    // Card Content Component for reusability
    const CardContent = () => (
        <GlassCard
            style={[styles.container, isToday && styles.todayBorder]}
            glassEffectStyle="regular"
            isInteractive
        >
            {/* Header: Day Name */}
            <View style={styles.header}>
                <Text style={styles.dayName}>{dayAbbr}</Text>
                {isToday && (
                    <View style={styles.todayBadge}>
                        <Text style={styles.todayText}>{t.today_badge}</Text>
                    </View>
                )}
            </View>

            {/* Body: Bullet List of Muscle Groups */}
            <View style={styles.body}>
                {muscleGroups.map((group, idx) => (
                    <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bullet}>◉</Text>
                        <Text style={styles.muscleText}>{group.toUpperCase()}</Text>
                    </View>
                ))}
            </View>

            {/* Footer: Count & Button */}
            <View style={styles.footer}>
                <Text style={styles.subtext}>{daySchedule.exercises.length} {t.exercises_count}</Text>
                <View style={styles.btnContainer}>
                    {isEditMode ? (
                        <GlassCard
                            style={styles.btnInner}
                            tintColor="rgba(0, 122, 255, 0.8)"
                        >
                            <Text style={[styles.btnText, { color: '#fff' }]}>{t.edit}</Text>
                        </GlassCard>
                    ) : isToday ? (
                        <GlassCard
                            style={styles.btnInner}
                            tintColor={isStarted ? "rgba(255, 149, 0, 0.8)" : "rgba(52, 199, 89, 0.8)"}
                        >
                            <Text style={[styles.btnText, isStarted && { color: '#000' }]}>
                                {isStarted ? t.resume : t.start}
                            </Text>
                        </GlassCard>
                    ) : (
                        <GlassCard
                            style={styles.btnInner}
                            tintColor="rgba(255, 255, 255, 0.8)"
                        >
                            <Text style={[styles.btnText, { color: '#000000' }]}>
                                {t.view || "VIEW"}
                            </Text>
                        </GlassCard>
                    )}
                </View>
            </View>
        </GlassCard>
    );

    if (Platform.OS === 'ios') {
        return (
            <Link
                href={isEditMode
                    ? { pathname: '/edit-workout', params: { day: daySchedule.day } }
                    : { pathname: '/active-mode', params: { day: daySchedule.day } }
                }
                asChild
            >
                <Pressable style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.9 }]}>
                    <Link.Trigger>
                        <CardContent />
                    </Link.Trigger>

                    <Link.Preview />

                    <Link.Menu>
                        <Link.MenuAction
                            title={t.edit}
                            icon="pencil"
                            onPress={onEdit}
                        />
                        <Link.MenuAction
                            title={t.cancel}
                            icon="xmark"
                            onPress={() => { }}
                            destructive
                        />
                    </Link.Menu>
                </Pressable>
            </Link>
        );
    }

    // Android / Other fallback
    return (
        <Pressable
            onPress={handlePress}
            onLongPress={handleLongPress}
            delayLongPress={500}
            style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.9 }]}
        >
            <CardContent />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15, borderRadius: 24, height: 220, marginBottom: 15, justifyContent: 'space-between' },
    todayBorder: { borderColor: '#FF9500', borderWidth: 1 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    dayName: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
    todayBadge: { backgroundColor: '#FF9500', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    todayText: { color: '#000', fontSize: 10, fontWeight: '900' },

    body: { flex: 1, justifyContent: 'flex-start', gap: 6 },
    bulletItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    bullet: { color: '#fff', fontSize: 10, opacity: 0.6 },
    muscleText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

    footer: { marginTop: 15, gap: 10 },
    subtext: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
    btnContainer: { height: 40, borderRadius: 20, overflow: 'hidden' },
    btnInner: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
    btnText: { color: '#000', fontWeight: '900', fontSize: 12 },
});
