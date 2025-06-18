class CampoData extends CampoEntrada {
    dataInicial;

    constructor(id, rotulo, largura, dica, fonte, campoFonte, usarDataInicial, dataInicial) {
        super(id, rotulo, largura, dica, "date", fonte, campoFonte);
        this.inicializar();

        if (usarDataInicial) {
            this.dataInicial = dataInicial;
            this.definirDataInicial();
        }
    }

    definirDataInicial() {
        let data;

        if (!this.dataInicial) {
            data = new Date();
        }
        else {
            data = this.dataInicial;
        }

        this.val(data.toISOString().slice(0, 10));
    }
}