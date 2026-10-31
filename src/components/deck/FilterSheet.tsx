import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Palette } from '../../theme/colors';
import { Layout } from '../../theme/layout';
import { PhotoFilter } from '../../types/photo';
import { HapticService } from '../../services/hapticService';

interface FilterOption {
  key: PhotoFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All Photos' },
  { key: 'month', label: 'This Month' },
  { key: 'screenshots', label: 'Screenshots' },
  { key: 'videos', label: 'Large Videos' },
];

interface FilterSheetProps {
  visible: boolean;
  activeFilter: PhotoFilter;
  onSelectFilter: (filter: PhotoFilter) => void;
  onClose: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  activeFilter,
  onSelectFilter,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>CHOOSE A DECK</Text>
              <Text style={styles.title}>Filter your photos</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close filter sheet"
            >
              <X size={20} color={Palette.secondary} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          {/* Filter options */}
          <View style={styles.optionsList}>
            {FILTER_OPTIONS.map((item) => {
              const isActive = activeFilter === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => {
                    HapticService.selection();
                    onSelectFilter(item.key);
                    onClose();
                  }}
                  style={[styles.filterRow, isActive && styles.filterRowActive]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      isActive && styles.filterLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isActive && (
                    <Check
                      size={18}
                      color={Palette.keepLight}
                      strokeWidth={3}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: Layout.radius.sheet,
    borderTopRightRadius: Layout.radius.sheet,
    borderTopWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.eyebrow,
    letterSpacing: 1.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 2,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: Palette.border,
  },
  filterRowActive: {},
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.secondary,
  },
  filterLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
