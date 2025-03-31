class CampoCheckbox extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte) {
        super(id, rotulo, largura, dica, "checkbox", fonte, campoFonte);
        this.inicializar();
    }
}