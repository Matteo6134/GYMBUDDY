import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface HapticSliderProps {
    value: number;
    onValueChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    label: string;
    unit: string;
    style?: StyleProp<ViewStyle>;
}

export function HapticSlider({
    value,
    onValueChange,
    min,
    max,
    step = 1,
    label,
    unit,
    style
}: HapticSliderProps) {

    // Clamp value to safe range for display
    const safeValue = Math.min(Math.max(value, min), max);

    const handleValueChange = (val: number) => {
        // Snap to step
        const steppedValue = Math.round(val / step) * step;

        // Prevent unnecessary updates
        if (steppedValue !== value) {
            // Haptic only on change
            Haptics.selectionAsync();
            onValueChange(steppedValue);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                    {step % 1 === 0 ? Math.round(value) : value.toFixed(1)} {unit}
                </Text>
            </View>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={min}
                maximumValue={max}
                // Removed native 'step' prop to allow smooth sliding
                value={safeValue}
                onValueChange={handleValueChange}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor="#FFFFFF"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
    },
    value: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
