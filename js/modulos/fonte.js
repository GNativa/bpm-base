class Fonte {
    constructor(id, nome, campoChave, campoValor, camposCorrespondentes) {
        this.id = id;
        this.nome = nome;
        this.campoChave = campoChave;
        this.campoValor = campoValor;
        this.dados = [];
        this.camposCorrespondentes = camposCorrespondentes ?? [];
    }

    definirDados(dados) {
        this.dados = dados;
    }

    obterRegistros() {
        const registros = [];
        const quantidade = this.dados.length;

        if (quantidade === 0) {
            return [];
        }

        const primeiro = this.dados[0];
        let propriedades = [];

        for (const propriedade in primeiro) {
            propriedades.push(propriedade);
        }

        for (const obj of this.dados) {
            for (const propriedade of propriedades) {
                registros.push(obj[propriedade]);
            }
            const registro = new OpcaoLista(obj[chave], `${obj[chave]} - ${obj[valor]}`);
            registros.push(registro);
        }

        console.log(registros);
        return this.dados;
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