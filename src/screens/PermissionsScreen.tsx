import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Check, Image as ImageIcon, LockKeyhole, ShieldCheck } from 'lucide-react-native';
import { ScreenContainer, useDeviceInsets } from '../components/common/ScreenContainer';
import { AmbientGlow } from '../components/common/AmbientGlow';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Palette } from '../theme/colors';
import { Layout } from '../theme/layout';
import { PermissionService } from '../services/permissionService';
import { HapticService } from '../services/hapticService';
import { useGameStore } from '../store/useGameStore';
import { RootStackNavigationProp } from '../types/navigation';

interface PermissionsScreenProps {
  onContinue?: () => void;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onContinue }) => {
  const navigation = useNavigation<RootStackNavigationProp<'Permissions'>>();
  const { isCompactScreen } = useDeviceInsets();
  const [loading, setLoading] = useState(false);
  const setHasRequestedPermissions = useGameStore((state) => state.setHasRequestedPermissions);

  const handleAllowPermissions = async () => {
    setLoading(true);
    HapticService.selection();

    try {
      await PermissionService.requestAllPermissions();
      setHasRequestedPermissions(true);
      HapticService.notificationSuccess();
    } catch (error) {
      console.warn('Permission request error:', error);
    } finally {
      setLoading(false);
      if (onContinue) {
        onContinue();
      } else if (navigation && navigation.replace) {
        navigation.replace('Swipe');
      }
    }
  };

  const handleSkipPermissions = () => {
    HapticService.selection();
    setHasRequestedPermissions(true);
    if (onContinue) {
      onContinue();
    } else if (navigation && navigation.replace) {
      navigation.replace('Swipe');
    }
  };

  return (
    <ScreenContainer applyTopInset applyBottomInset>
      <AmbientGlow color={Palette.primary} top="-8%" size={320} opacity={0.25} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isCompactScreen && styles.scrollContentCompact,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.centerCol}>
          {/* Shield trust icon */}
          <View
            style={[
              styles.trustIconContainer,
              isCompactScreen && styles.trustIconContainerCompact,
            ]}
          >
            <ShieldCheck
              size={isCompactScreen ? 30 : 38}
              color={Palette.primaryLight}
              strokeWidth={2.4}
            />
          </View>

          <Text style={styles.eyebrow}>PRIVACY, BUILT IN</Text>
          <Text style={[styles.title, isCompactScreen && styles.titleCompact]}>
            Your memories{'\n'}never leave.
          </Text>
          <Text style={styles.leadText}>
            SwipeClean works entirely on your phone. Zero uploads, zero accounts, zero compromises.
          </Text>

          {/* 100% On-device badge */}
          <View
            style={[
              styles.privacyChip,
              isCompactScreen && styles.privacyChipCompact,
            ]}
          >
            <View style={styles.pulseDot} />
            <Text style={styles.privacyChipText}>100% ON-DEVICE</Text>
          </View>

          {/* Permission item list */}
          <View style={styles.permissionList}>
            {/* Item 1: Photo Library */}
            <View style={styles.permissionRow}>
              <View style={styles.rowIconWrapper}>
                <ImageIcon size={22} color={Palette.eyebrow} strokeWidth={2.2} />
              </View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Full Photo Library Access</Text>
                <Text style={styles.rowSubtitle}>
                  Review and organize your local camera roll.
                </Text>
              </View>
              <Check size={18} color={Palette.keepLight} strokeWidth={3} />
            </View>

            {/* Item 2: Streak Notifications */}
            <View style={styles.permissionRow}>
              <View style={styles.rowIconWrapper}>
                <Bell size={22} color={Palette.eyebrow} strokeWidth={2.2} />
              </View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Daily Streak Notifications</Text>
                <Text style={styles.rowSubtitle}>
                  A gentle nudge before your 24h streak resets.
                </Text>
              </View>
              <Check size={18} color={Palette.keepLight} strokeWidth={3} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.footer, isCompactScreen && styles.footerCompact]}>
        <PrimaryButton
          label="Allow Access & Start Cleaning"
          onPress={handleAllowPermissions}
          loading={loading}
          icon={<ShieldCheck size={20} color="#FFFFFF" strokeWidth={2.5} />}
        />
        <PrimaryButton
          variant="secondary"
          label="Continue with Demo Deck"
          onPress={handleSkipPermissions}
          style={styles.demoButton}
        />
        <View style={styles.disclaimerRow}>
          <LockKeyhole size={13} color={Palette.muted} strokeWidth={2.2} />
          <Text style={styles.disclaimerText}>
            You can change permissions anytime in settings
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  scrollContentCompact: {
    paddingTop: 16,
    paddingBottom: 10,
  },
  centerCol: {
    width: '100%',
    alignItems: 'center',
  },
  trustIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(178, 152, 231, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(196, 177, 238, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  trustIconContainerCompact: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.eyebrow,
    letterSpacing: 2.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  titleCompact: {
    fontSize: 27,
    lineHeight: 31,
    marginBottom: 8,
  },
  leadText: {
    fontSize: 13.5,
    color: Palette.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  privacyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Layout.radius.pill,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.22)',
  },
  privacyChipCompact: {
    marginVertical: 12,
    paddingVertical: 5,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.keepLight,
  },
  privacyChipText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#6EE7B7',
    letterSpacing: 1.4,
  },
  permissionList: {
    width: '100%',
    gap: 12,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  rowIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(178, 152, 231, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  rowSubtitle: {
    fontSize: 11.5,
    color: Palette.muted,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  footerCompact: {
    paddingBottom: 2,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  disclaimerText: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  demoButton: {
    marginTop: 8,
  },
});
