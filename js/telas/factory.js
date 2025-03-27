class TelaFactory {
    static telas = {};

    static obterTela(id, parametros) {
        let tela = TelaFactory.telas[id];

        if (!tela) {
            switch (id) {
                case "busca": {
                    tela = new TelaDeBusca(parametros);
                    break;
                }
                default: {
                    tela = new Tela(id, parametros);
                    break;
                }
            }

            TelaFactory.telas[id] = tela;
        }

        return tela;
    }
}