class CampoCheckbox extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte) {
        super(id, rotulo, largura, dica, "checkbox", fonte, campoFonte);
        this.inicializar();
    }

    get preenchido() {
        return this.valor() === true;
    }

    limpar() {
        this.valor(false);
    }

    val(valor) {
        if (typeof valor === "undefined") {
            return this.campo.prop("checked");
        }

        return this.campo.prop("checked", valor).trigger("input").trigger("change");
    }
}