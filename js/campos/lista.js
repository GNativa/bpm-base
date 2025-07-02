class CampoLista extends Campo {
    #opcoes = [];
    #variasOpcoes = false;

    constructor(id, rotulo, largura, dica, fonte, campoFonte, variasOpcoes) {
        super(id, rotulo, largura, dica, "select", null, fonte, campoFonte);
        this.#variasOpcoes = variasOpcoes ?? this.#variasOpcoes;
        this.inicializar();
    }

    configurarCampo() {
        this.classes.push("form-select");
        this.campo.ariaLabel = this.rotulo;
        this.campo.prop("multiple", this.#variasOpcoes);

        const opcao = $("<option></option>");
        opcao.val("");
        opcao.text(this.rotulo);

        this.campo.append(opcao);
        this.coluna.append(this.campo);
    }

    get variasOpcoes() {
        return this.#variasOpcoes;
    }

    get opcoes() {
        return Object.freeze(this.#opcoes);
    }

    adicionarOpcoes(opcoes = [new OpcaoLista()]) {
        const campo = this.campo;

        for (const opcao of opcoes) {
            this.#opcoes.push(opcao);
            campo.append(opcao.elemento);
        }

        /*
        campo.on("change", () => {
            for (const opcao of this.#opcoes) {
                opcao.selecionada = opcao.elemento.is(":selected");
            }
        });
         */

        return this;
    }
}

// OpcaoLista(valor: string, conteudo: string)
/*
    Opção de uma lista de um <select>.
 */

class OpcaoLista {
    #valor = "";
    #conteudo = "";
    #elemento = $(`<option></option>`);
    selecionada = false;

    constructor(valor, conteudo) {
        this.#valor = valor;
        this.#conteudo = conteudo;

        this.#elemento.val(valor);
        this.#elemento.text(conteudo);
    }

    get elemento() {
        return this.#elemento;
    }

    get valor() {
        return Object.freeze(this.#valor);
    }

    get conteudo() {
        return Object.freeze(this.#conteudo);
    }
}