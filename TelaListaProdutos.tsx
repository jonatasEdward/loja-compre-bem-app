import { NavigationProp } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, TextInput, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { RootStackParamList } from './App';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Produto = {
    id: number;
    nome: string;
    preco: number;
    imagem?: string;
    descricao?: string;
}

export const listaProdutos: Produto[] = [
    { id: 1, nome: 'Produto 1', preco: 10.999999, imagem: require('./assets/img/produto-cadeira.png'), descricao: 'Descrição do Produto 1' },
    { id: 2, nome: 'Produto 2', preco: 19.99, imagem: require('./assets/img/produto-mesa.png'), descricao: 'Descrição do Produto 2' },
    { id: 3, nome: 'Produto 3', preco: 5.99, imagem: require('./assets/img/produto-luminaria.png'), descricao: 'Descrição do Produto 3' }
];

type Props = NavigationProp<RootStackParamList, 'TelaListaProdutos'> & {
    produtos: Produto[];
    onAdicionarProduto: (novoProduto: Produto) => void;
    onGerarProdutosTeste: (quantidade: number) => void;
};

const CHAVE_FAVORITOS = '@compre-bem:favoritos';

export default function ListaProdutos({ navigation, produtos, onAdicionarProduto, onGerarProdutosTeste }: Props) {
    const [descricao, setDescricao] = useState('');
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [erro, setErro] = useState('');

    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem(CHAVE_FAVORITOS).then(valor => {
            if (valor) {
                setFavoritos(JSON.parse(valor));
            }
        });
    }, []);

    const [busca, setBusca] = useState('');
    const produtosFiltrados = useMemo(() => {
        return produtos.filter(produto =>
            produto.nome.toLowerCase().includes(busca.toLowerCase())
        );
    }, [busca, produtos]);

    function validarSalvarProduto() {
        if (validarProduto(nome, preco)) {
            const novoProduto: Produto = {
                id: produtos.length + 1,
                nome: nome,
                preco: parseFloat(preco),
                descricao: descricao
            };
            onAdicionarProduto(novoProduto);
            setNome('');
            setPreco('');
            setDescricao('');
        }
    }

    function validarProduto(nome: string, preco: string): boolean {
        if (!nome || !preco) {
            setErro('Por favor, preencha todos os campos.');
            return false;
        }

        if (isNaN(parseFloat(preco.replace(',', '.')))) {
            setErro('Por favor, informe um preço válido.');
            return false;
        }

        return true;
    }

    function alterarFavorito(id: number) {
        setFavoritos((atual) => {
            const novo = atual.includes(id) ? atual.filter(favId => favId !== id) : [...atual, id];
            AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novo));
            return novo;
        });
    }

    return (
        <SafeAreaView style={styles.area} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView style={styles.area}>
                <View style={styles.cadastro}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome Produto"
                        value={nome}
                        onChangeText={setNome}
                        returnKeyType='next'
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Preço Produto"
                        value={preco}
                        onChangeText={setPreco}
                        keyboardType='numeric'
                        returnKeyType='next'
                    />


                    <TextInput
                        style={styles.input}
                        placeholder="Descrição do Produto"
                        value={descricao}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setDescricao}
                        returnKeyType='done'
                    />


                    {erro ? <Text style={{ color: 'red' }}>{erro}</Text> : null}

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={validarSalvarProduto}>
                        <Text>Adicionar Produto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.botaoTeste}
                        onPress={() => onGerarProdutosTeste(300)}
                    >
                        <Text style={styles.botaoTesteTexto}>Gerar 300 produtos de teste (Aula 17)</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.buscar}
                    placeholder="Buscar produtos..."
                    value={busca}
                    onChangeText={setBusca}
                />

                <ScrollView>
                    <FlatList
                        data={produtosFiltrados}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <TouchableOpacity
                                    style={styles.itemInfo}
                                    onPress={() => navigation.navigate('TelaDetalheProduto', { produtoId: item.id })}>
                                    <Text style={styles.nome}>{item.nome}</Text>
                                    <Text style={styles.preco}>R$ {item.preco}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.botaoFavorito}
                                    onPress={() => alterarFavorito(item.id)}>
                                    <Text style={styles.favoritoTexto}>
                                        {favoritos.includes(item.id) ? '♥' : '♡'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        )} />
                </ScrollView>
            </KeyboardAvoidingView >
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#FFF',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    itemInfo: {
        flex: 1,
        padding: 20,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    preco: {
        fontSize: 14,
        color: '#888',
    },
    cadastro: {
        margin: 16,
        marginBottom: 0,
        gap: 8,
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
    },
    area: {
        flex: 1
    },
    botao: {
        backgroundColor: '#727dac',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    buscar: {
        margin: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
    },
    botaoFavorito: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    favoritoTexto: { fontSize: 22, color: '#C62828' },
    botaoTeste: {
        borderWidth: 1,
        borderColor: '#1B3A5C',
        borderRadius: 8,
        padding: 12,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoTesteTexto: { color: '#1B3A5C', fontWeight: '600' },
});
