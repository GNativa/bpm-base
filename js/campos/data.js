class CampoData extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte) {
        super(id, rotulo, largura, dica, "date", fonte, campoFonte);
        this.inicializar();
    }
}