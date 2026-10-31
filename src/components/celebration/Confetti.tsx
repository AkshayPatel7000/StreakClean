import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = ['#B298E7', '#B8E3E9', '#F5B8D5', '#F9BEDD', '#F59E0B', '#10B981'];

interface ParticleConfig {
  id: number;
  startX: number;
  delay: number;
  duration: number;
  size: { width: number; height: number };
  color: string;
}

const PARTICLES: ParticleConfig[] = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  startX: (i * 37) % SCREEN_WIDTH,
  delay: (i % 10) * 110,
  duration: 2200 + ((i * 120) % 800),
  size: {
    width: i % 2 === 0 ? 8 : 10,
    height: i % 3 === 0 ? 14 : 10,
  },
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

export const Confetti: React.FC = () => {
  const animations = useRef(
    PARTICLES.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animators = animations.map((anim, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(PARTICLES[i].delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: PARTICLES[i].duration,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animators.forEach((anim) => anim.start());

    return () => {
      animators.forEach((anim) => anim.stop());
    };
  }, [animations]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PARTICLES.map((particle, i) => {
        const anim = animations[i];

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-40, SCREEN_HEIGHT + 40],
        });

        const translateX = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, (i % 2 === 0 ? 30 : -30), (i % 2 === 0 ? -15 : 20)],
        });

        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${(i % 2 === 0 ? 1 : -1) * 720}deg`],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.1, 0.85, 1],
          outputRange: [0, 1, 0.9, 0],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: particle.startX,
                width: particle.size.width,
                height: particle.size.height,
                backgroundColor: particle.color,
                transform: [{ translateY }, { translateX }, { rotate }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
    borderRadius: 3,
  },
});
