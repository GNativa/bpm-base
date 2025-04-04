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
        "etapa1": ["campo2", "campo3"],
    };

    const camposBloqueados = {                         // Listas dos IDs dos campos bloqueados por etapa
        "etapa1": [],
    };

    const camposOcultos = {                            // Listas dos IDs dos campos ocultos por etapa
        "etapa1": [],
    };

    // Objeto com referências a fontes de dados
    const fontes = {
        "cnpj": new Fonte("cnpj", "Consulta de pessoas jurídicas", null, null,
            Constantes.fontes.tipos.api, {
                "cnpj": "CNPJ",
                "razaoSocial": "Razão social",
                "nomeFantasia": "Nome fantasia",
            },
            null,
            "https://publica.cnpj.ws/cnpj/",
            new ParametrosConsulta({
                    method: "GET"
                },
                null, null,
                () => {
                    return campos["campo2"].val();
                }
            ),
            function (retorno) {

            },
            function (dados) {
                let dadosCnpj = dados[0];
                let registro = {};

                registro["cnpj"] = dadosCnpj["estabelecimento"]["cnpj"];
                registro["razaoSocial"] = dadosCnpj["razao_social"];
                registro["nomeFantasia"] = dadosCnpj["estabelecimento"]["nome_fantasia"] ?? "";
                registro["cep"] = dadosCnpj["estabelecimento"]["cep"];
                registro["estado"] = dadosCnpj["estabelecimento"]["estado"]["sigla"];
                registro["cidade"] = dadosCnpj["estabelecimento"]["cidade"]["nome"];
                const tipoLogradouro = dadosCnpj["estabelecimento"]["tipo_logradouro"] ?? "";
                registro["logradouro"] = (tipoLogradouro !== "" ? (tipoLogradouro + " ") : "") + dadosCnpj["estabelecimento"]["logradouro"];
                registro["numero"] = dadosCnpj["estabelecimento"]["numero"];
                registro["bairro"] = dadosCnpj["estabelecimento"]["bairro"];
                registro["complemento"] = (dadosCnpj["estabelecimento"]["complemento"] ?? "").replace(/\s\s+/g, " ");
                registro["email"] = dadosCnpj["estabelecimento"]["email"];
                const ddd1 = dadosCnpj["estabelecimento"]["ddd1"] ?? "";
                const telefone1 = dadosCnpj["estabelecimento"]["telefone1"] ?? "";
                registro["telefone"] = ddd1 + telefone1;
                const ddd2 = dadosCnpj["estabelecimento"]["ddd2"] ?? "";
                const telefone2 = dadosCnpj["estabelecimento"]["telefone2"] ?? "";
                registro["telefoneAdicional"] = ddd2 + telefone2;

                return [registro];
            },
        ),
    };

    // obterValidacoes(): array<Validacao>
    /*
        Validações a serem usadas no formulário.
     */
    function obterValidacoes() {
        return [];
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
                "campo2", "CNPJ", 4, null, fontes["cnpj"], "cnpj",
                false, false, false
            ),
            new CampoTexto(
                "campo3", "Razão social", 4, null, fontes["cnpj"], "razaoSocial",
                true, false,
            ),
            new CampoTexto(
                "campo4", "Nome fantasia", 2, "As dicas não são obrigatórias.",
                fontes["cnpj"], "nomeFantasia", true, true, null, 5
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
        ];

        salvarCampos(camposSecaoA);
        secaoA = new Secao("secaoA", "Seção A", camposSecaoA);

        campos["campo3"].definirCampoMestre(campos["campo2"]);
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