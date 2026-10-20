import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { listaProdutos, Produto } from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';
import ListaProdutos from './TelaListaProdutos';

export type RootStackParamList = {
  TelaListaProdutos: undefined;
  TelaDetalheProduto: { produtoId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>(listaProdutos);

  function adicionarProduto(novoProduto: Produto) {
    setProdutos([...produtos, novoProduto]);
  }

  function gerarProdutosTeste(quantidade: number) {
    const gerados: Produto[] = Array.from({ length: quantidade }, (_, indice) => ({
      id: Date.now() + indice,
      nome: `Produto de teste ${indice + 1}`,
      preco: `R$ ${(10 + indice).toFixed(2).replace('.', ',')}`,
      imagem: require('./assets/img/produto-mesa.png'),
      descricao: 'Produto gerado para teste de performance da Aula 17.',
    }));
    setProdutos((atual) => [...atual, ...gerados]);
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TelaListaProdutos">
          <Stack.Screen name="TelaListaProdutos" >
            {(props) => (
              <ListaProdutos {...props}
                produtos={produtos}
                onAdicionarProduto={adicionarProduto}
                onGerarProdutosTeste={gerarProdutosTeste} />)}
          </Stack.Screen>
          <Stack.Screen name="TelaDetalheProduto">
            {(props) => <TelaDetalheProduto {...props} produtos={produtos} 
            />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
