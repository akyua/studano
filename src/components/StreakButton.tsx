import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import fireIcon from "@/../assets/images/fire.png";
// TODO - depois dá para fazer para abrir uma modal quando clicado aqui, informando a streak mais bonitnha, mas não é prioridade.
// TODO 2 - Alterar a fonte de exibição do Text "3", além de deixar maior, [TDEV-15]

export default function StreakButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>3</Text>
      <Image source={fireIcon} style={styles.icon} />
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
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',    
  }
});