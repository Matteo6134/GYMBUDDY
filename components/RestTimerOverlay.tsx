import { GlassView } from 'expo-glass-effect';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { GlassCard } from './GlassCard';

interface RestTimerOverlayProps {
    durationSec: number;
    onComplete: () => void;
    visible: boolean;
    onClose: () => void;
}

export function RestTimerOverlay({ durationSec, onComplete, visible, onClose }: RestTimerOverlayProps) {
    const [timeLeft, setTimeLeft] = useState(durationSec);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (visible) {
            setTimeLeft(durationSec);
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [visible, durationSec]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleComplete = async () => {
        Vibration.vibrate([0, 500, 200, 500]);
        // Play sound if possible (would need to load asset)
        onComplete();
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={() => { }}>
            <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}>
                <GlassView
                    glassEffectStyle="regular"
                    tintColor="#000" // Dark tint
                    style={[StyleSheet.absoluteFill, styles.container]}
                >
                    <Text style={styles.label}>REST</Text>
                    <Text style={styles.timer}>{timeLeft}</Text>
                    <Text style={styles.unit}>SECONDS</Text>

                    <Pressable onPress={onClose} style={styles.skipButton}>
                        <GlassCard style={styles.buttonInner} glassEffectStyle="regular">
                            <Text style={styles.buttonText}>SKIP REST</Text>
                        </GlassCard>
                    </Pressable>
                </GlassView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)', // Helper for non-native
    },
    label: {
        fontSize: 24,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 4,
        fontWeight: 'bold',
    },
    timer: {
        fontSize: 120,
        fontWeight: '900',
        color: '#fff',
        marginVertical: 20,
        fontVariant: ['tabular-nums'],
    },
    unit: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 2,
    },
    skipButton: {
        position: 'absolute',
        bottom: 80,
    },
    buttonInner: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
