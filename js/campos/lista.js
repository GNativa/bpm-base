class CampoLista extends Campo {
    constructor(id, rotulo, largura, dica, fonte, campoFonte) {
        super(id, rotulo, largura, dica, fonte, campoFonte);
        this.tag = "select";
        this.inicializar();
    }

    configurarCampo() {
        this.classes.push("form-select");
        this.campo.ariaLabel = this.rotulo;

        const opcao = $("<option></option>");
        opcao.val("");
        opcao.text(this.rotulo);

        this.campo.append(opcao);
        this.coluna.append(this.campo);
    }

    adicionarOpcoes(opcoes) {
        const campo = this.campo;

        for (const opcao of opcoes) {
            const elementoOpcao = $("<option></option>");
            elementoOpcao.val(opcao["valor"]);
            elementoOpcao.text(opcao["conteudo"]);
            campo.append(elementoOpcao);
        }

        return this;
    }
}

// OpcaoLista(valor: string, conteudo: string)
/*
    Opção de uma lista de um <select>.
 */

class OpcaoLista {
    constructor(valor, conteudo) {
        this.valor = valor;
        this.conteudo = conteudo;
    }
}