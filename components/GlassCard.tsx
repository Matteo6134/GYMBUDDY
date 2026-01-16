import { GlassView } from 'expo-glass-effect';
import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface GlassCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glassEffectStyle?: any;
  tintColor?: string;
  isInteractive?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function GlassCard({
  children,
  style,
  glassEffectStyle = 'regular',
  tintColor,
  isInteractive = false,
  containerStyle
}: GlassCardProps) {
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    // Fallback for web
    return (
      <View style={[styles.webContainer, style]}>
        {children}
      </View>
    );
  }

  // Use GlassView for native "Deep Glass"
  return (
    <GlassView
      glassEffectStyle={glassEffectStyle}
      tintColor={tintColor}
      isInteractive={isInteractive}
      style={[styles.container, containerStyle, style]}
    >
      {children}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  webContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  }
});
