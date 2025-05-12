import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import menuIcon from '@/../assets/fire.png';
// TODO - depois dá para fazer para abrir uma modal quando clicado aqui, informando a streak mais bonitnha, mas não é prioridade.
// TODO 2 - Alterar a fonte de exibição do Text "3", além de deixar maior, [TDEV-15]

export default function MenuButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={menuIcon} style={styles.icon} />
      <Text style={styles.text}>3</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
  text: {
    bottom: 20,
    right: 10
  }
});