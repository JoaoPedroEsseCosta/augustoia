import { useState, useEffect } from "react";
import InputGroup from "../../components/inputGroup";
import useProduto from "../../hooks/useProduto";

const Produtos = () => {
    const { getAll, create, update, remove } = useProduto();

    const [produto, setProduto] = useState({
        nome: "",
        preco: ""
    });

    const [lstProdutos, setLstProdutos] = useState([]);
    const [idEdicao, setIdEdicao] = useState(null);

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function carregarProdutos() {
        try {
            const produtos = await getAll();
            setLstProdutos(produtos);
        } catch (err) {
            alert("Erro ao carregar produtos");
        }
    }

    function validateProduto(produto) {
        if (!produto.nome || !produto.preco) {
            alert("Preencha todos os campos!");
            return false;
        }

        return true;
    }

    function handleChange(e) {
        setProduto({
            ...produto,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateProduto(produto)) {
            return;
        }

        try {
            if (idEdicao) {
                await update(idEdicao, produto);
                alert("Produto atualizado com sucesso!");
            } else {
                await create(produto);
                alert("Produto cadastrado com sucesso!");
            }

            setProduto({ nome: "", preco: "" });
            setIdEdicao(null);
            carregarProdutos();

        } catch (err) {
            alert("Erro ao salvar produto");
        }
    }

    function handleEdit(produto) {
        setProduto({
            nome: produto.nome,
            preco: produto.preco
        });

        setIdEdicao(produto.id);
    }

    async function handleDelete(id) {
        if (!window.confirm("Deseja realmente excluir este produto?")) {
            return;
        }

        try {
            await remove(id);
            alert("Produto excluído com sucesso!");
            carregarProdutos();
        } catch (err) {
            alert("Erro ao excluir produto");
        }
    }

    return (
        <div className="container">
            <h1 className="text-center fs-4">Produtos</h1>

            <div>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        label="Nome"
                        onChange={handleChange}
                        type="text"
                        placeholder="Nome do Produto"
                        name="nome"
                    />

                    <InputGroup
                        label="Preço"
                        onChange={handleChange}
                        type="number"
                        placeholder="Preço do Produto"
                        name="preco"
                    />

                    <button className="btn btn-primary" type="submit">
                        {idEdicao ? "Atualizar" : "Salvar"}
                    </button>

                    {idEdicao && (
                        <button
                            className="btn btn-secondary ms-2"
                            type="button"
                            onClick={() => {
                                setProduto({ nome: "", preco: "" });
                                setIdEdicao(null);
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </form>
            </div>

            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {lstProdutos.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="text-center">
                                Nenhum produto cadastrado
                            </td>
                        </tr>
                    ) : (
                        lstProdutos.map((produto) => (
                            <tr key={produto.id}>
                                <td>{produto.nome}</td>
                                <td>R$ {produto.preco}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(produto)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(produto.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Produtos;