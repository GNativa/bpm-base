class Constantes {
    static campos = Object.freeze({
        prefixoIdBotaoPesquisa: "botao-",
        classes: Object.freeze({
            carregaveis: "carregaveis-",
        }),
        atributos: Object.freeze({
            fonte: "data-fonte",
            campoFonte: "data-nome-fonte",
        }),
    });

    static telas = Object.freeze({
        prefixoIdTela: "telaDe",
        atributos: Object.freeze({
            sequenciaLinha: "data-seq-linha",
        }),
    });

    static fontes = Object.freeze({
        tipos: Object.freeze({
            api: "api",
            tabela: "tabela",
        }),
    });
}