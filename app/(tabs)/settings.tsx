import { GlassCard } from '@/components/GlassCard';
import { HapticSlider } from '@/components/HapticSlider';
import { GEMINI_API_KEY } from '@/constants/Keys';
import { TRANSLATIONS } from '@/constants/Translations';
import { generateWorkoutPlan } from '@/services/geminiService';
import { useGymStore } from '@/store/useGymStore';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const { userProfile, setUserProfile, setActivePlan, reset, language } = useGymStore();
    const t = TRANSLATIONS[language || 'en'];
    const [loading, setLoading] = useState(false);

    // Editable State
    const [weight, setWeight] = useState(userProfile?.weight || 70);

    // Sync state if store changes (e.g. initial load)
    useEffect(() => {
        if (userProfile) {
            setWeight(userProfile.weight);
        }
    }, [userProfile]);

    if (!userProfile) return null;

    const handleRegenerate = async () => {
        Alert.alert(
            t.regenerate_plan,
            (t as any).regenerate_desc_template
                .replace('{goal}', userProfile.goal.replace('_', ' '))
                .replace('{weight}', weight.toString()),
            [
                { text: t.cancel, style: "cancel" },
                {
                    text: (t as any).regenerate_button,
                    style: 'destructive',
                    onPress: async () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        setLoading(true);
                        try {
                            const newProfile = { ...userProfile, weight };

                            // Call AI
                            const newPlan = await generateWorkoutPlan(newProfile, GEMINI_API_KEY, language || 'en');

                            // Update Store
                            setUserProfile(newProfile);
                            setActivePlan(newPlan);

                            Alert.alert(t.success, (t as any).plan_updated_msg);
                            router.replace("/(tabs)" as any);
                        } catch (e) {
                            Alert.alert(t.error, (t as any).regenerate_error_msg);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleFullReset = () => {
        Alert.alert(
            t.factory_reset,
            t.factory_reset_desc,
            [
                { text: t.cancel, style: "cancel" },
                {
                    text: t.reset_confirm, style: "destructive", onPress: () => {
                        reset();
                        router.replace('/onboarding');
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#1c1c1e']} style={StyleSheet.absoluteFill} />
            <View style={styles.content}>
                <Text style={styles.header}>{t.settings_title}</Text>

                {/* Profile Section */}
                <GlassCard style={styles.card} glassEffectStyle="regular">
                    <View style={styles.gridRow}>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>{t.weight.toUpperCase()}</Text>
                            <Text style={styles.gridValue}>{weight} kg</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>{t.height.toUpperCase()}</Text>
                            <Text style={styles.gridValue}>{userProfile.height} cm</Text>
                        </View>
                    </View>

                    <View style={styles.gridRow}>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>{t.sleep.toUpperCase()}</Text>
                            <Text style={styles.gridValue}>{userProfile.sleepHours} {t.hrs}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>{t.water.toUpperCase()}</Text>
                            <Text style={styles.gridValue}>{userProfile.waterIntake}</Text>
                        </View>
                    </View>

                    <View style={styles.gridRow}>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>{t.diet.toUpperCase()}</Text>
                            <Text style={styles.gridValue}>{userProfile.dietType}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>{(t as any).stress_label}</Text>
                            <Text style={styles.gridValue}>{userProfile.stressLevel}</Text>
                        </View>
                    </View>

                    {userProfile.focusAreas && userProfile.focusAreas.length > 0 && (
                        <View style={{ marginTop: 15 }}>
                            <Text style={styles.gridLabel}>{t.primary_focus.toUpperCase()}</Text>
                            <View style={styles.chipRow}>
                                {userProfile.focusAreas.map(f => (
                                    <View key={f} style={styles.chip}>
                                        <Text style={styles.chipText}>{f}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <Pressable style={styles.editBtn} onPress={() => {
                        Alert.alert(t.edit_profile, (t as any).onboarding_redirect_msg, [
                            { text: t.cancel },
                            { text: (t as any).go_to_onboarding, onPress: () => router.replace('/onboarding') }
                        ])
                    }}>
                        <Text style={styles.editBtnText}>{t.edit_profile}</Text>
                    </Pressable>

                    {/* Quick Weight Edit */}
                    <View style={{ marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
                        <HapticSlider
                            label={t.weight_update_label}
                            unit="kg"
                            value={weight}
                            onValueChange={setWeight}
                            min={40}
                            max={150}
                        />
                    </View>
                </GlassCard>

                <Pressable
                    style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handleRegenerate();
                    }}
                    disabled={loading}
                >
                    <GlassCard style={styles.btnInner} glassEffectStyle="regular" containerStyle={{ borderRadius: 28, borderWidth: 0 }}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.btnText, { color: '#fff' }]}>{t.update_regenerate}</Text>}
                    </GlassCard>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.btn, { marginTop: 15, opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handleFullReset();
                    }}
                >
                    <GlassCard style={styles.btnInner} tintColor="rgba(255,59,48,0.3)" glassEffectStyle="regular" containerStyle={{ borderRadius: 28, borderWidth: 0 }}>
                        <Text style={[styles.btnText, { color: '#FF453A' }]}>{t.reset_all}</Text>
                    </GlassCard>
                </Pressable>

                <Text style={styles.version}>GymBuddy v1.0.0 (AI Powered)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { padding: 20, paddingTop: 60 },
    header: { fontSize: 34, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: 10, marginLeft: 5 },
    card: { padding: 20, borderRadius: 20, marginBottom: 30 },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    label: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
    value: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },

    gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    gridItem: { flex: 1 },
    gridLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 'bold', marginBottom: 4, letterSpacing: 1 },
    gridValue: { color: '#fff', fontSize: 16, fontWeight: '600' },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5 },
    chip: { backgroundColor: 'rgba(255, 149, 0, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderColor: 'rgba(255, 149, 0, 0.3)', borderWidth: 1 },
    chipText: { color: '#FF9500', fontSize: 12, fontWeight: 'bold' },

    editBtn: { alignSelf: 'center', marginTop: 10, padding: 10 },
    editBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'bold' },

    btn: { height: 56, borderRadius: 28, overflow: 'hidden' },
    btnInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    btnText: { fontWeight: '900', fontSize: 14, letterSpacing: 1 },

    version: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 40, fontSize: 12 }
});
