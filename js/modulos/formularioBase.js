class FormularioBase {
    #campos;
    #secoes = new Map();
    #fontes = new Map();
    #conversores = [];
    #validador = null;
    #validacoes = [];
    #personalizacao = new Map();

    constructor(colecao, validador) {
        this.#campos = colecao;
        this.#validador = validador;
    }

    set validacoes(validacoes) {
        this.#validacoes = validacoes;
    }

    obterValidacoes() {
        return this.#validacoes;
    }

    atribuirCampos(colecao) {
        this.#campos = colecao;
    }

    atribuirValidador(validador) {
        this.#validador = validador;
    }

    salvarSecao(secao) {
        this.#secoes.set(secao.id, secao);
    }

    set conversores(conversores) {
        this.#conversores = conversores;
    }

    set camposObrigatorios(campos) {
        this.#validador.definirCamposObrigatorios(campos);
    }

    set camposBloqueados(campos) {
        this.#validador.definirCamposBloqueados(campos);
    }

    set camposOcultos(campos) {
        this.#validador.definirCamposOcultos(campos);
    }

    obterCampo(id, linha) {
        if (typeof linha === "undefined") {
            return this.#campos.obterCampo(id);
        }

        return this.#campos.obterPorLinha(id, linha);
    }

    obterCampos(idAgrupado) {
        return this.#campos.obter(idAgrupado);
    }

    carregarArrayPorLista(listaDeObjetos) {
        const array = [];

        for (let i = 0; i < listaDeObjetos.tamanho; i++) {
            const objeto = {};

            if (this.#conversores.length === 0) {
                for (const campo of listaDeObjetos.obterLinha(i)) {
                    objeto[campo.id] = campo.valor();
                }
            }
            else {
                for (const conversor of this.#conversores) {
                    if (!conversor.salvar) {
                        continue;
                    }

                    objeto[conversor.propriedade] = this.#campos.obterPorLinha(conversor.idCampo, i).valor();
                }
            }

            array.push(objeto);
        }

        return array;
    }

    carregarListaDeObjetos(array, listaDeObjetos) {
        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                listaDeObjetos.adicionarLinha();
            }

            const indice = listaDeObjetos.obterIndiceUltimaLinha();

            for (const conversor of this.#conversores) {
                if (!conversor.carregar) {
                    continue;
                }

                const campo = this.#campos.obterPorLinha(conversor.idCampo, indice);
                const valor = conversor.obterValor(array[i]);
                campo.valor(valor);
            }
        }
    }

    gerar() {
        for (const secao of this.#secoes.values()) {
            secao.gerar();
        }
    }

    get campos() {
        return this.#campos;
    }

    get fontes() {
        return Object.freeze(this.#fontes);
    }

    get personalizacao() {
        return Object.freeze(this.#personalizacao);
    }
}