import { NavigationProp } from '@react-navigation/native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, TextInput, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto, ProdutoRequest } from '../types/produto';
import { getProdutos, postProduto, ultimaPagina } from '../service/produto-service';
import { RootStackParamList } from '../../App';

type Props = NavigationProp<RootStackParamList, 'TelaListaProdutos'>;

const CHAVE_FAVORITOS = '@compre-bem:favoritos';

export default function ListaProdutos({ navigation }: Props) {

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [pagina, setPagina] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');
    const [ultima, setUltima] = useState(false);


   const [descricao, setDescricao] = useState('');
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');

    const [favoritos, setFavoritos] = useState([]);
    
    const buscandoMais = useRef(false);

    function carregarPrimeiraPagina() {
        setCarregando(true);
        getProdutos(0, busca).then((resposta) => {
            setProdutos(resposta.content);
            setPagina(0);
            setUltima(ultimaPagina(resposta));
        })
        .catch((erro) => {
            setErro('Erro ao carregar produtos: ' + erro.message);
        })
        .finally(() => {
            setCarregando(false);
        });
    }

    useEffect(() => {
        carregarPrimeiraPagina();
    }, [busca]);

    async function carregarMaisProdutos() {
        if (buscandoMais.current || ultima || carregando) {
            return;
        }

        buscandoMais.current = true;
        const proximaPagina = pagina + 1;

        try {
            const resposta = await getProdutos(proximaPagina, busca);
            setProdutos((atual) => [...atual, ...resposta.content]);
            setPagina(proximaPagina);
            setUltima(ultimaPagina(resposta));
        }   catch (error) {
            setErro('Erro ao carregar mais produtos: ' + error.message);
        } finally {
            buscandoMais.current = false;
        }
    }   

    useEffect(() => {
        AsyncStorage.getItem(CHAVE_FAVORITOS).then(valor => {
            if (valor) {
                setFavoritos(JSON.parse(valor));
            }
        });
    }, []);

    function validarSalvarProduto() {
        if (validarProduto(nome, preco)) {
            const novoProduto: ProdutoRequest = {
                nome: nome,
                preco: parseFloat(preco),
                descricao: descricao,
                quantidade: parseFloat(quantidade)
            };

            postProduto(novoProduto)
                .then((produto) => {
                    setProdutos((atual) => [produto, ...atual]);
                    setNome('');
                    setPreco('');
                    setDescricao('');
                    setQuantidade('');
                    setErro('');
                })
                .catch((erro) => {
                    setErro('Erro ao salvar produto: ' + erro.message);
                });
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

    function alterarFavorito(id: string) {
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

   
                    <TextInput
                        style={styles.input}
                        placeholder="Quantidade do Produto"
                        value={quantidade}
                        onChangeText={setQuantidade}
                        keyboardType='numeric'
                        returnKeyType='next'
                    />

                    {erro ? <Text style={{ color: 'red' }}>{erro}</Text> : null}

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={validarSalvarProduto}>
                        <Text>Adicionar Produto</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.buscar}
                    placeholder="Buscar produtos..."
                    value={busca}
                    onChangeText={setBusca}
                />

                    <FlatList
                        data={produtos}
                        keyExtractor={(item) => item.produtoId}
                        onEndReached={carregarMaisProdutos}
                        onEndReachedThreshold={0.8}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <TouchableOpacity
                                    style={styles.itemInfo}
                                    onPress={() => navigation.navigate('TelaDetalheProduto', { produtoId: item.produtoId })}>
                                    <Text style={styles.nome}>{item.nome}</Text>
                                    <Text style={styles.preco}>R$ {item.preco}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.botaoFavorito}
                                    onPress={() => alterarFavorito(item.produtoId)}>
                                    <Text style={styles.favoritoTexto}>
                                        {favoritos.includes(item.produtoId) ? '♥' : '♡'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        )} />
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
