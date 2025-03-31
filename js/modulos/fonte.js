class Fonte {
    constructor(id, nome, campoChave, campoValor, tipo, filtros) {
        this.id = id;
        this.nome = nome;
        this.campoChave = campoChave;
        this.campoValor = campoValor;
        this.dados = [];
        this.tipo = tipo;
        this.filtros = filtros ?? [];
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