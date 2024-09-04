import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, Animated, StyleSheet } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

const SwipeCard = ({ item, onSwipeLeft, onSwipeRight }) => {
  const [panResponder] = useState(new Animated.ValueXY());

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panResponder.x } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        const direction = translationX > 0 ? 'right' : 'left';
        Animated.timing(panResponder, {
          toValue: { x: direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          direction === 'right' ? onSwipeRight() : onSwipeLeft();
        });
      } else {
        Animated.spring(panResponder, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const rotate = panResponder.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [{ translateX: panResponder.x }, { rotate }],
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <Text style={styles.text}>{item.text}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards] = useState([
    { id: 1, text: 'Card 1' },
    { id: 2, text: 'Card 2' },
    { id: 3, text: 'Card 3' },
  ]);

  const handleSwipeLeft = () => {
    setCurrentIndex(currentIndex + 1);
    console.log('Swiped left');
  };

  const handleSwipeRight = () => {
    setCurrentIndex(currentIndex + 1);
    console.log('Swiped right');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Render the rest of the cards first */}
      {cards.map((card, index) => {
        if (index < currentIndex) return null; // Hide cards that have been swiped away
        if (index === currentIndex) return null; // Skip rendering the current card now
        return (
          <View key={card.id} style={[styles.card, styles.nextCard]}>
            <Text style={styles.text}>{card.text}</Text>
          </View>
        );
      })}
      {/* Render the current card last to keep it on top */}
      {currentIndex < cards.length && (
        <SwipeCard
          key={cards[currentIndex].id}
          item={cards[currentIndex]}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCard: {
    top: 10,
    left: SCREEN_WIDTH * 0.05,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
