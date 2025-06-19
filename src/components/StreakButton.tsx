import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';

export default function StreakButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>3</Text>
      <Image source={require('../../assets/images/fire.png')} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 1000,
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  }
});
