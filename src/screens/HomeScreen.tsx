import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import '../../i18n';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number; otherParam?: string }; 
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeScreenProps) {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('welcome')}</Text>
      <Button
        title="Ir para Configurações"
        onPress={() => navigation.navigate('Settings')}
      />
	<Button title="PT" onPress={() => i18n.changeLanguage('pt')} />
      <Button title="EN" onPress={() => i18n.changeLanguage('en')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default HomeScreen;
