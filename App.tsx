import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { IntroScreen } from './src/screens/IntroScreen';
import { PermissionsScreen } from './src/screens/PermissionsScreen';
import { SwipeArenaScreen } from './src/screens/SwipeArenaScreen';
import { BatchReviewScreen } from './src/screens/BatchReviewScreen';
import { CelebrationScreen } from './src/screens/CelebrationScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { PrivacyPolicyScreen } from './src/screens/PrivacyPolicyScreen';
import { RootStackParamList } from './src/types/navigation';
import { Palette } from './src/theme/colors';
import { useGameStore } from './src/store/useGameStore';
import { InAppNotificationBanner } from './src/components/common/InAppNotificationBanner';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: Palette.bg,
    card: Palette.card,
    text: Palette.text,
    border: Palette.border,
    primary: Palette.primary,
  },
};

export default function App() {
  const checkAndUpdateStreak = useGameStore(
    (state) => state.checkAndUpdateStreak
  );

  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar barStyle="light-content" />
        <NavigationContainer theme={NavigationTheme}>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Palette.bg },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Permissions" component={PermissionsScreen} />
            <Stack.Screen
              name="Swipe"
              component={SwipeArenaScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="BatchReview"
              component={BatchReviewScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="Celebration"
              component={CelebrationScreen}
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <InAppNotificationBanner />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
});
