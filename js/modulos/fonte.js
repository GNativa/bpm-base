class Fonte {
    constructor(id, nome, campoChave, campoValor, tipo, filtros) {
        this.id = id;                 // Código de identificação da fonte no formulário
        this.nome = nome;             // Nome de exibição e consulta nas APIs da plataforma
        this.campoChave = campoChave; // Campo a ser utilizado em elementos select como chave
        this.campoValor = campoValor; // Campo a ser utilizado em elementos select como chave
        this.dados = [];              // Lista de registros obtidos por consulta
        this.tipo = tipo;             // Tipo da fonte de dados com relação à origem dos dados (API, tabela, etc.)
        this.filtros = filtros ?? []; // Lista de filtros a serem aplicados na consulta das APIs da plataforma
    }

    definirDados(dados) {
        this.dados = dados;
    }

    obterOpcoes() {
        const opcoes = [];
        const chave = this.campoChave;
        const valor = this.campoValor;

        for (const obj of this.dados) {
            const opcao = new OpcaoLista(obj[chave], `${obj[chave]} - ${obj[valor]}`);
            opcoes.push(opcao);
        }

        return opcoes;
    }
}