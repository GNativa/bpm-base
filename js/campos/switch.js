class CampoSwitch extends CampoCheckbox {
    constructor(id, rotulo, largura, dica, fonte, campoFonte) {
        super(id, rotulo, largura, dica, fonte, campoFonte);
        this.inicializar();

        this.filhoColuna.addClass("form-switch");
        this.campo.attr("role", "switch");
    }
}