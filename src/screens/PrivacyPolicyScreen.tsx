import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { useNavigation } from '@react-navigation/native';
import {
  AlertCircle,
  ChevronLeft,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Palette } from '../theme/colors';
import { HapticService } from '../services/hapticService';
import { RootStackNavigationProp } from '../types/navigation';

/**
 * Configure your published Google Sites Privacy Policy URL here.
 * E.g., 'https://sites.google.com/view/streakclean-privacy'
 */
export const PRIVACY_POLICY_URL =
  'https://sites.google.com/view/streakclean/home';

export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'PrivacyPolicy'>>();
  const webViewRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    HapticService.selection();
    navigation.goBack();
  };

  const handleReload = () => {
    HapticService.selection();
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  const handleOpenExternal = async () => {
    HapticService.selection();
    try {
      const canOpen = await Linking.canOpenURL(PRIVACY_POLICY_URL);
      if (canOpen) {
        await Linking.openURL(PRIVACY_POLICY_URL);
      } else {
        Alert.alert('Privacy Policy Link', PRIVACY_POLICY_URL);
      }
    } catch {
      Alert.alert('Privacy Policy Link', PRIVACY_POLICY_URL);
    }
  };

  return (
    <ScreenContainer applyTopInset applyBottomInset style={styles.container}>
      {/* Top Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerIconButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={Palette.text} strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.navTitle}>PRIVACY POLICY</Text>
          <View style={styles.trustBadge}>
            <ShieldCheck size={12} color={Palette.keepLight} strokeWidth={2.5} />
            <Text style={styles.trustBadgeText}>Google Sites</Text>
          </View>
        </View>

        <View style={styles.headerActionRow}>
          <TouchableOpacity
            onPress={handleReload}
            style={styles.headerIconButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Refresh page"
          >
            <RefreshCw size={17} color={Palette.text} strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenExternal}
            style={[styles.headerIconButton, styles.externalIconButton]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open in browser"
          >
            <ExternalLink size={17} color={Palette.primary} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Progress Bar / Indicator */}
      {isLoading && !hasError && (
        <View style={styles.loadingBarContainer}>
          <View style={styles.loadingBarTrack}>
            <ActivityIndicator size="small" color={Palette.primary} />
            <Text style={styles.loadingText}>Loading Privacy Policy...</Text>
          </View>
        </View>
      )}

      {/* WebView or Fallback Error View */}
      {hasError ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconBox}>
              <AlertCircle size={28} color={Palette.streakLight} strokeWidth={2.2} />
            </View>
            <Text style={styles.errorTitle}>Unable to Load Web Page</Text>
            <Text style={styles.errorDesc}>
              {errorMessage ||
                'Please ensure your Google Sites page is published and publicly accessible, or check your internet connection.'}
            </Text>

            <View style={styles.urlDisplayBox}>
              <Text style={styles.urlDisplayText} numberOfLines={2}>
                {PRIVACY_POLICY_URL}
              </Text>
            </View>

            <View style={styles.errorActionCol}>
              <TouchableOpacity
                onPress={handleReload}
                style={styles.retryButton}
                activeOpacity={0.8}
              >
                <RefreshCw size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.retryButtonText}>Retry Loading</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenExternal}
                style={styles.externalButton}
                activeOpacity={0.8}
              >
                <ExternalLink size={16} color={Palette.primaryLight} strokeWidth={2.2} />
                <Text style={styles.externalButtonText}>Open in Browser</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.offlineGuaranteeBox}>
              <ShieldCheck size={16} color={Palette.keepLight} strokeWidth={2.4} />
              <Text style={styles.offlineGuaranteeText}>
                Streak Clean processes 100% of photos on-device with zero cloud uploads.
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: PRIVACY_POLICY_URL }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsBackForwardNavigationGestures={true}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={(syntheticEvent: WebViewErrorEvent): void => {
            const { nativeEvent } = syntheticEvent;
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(nativeEvent.description || 'Connection failed.');
          }}
          onHttpError={(syntheticEvent: WebViewHttpErrorEvent): void => {
            const { nativeEvent } = syntheticEvent;
            if (nativeEvent.statusCode >= 400) {
              setIsLoading(false);
              setHasError(true);
              setErrorMessage(
                `HTTP Error ${nativeEvent.statusCode}: Please ensure your Google Site is published publicly.`
              );
            }
          }}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  navHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.bg,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  externalIconButton: {
    borderColor: Palette.borderAccent,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  navTitle: {
    color: Palette.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  trustBadgeText: {
    color: Palette.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  loadingBarContainer: {
    backgroundColor: Palette.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  loadingBarTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: Palette.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  errorContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorCard: {
    width: '100%',
    backgroundColor: Palette.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 24,
    alignItems: 'center',
  },
  errorIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Palette.streakGlow,
    borderWidth: 1,
    borderColor: Palette.streakBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    color: Palette.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDesc: {
    color: Palette.secondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  urlDisplayBox: {
    backgroundColor: Palette.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 20,
  },
  urlDisplayText: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  errorActionCol: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Palette.primary,
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  externalButton: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  externalButtonText: {
    color: Palette.primaryLight,
    fontSize: 13.5,
    fontWeight: '600',
  },
  offlineGuaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    width: '100%',
  },
  offlineGuaranteeText: {
    flex: 1,
    color: Palette.keepLight,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '500',
  },
});
