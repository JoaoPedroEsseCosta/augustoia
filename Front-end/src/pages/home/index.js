import { useEffect, useState } from 'react';
import api from '../../util/api';

const Home = () => {

    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [finalizando, setFinalizando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function buscarProdutos() {
            try {
                const response = await api.get('/Produto/getAll');
                setProdutos(response.data);
            } catch (err) {
                setErro('Não foi possível carregar os produtos.');
            } finally {
                setCarregando(false);
            }
        }

        buscarProdutos();
    }, []);

    function adicionarCarrinho(produto) {
        setMensagem('');
        setErro('');

        setCarrinho(atual => {
            const existente = atual.find(
                item => item.produto.id === produto.id
            );

            if (existente) {
                return atual.map(item =>
                    item.produto.id === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }

            return [...atual, {
                produto,
                quantidade: 1
            }];
        });
    }

    function alterarQuantidade(id, quantidade) {
        const valor = Number(quantidade);

        if (!Number.isInteger(valor) || valor < 1) {
            return;
        }

        setCarrinho(atual =>
            atual.map(item =>
                item.produto.id === id
                    ? { ...item, quantidade: valor }
                    : item
            )
        );
    }

    function removerCarrinho(id) {
        setCarrinho(atual =>
            atual.filter(item => item.produto.id !== id)
        );
    }

    const total = carrinho.reduce((soma, item) => {
        return soma + Number(item.produto.preco) * item.quantidade;
    }, 0);

    function formatarPreco(valor) {
        return Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    async function finalizarVenda() {
        if (carrinho.length === 0) {
            setErro('Adicione produtos ao carrinho!');
            return;
        }

        setFinalizando(true);
        setMensagem('');
        setErro('');

        try {
            const response = await api.post('/Venda/finalizar', {
                itens: carrinho.map(item => ({
                    produtoId: item.produto.id,
                    quantidade: item.quantidade
                }))
            });

            setMensagem(
                `Venda #${response.data.venda.id} finalizada com sucesso!`
            );

            setCarrinho([]);

        } catch (err) {
            setErro(
                err.response?.data?.message ||
                'Erro ao finalizar a venda.'
            );
        } finally {
            setFinalizando(false);
        }
    }

    if (carregando) {
        return (
            <div className="container mt-4">
                <p>Carregando produtos...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">

            <h1 className="text-center mb-4">
                Painel de Vendas
            </h1>

            {mensagem && (
                <div className="alert alert-success">
                    {mensagem}
                </div>
            )}

            {erro && (
                <div className="alert alert-danger">
                    {erro}
                </div>
            )}

            <div className="row">

                <div className="col-lg-8">

                    <h4 className="mb-3">
                        Produtos disponíveis
                    </h4>

                    <div className="row">

                        {produtos.length === 0 ? (
                            <p>Nenhum produto cadastrado.</p>
                        ) : (
                            produtos.map(produto => (
                                <div
                                    className="col-md-6 col-lg-4 mb-3"
                                    key={produto.id}
                                >
                                    <div className="card h-100">

                                        {produto.imagem && (
                                            <img
                                                src={produto.imagem}
                                                className="card-img-top"
                                                alt={produto.nome}
                                                style={{
                                                    height: '160px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        )}

                                        <div className="card-body">

                                            <h5 className="card-title">
                                                {produto.nome}
                                            </h5>

                                            <p className="card-text fw-bold">
                                                {formatarPreco(produto.preco)}
                                            </p>

                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() =>
                                                    adicionarCarrinho(produto)
                                                }
                                            >
                                                Adicionar ao carrinho
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                </div>

                <div className="col-lg-4">

                    <div className="card">

                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0">
                                Carrinho de compras
                            </h4>
                        </div>

                        <div className="card-body">

                            {carrinho.length === 0 ? (
                                <p className="text-center">
                                    Seu carrinho está vazio.
                                </p>
                            ) : (
                                carrinho.map(item => (
                                    <div
                                        key={item.produto.id}
                                        className="border-bottom pb-3 mb-3"
                                    >

                                        <h6>{item.produto.nome}</h6>

                                        <p>
                                            {formatarPreco(item.produto.preco)}
                                        </p>

                                        <label className="form-label">
                                            Quantidade
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control mb-2"
                                            value={item.quantidade}
                                            onChange={e =>
                                                alterarQuantidade(
                                                    item.produto.id,
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <p>
                                            Subtotal: {' '}
                                            <strong>
                                                {formatarPreco(
                                                    Number(item.produto.preco) *
                                                    item.quantidade
                                                )}
                                            </strong>
                                        </p>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                removerCarrinho(item.produto.id)
                                            }
                                        >
                                            Remover
                                        </button>

                                    </div>
                                ))
                            )}

                            <hr />

                            <h5 className="d-flex justify-content-between">
                                <span>Total:</span>
                                <span>{formatarPreco(total)}</span>
                            </h5>

                            <button
                                className="btn btn-success w-100 mt-3"
                                onClick={finalizarVenda}
                                disabled={
                                    carrinho.length === 0 || finalizando
                                }
                            >
                                {finalizando
                                    ? 'Finalizando...'
                                    : 'Finalizar venda'}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;