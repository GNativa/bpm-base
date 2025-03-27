class CampoCheckbox extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte) {
        super(id, rotulo, largura, dica, fonte, campoFonte);
        this.tipo = "checkbox";
        this.inicializar();
    }
}