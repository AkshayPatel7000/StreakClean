import React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bell,
  Clock,
  Flame,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react-native';
import { Palette } from '../../theme/colors';
import { useGameStore } from '../../store/useGameStore';
import { HapticService } from '../../services/hapticService';
import { NotificationService } from '../../services/notificationService';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESET_TIMES = [
  { id: '8:30 AM', label: '8:30 AM', sub: 'Morning Kickoff' },
  { id: '1:00 PM', label: '1:00 PM', sub: 'Lunch Break' },
  { id: '8:00 PM', label: '8:00 PM', sub: 'Evening Wind-down' },
  { id: '10:00 PM', label: '10:00 PM', sub: 'Night Owl' },
];

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
}) => {
  const userName = useGameStore((state) => state.userName);
  const streak = useGameStore((state) => state.streakCount);

  const dailyReminderEnabled = useGameStore(
    (state) => state.dailyReminderEnabled
  );
  const dailyReminderTime = useGameStore((state) => state.dailyReminderTime);
  const streakAlertsEnabled = useGameStore(
    (state) => state.streakAlertsEnabled
  );
  const badgeAlertsEnabled = useGameStore(
    (state) => state.badgeAlertsEnabled
  );

  const setDailyReminderEnabled = useGameStore(
    (state) => state.setDailyReminderEnabled
  );
  const setDailyReminderTime = useGameStore(
    (state) => state.setDailyReminderTime
  );
  const setStreakAlertsEnabled = useGameStore(
    (state) => state.setStreakAlertsEnabled
  );
  const setBadgeAlertsEnabled = useGameStore(
    (state) => state.setBadgeAlertsEnabled
  );

  const handleToggleDailyReminder = async (value: boolean) => {
    HapticService.selection();
    setDailyReminderEnabled(value);
    if (value) {
      const granted = await NotificationService.scheduleDailyReminder(
        dailyReminderTime,
        userName,
        streak
      );
      if (!granted) {
        Alert.alert(
          'Notification Permission Required',
          'SwipeClean needs notification permission to send your streak reminders. Please enable notifications in device settings.',
          [{ text: 'Understood' }]
        );
      }
    }
  };

  const handleSelectTime = (time: string) => {
    HapticService.selection();
    setDailyReminderTime(time);
    if (dailyReminderEnabled) {
      NotificationService.scheduleDailyReminder(time, userName, streak);
    }
  };

  const handleTestStreakAlert = () => {
    HapticService.impactMedium();
    NotificationService.triggerTestStreakReminder(userName, streak);
  };

  const handleTestBadgeAlert = () => {
    HapticService.impactMedium();
    NotificationService.triggerTestBadgeUnlock('Byte Sweeper', 100);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconWrapper}>
                <Bell size={20} color={Palette.primary} strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.sheetTitle}>Notification Alerts</Text>
                <Text style={styles.sheetSubtitle}>
                  Protect your streak & celebrate wins
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close notification settings"
            >
              <X size={18} color={Palette.muted} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Setting 1: Daily Reminder Switch */}
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIconCol}>
                  <Clock size={20} color={Palette.eyebrow} strokeWidth={2.2} />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingTitle}>Daily Streak Reminder</Text>
                  <Text style={styles.settingDesc}>
                    Receive a notification before your streak resets
                  </Text>
                </View>
                <Switch
                  value={dailyReminderEnabled}
                  onValueChange={handleToggleDailyReminder}
                  trackColor={{
                    false: Palette.border,
                    true: Palette.primary,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Time Presets */}
              {dailyReminderEnabled && (
                <View style={styles.timePresetsContainer}>
                  <Text style={styles.timePresetsLabel}>REMINDER TIME</Text>
                  <View style={styles.timePresetGrid}>
                    {PRESET_TIMES.map((preset) => {
                      const isSelected = dailyReminderTime === preset.id;
                      return (
                        <TouchableOpacity
                          key={preset.id}
                          onPress={() => handleSelectTime(preset.id)}
                          style={[
                            styles.timePresetChip,
                            isSelected && styles.timePresetChipActive,
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.timePresetChipText,
                              isSelected && styles.timePresetChipTextActive,
                            ]}
                          >
                            {preset.label}
                          </Text>
                          <Text style={styles.timePresetChipSub}>
                            {preset.sub}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Setting 2: Streak Urgency Alerts */}
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIconCol}>
                  <Flame size={20} color={Palette.streak} strokeWidth={2.2} />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingTitle}>Streak Danger Alerts</Text>
                  <Text style={styles.settingDesc}>
                    Urgent ping 2 hours before midnight if unsorted
                  </Text>
                </View>
                <Switch
                  value={streakAlertsEnabled}
                  onValueChange={(val) => {
                    HapticService.selection();
                    setStreakAlertsEnabled(val);
                  }}
                  trackColor={{
                    false: Palette.border,
                    true: Palette.streak,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Setting 3: Badge & Milestone Unlocks */}
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIconCol}>
                  <Trophy size={20} color="#FBBF24" strokeWidth={2.2} />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingTitle}>Milestone Celebrations</Text>
                  <Text style={styles.settingDesc}>
                    Instant alerts when badges & XP ranks unlock
                  </Text>
                </View>
                <Switch
                  value={badgeAlertsEnabled}
                  onValueChange={(val) => {
                    HapticService.selection();
                    setBadgeAlertsEnabled(val);
                  }}
                  trackColor={{
                    false: Palette.border,
                    true: '#FBBF24',
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Live Test Section */}
            <View style={styles.testSection}>
              <Text style={styles.testSectionTitle}>PREVIEW NOTIFICATIONS</Text>
              <Text style={styles.testSectionDesc}>
                Tap below to send a live in-app test notification
              </Text>

              <View style={styles.testButtonsRow}>
                <TouchableOpacity
                  onPress={handleTestStreakAlert}
                  style={styles.testBtn}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel="Test streak notification"
                >
                  <Flame size={16} color={Palette.streak} />
                  <Text style={styles.testBtnText}>Test Streak Alert</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleTestBadgeAlert}
                  style={styles.testBtn}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel="Test badge notification"
                >
                  <Sparkles size={16} color={Palette.primary} />
                  <Text style={styles.testBtnText}>Test Badge Unlock</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity
              onPress={() => {
                HapticService.selection();
                onClose();
              }}
              style={styles.doneBtn}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Done"
            >
              <Text style={styles.doneBtnText}>Save Preferences</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  sheetContainer: {
    maxHeight: '85%',
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(178, 152, 231, 0.25)',
    paddingBottom: 28,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: Palette.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(178, 152, 231, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sheetSubtitle: {
    fontSize: 11,
    color: Palette.muted,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 20,
    gap: 14,
  },
  settingCard: {
    borderRadius: 18,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconCol: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextCol: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  settingDesc: {
    fontSize: 10.5,
    color: Palette.muted,
    lineHeight: 14,
  },
  timePresetsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Palette.border,
  },
  timePresetsLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.eyebrow,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  timePresetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePresetChip: {
    flex: 1,
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  timePresetChipActive: {
    borderColor: Palette.primary,
    backgroundColor: 'rgba(178, 152, 231, 0.18)',
  },
  timePresetChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.secondary,
  },
  timePresetChipTextActive: {
    color: '#FFFFFF',
  },
  timePresetChipSub: {
    fontSize: 9,
    color: Palette.muted,
    marginTop: 2,
  },
  testSection: {
    marginTop: 6,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  testSectionTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Palette.muted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  testSectionDesc: {
    fontSize: 11,
    color: Palette.secondary,
    marginBottom: 12,
  },
  testButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  testBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  testBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  doneBtn: {
    height: 48,
    borderRadius: 16,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
