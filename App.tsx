import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaDetalheProduto from './src/screen/TelaDetalheProduto';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';
import ListaProdutos from './src/screen/TelaListaProdutos';

export type RootStackParamList = {
  TelaListaProdutos: undefined;
  TelaDetalheProduto: { produtoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TelaListaProdutos">
          <Stack.Screen
            name="TelaListaProdutos"
            component={ListaProdutos}
            options={{ title: 'Lista de Produtos' }}
          />
          <Stack.Screen
            name="TelaDetalheProduto"
            component={TelaDetalheProduto}
            options={{ title: 'Detalhes do Produto' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
