/*
    > Formulário
        - Mantém o estado do formulário, realizando carregamento e salvamento de dados, validações etc.
 */

const Formulario = (() => {
    // Variáveis para uso em validações, consultas, etc.
    let campos = {};                                    // Objeto contendo referências aos campos do formulário

    let variavelA = true,
        variavelB = "";

    let secaoA,                                             // Seções do formulário com quebra de linha ou também um título
        secaoB,
        secaoC;

    const personalizacao = {
        titulo: "Formulário",
    };

    const camposObrigatorios = {                       // Listas dos IDs dos campos obrigatórios por etapa
        "etapa1": ["campo2", "campo3", "campo4", "campo5"],
        "etapa2": ["campo1", "campo2", "campo3"],
        "etapa3": ["campo1", "campo2", "campo3"],
    };

    const camposBloqueados = {                         // Listas dos IDs dos campos bloqueados por etapa
        "etapa1": ["campo1", "campo7"],
        "etapa2": ["campo1", "campo2", "campo3"],
        "etapa3": ["campo1", "campo2", "campo3"],
    };

    const camposOcultos = {                            // Listas dos IDs dos campos ocultos por etapa
        "etapa1": [],
        "etapa2": [],
        "etapa3": [],
    };

    // Objeto com referências a fontes de dados
    const fontes = {
        "bancos1": new Fonte("bancos1", "Bancos", "codigo", "descricao",
            Constantes.fontes.tipos.tabela),
        "bancos2": new Fonte("bancos2", "Bancos", "codigo", "descricao",
            Constantes.fontes.tipos.tabela),
    };

    // obterValidacoes(): array<Validacao>
    /*
        Validações a serem usadas no formulário.
     */
    function obterValidacoes() {
        return [
            new Validacao(() => {
                    return false;
                },
                "Feedback 1",
                [campos["campo1"]],
                [campos["campo1"], campos["campo2"], campos["campo3"]],
                [],
                null,
                null,
                [campos["campo1"], campos["campo2"], campos["campo3"]],
                [campos["campo1"], campos["campo2"], campos["campo3"]],
            ),
            new Validacao(() => {
                    return false;
                },
                "Feedback 2",
                [campos["campo2"], campos["campo3"]],
                [campos["campo1"], campos["campo2"], campos["campo3"]],
                [],
                [campos["campo1"], campos["campo2"], campos["campo3"]],
                [campos["campo1"], campos["campo2"], campos["campo3"]],
                null,
                null,
            ),
        ];
    }

    // salvarDados(): Promise<{}>
    /*
        Guarda os dados de todos os campos em um objeto para uso na função _saveData da API do workflow.
     */
    async function salvarDados() {
        let dados = {};

        dados.campo1 = campos["campo1"].val();
        dados.campo2 = campos["campo2"].val();
        dados.campo3 = campos["campo3"].val();

        return dados;
    }

    // carregarDados(mapa: Map): void
    /*
        Extrai os dados do mapa obtido como retorno da API do workflow,
        repassando-os para os campos e variáveis necessárias.
     */
    function carregarDados(mapa) {
        campos["campo1"].val(mapa.get("campo1") || "");
        campos["campo2"].val(mapa.get("campo2") || "");
        campos["campo3"].val(mapa.get("campo3") || "");
    }

    // definirEstadoInicial(): void
    /*
        Configura máscaras de campos, consultas de APIs e parâmetros diversos.
     */
    function definirEstadoInicial() {
    }

    // configurarPlugins(): void
    /*
        Configura plugins que necessitam de inicialização na página.
     */
    function configurarPlugins() {
        const tooltipTriggerList =
            document.querySelectorAll(`[data-bs-toggle="tooltip"]`);
        const tooltipList = [...tooltipTriggerList].map(
            tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
        );
    }

    // configurarEventos(): void
    /*
        Configura eventos em elementos diversos.
     */
    function configurarEventos() {
        // A implementar.
    }

    // listarCampos(): void
    /*
        Obtém os IDs dos campos na variável campos{} e os lista no console.
     */
    function listarCampos() {
        const props = [];

        for (const prop in campos) {
            props.push(`"${prop}"`);
        }

        console.log(props.join(", "));
    }

    // gerar(): void
    /*
        Define os campos do formulário, agrupados por seção, e suas propriedades.
     */
    function gerar() {
        const camposSecaoA = [
            new CampoCheckbox(
                "campo1", "Campo 1", 2, "Esta é uma caixa de seleção.",
            ),
            new CampoTexto(
                "campo2", "Código do banco", 4, null, fontes["bancos1"], "A",
                false, false, false
            ),
            new CampoTexto(
                "campo3", "Abreviatura", 4, null, fontes["bancos1"], "B",
                true, false,
            ),
            new CampoTexto(
                "campo4", "Nome", 2, "As dicas não são obrigatórias.",
                fontes["bancos1"], "C", true, false,false, 5
            ),
            new CampoAnexo(
                "campo5", "Campo 5", 6, "Dica", true,
            ),
            new CampoLista(
                "campo6", "Campo 6", 4, "É necessário adicionar opções nesse campo.",
            )
                .adicionarOpcoes([
                    new OpcaoLista("1", "1 - Opção 1"),
                    new OpcaoLista("2", "2 - Opção 2"),
                    new OpcaoLista("3", "3 - Opção 3"),
                ]
            ),
            new CampoData(
                "campo7", "Campo 7", 2, `Este é um campo do tipo "data".`,
            ),
            new CampoTexto("campo8", "A", 3),
            new CampoTexto("campo9", "A", 3),
            new CampoTexto("campo10", "A", 3),
        ];

        salvarCampos(camposSecaoA);
        secaoA = new Secao("secaoA", "Seção A", camposSecaoA);

        campos["campo3"].definirCampoMestre(campos["campo2"]);
        campos["campo4"].definirCampoMestre(campos["campo2"]);
    }

    // salvarDados(listaDeCampos: array<Campo>): void
    /*
        Salva os campos de uma lista no objeto de campos{} para acesso via ID.
     */
    function salvarCampos(listaDeCampos) {
        for (const campo of listaDeCampos) {
            campos[campo["id"]] = campo;
        }
    }

    return {
        personalizacao,
        campos,
        camposObrigatorios,
        camposBloqueados,
        camposOcultos,
        fontes,
        listarCampos,
        carregarDados,
        salvarDados,
        obterValidacoes,
        configurarPlugins,
        definirEstadoInicial,
        configurarEventos,
        gerar
    };
})();