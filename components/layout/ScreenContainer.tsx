import React from 'react';
import { Animated, Easing, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { useAdaptiveTheme } from '@/hooks';

const TABLET_BREAKPOINT = 768;
const MOBILE_EXTRA_BOTTOM_SPACE = 60;

type ScreenContainerProps = {
  children: React.ReactNode;
  gap?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

type MotionVariant = 'none' | 'moderate' | 'detailed';

type ComplexityAnimatedItemProps = {
  children: React.ReactNode;
  index: number;
  motionVariant: MotionVariant;
};

function ComplexityAnimatedItem({ children, index, motionVariant }: ComplexityAnimatedItemProps) {
  const opacity = React.useRef(new Animated.Value(motionVariant === 'none' ? 1 : 0)).current;
  const translateY = React.useRef(new Animated.Value(motionVariant === 'none' ? 0 : motionVariant === 'detailed' ? 18 : 10)).current;
  const scale = React.useRef(new Animated.Value(motionVariant === 'detailed' ? 0.97 : 1)).current;

  React.useEffect(() => {
    if (motionVariant === 'none') {
      opacity.setValue(1);
      translateY.setValue(0);
      scale.setValue(1);
      return;
    }

    const isDetailed = motionVariant === 'detailed';
    const delay = index * (isDetailed ? 70 : 40);
    const duration = isDetailed ? 420 : 260;

    opacity.setValue(0);
    translateY.setValue(isDetailed ? 18 : 10);
    scale.setValue(isDetailed ? 0.97 : 1);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      isDetailed
        ? Animated.spring(scale, {
            toValue: 1,
            delay,
            stiffness: 130,
            damping: 16,
            mass: 0.7,
            useNativeDriver: true,
          })
        : Animated.timing(scale, {
            toValue: 1,
            duration,
            delay,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
    ]).start();
  }, [index, motionVariant, opacity, scale, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      {children}
    </Animated.View>
  );
}

export default function ScreenContainer({ children, gap, contentContainerStyle }: ScreenContainerProps) {
  const { ui, settings } = useAdaptiveTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < TABLET_BREAKPOINT;
  const extraBottomSpace = isMobile ? MOBILE_EXTRA_BOTTOM_SPACE : 0;
  const focusBackdropColor = ui.mode.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)';
  const motionVariant: MotionVariant = !settings.animationsEnabled || settings.focusMode || settings.complexityLevel === 'simple'
    ? 'none'
    : settings.complexityLevel === 'detailed'
      ? 'detailed'
      : 'moderate';

  const animatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    return (
      <ComplexityAnimatedItem
        key={`motion-${String(child.key ?? index)}-${motionVariant}`}
        index={index}
        motionVariant={motionVariant}
      >
        {child}
      </ComplexityAnimatedItem>
    );
  });

  return (
    <View style={[styles.wrapper, { backgroundColor: ui.colors.bg }]}> 
      {ui.mode.focus ? <View pointerEvents="none" style={[styles.focusBackdrop, { backgroundColor: focusBackdropColor }]} /> : null}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={[
          {
            width: '100%',
            maxWidth: ui.layout.maxContentWidth,
            alignSelf: 'center',
            padding: ui.spacing.lg,
            paddingBottom: ui.spacing.lg + extraBottomSpace,
            gap: gap ?? ui.spacing.md,
            backgroundColor: ui.mode.focus ? 'transparent' : ui.colors.bg,
          },
          ui.layout.isTabletFrame && {
            marginBottom: 16,
            borderWidth: ui.borders.width,
            borderColor: ui.colors.border,
            borderBottomLeftRadius: ui.shape.radius + 4,
            borderBottomRightRadius: ui.shape.radius + 4,
            overflow: 'hidden',
          },
          contentContainerStyle,
        ]}>
        {animatedChildren}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  focusBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
