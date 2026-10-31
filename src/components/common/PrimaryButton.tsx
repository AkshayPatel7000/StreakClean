import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Palette } from '../../theme/colors';
import { Layout } from '../../theme/layout';
import { HapticService } from '../../services/hapticService';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary' | 'text';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    HapticService.impactLight();
    onPress();
  };

  const getContainerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    let variantStyle: StyleProp<ViewStyle> = styles.primary;
    if (variant === 'danger') variantStyle = styles.danger;
    else if (variant === 'secondary') variantStyle = styles.secondary;
    else if (variant === 'text') variantStyle = styles.textContainer;

    return [
      styles.button,
      variantStyle,
      style,
      pressed && styles.pressed,
      disabled && styles.disabled,
    ];
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => getContainerStyle(pressed)}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? Palette.text : '#FFFFFF'} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.labelText,
              variant === 'secondary' && styles.labelSecondary,
              variant === 'text' && styles.labelOnly,
              disabled && styles.labelDisabled,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 56,
    borderRadius: Layout.radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: Palette.primary,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 6,
  },
  danger: {
    backgroundColor: Palette.trash,
    shadowColor: Palette.trash,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 6,
  },
  secondary: {
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  textContainer: {
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  labelSecondary: {
    color: Palette.secondary,
  },
  labelOnly: {
    color: Palette.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.45,
  },
  labelDisabled: {
    color: Palette.muted,
  },
});
