import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import menuIcon from '@/../assets/menu.png';
// TODO - em caso de troca para usar outro icone alem do menu classico alterar com base em props qual icone vai aparecer.

export default function MenuButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={menuIcon} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
});