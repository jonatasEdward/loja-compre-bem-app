import { Text, View, Image, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../App';
import { NavigationProp } from '@react-navigation/native';
import { Produto } from '../types/produto';
import { useEffect, useState } from 'react';
import { getByProdutoId } from '../service/produto-service';

type Props = NavigationProp<RootStackParamList, 'TelaDetalheProduto'>;

export default function TelaDetalheProduto({ route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);

  useEffect(() => {
    getByProdutoId(produtoId)
    .then((produto) => {
      setProduto(produto);
    })
    .catch((error) => {
      console.error('Erro ao buscar o produto:', error);
      setProduto(null);
    });
  }, [produtoId]);

  if (!produto) {
    return null;
  }

  return (
        <View style={styles.container}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
      <Text style={styles.descricao}>{produto.descricao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF'
  },
  imagem: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 15
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000268',
  },
  preco: {
    fontSize: 18,
    fontWeight: '600',
    color: '#005f23',
    marginTop: 5
  },
  descricao: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
    lineHeight: 22
  }
});
