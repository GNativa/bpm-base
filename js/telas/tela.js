class Tela {
    constructor(id, parametros) {
        this.id = `${Constantes.telas.prefixoIdTela}${id.substring(0, 1).toUpperCase()}${id.substring(1)}`;
        this.parametros = parametros;
    }
}