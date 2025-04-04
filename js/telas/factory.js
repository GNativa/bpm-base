class TelaFactory {
    static telas = {};

    static obterTela(id, parametros) {
        if (!TelaFactory.telas[id]) {
            switch (id) {
                case Constantes.telas.busca: {
                    TelaFactory.telas[id] = new TelaDeBusca(parametros);
                    break;
                }
                default: {
                    TelaFactory.telas[id] = new Tela(id, parametros);
                    break;
                }
            }
        }

        return TelaFactory.telas[id];
    }
}
