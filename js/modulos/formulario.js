/*
    > Formulário
        - Mantém o estado do formulário, realizando carregamento e salvamento de dados, validações, etc.
 */

const Formulario = (() => {
    // Variáveis para uso em validações, consultas, etc.
    let campos = {};                                    // Objeto contendo referências aos campos do formulário

    let secaoAprovacao,              // Seção de aprovação
        secaoDadosPrincipais,        // Seção dos dados principais
        secaoContaBancaria,          // Etc.
        secaoDetalhesDocumentos,
        secaoControle;

    const personalizacao = {
        titulo: "Formulário",
    };

    const camposObrigatorios = {                       // Listas dos IDs dos campos obrigatórios por etapa
        "etapa1": [],
    };

    const camposBloqueados = {                         // Listas dos IDs dos campos bloqueados por etapa
        "etapa1": [],
    };

    const camposOcultos = {                            // Listas dos IDs dos campos ocultos por etapa
        "etapa1": [],
    };

    const nomeFonteCnpj = "Consulta de pessoas jurídicas";

    const fonteCnpj = new Fonte("cnpj", nomeFonteCnpj, null, null,
        Constantes.fontes.tipos.api, {
            "cnpj": "CNPJ",
            "razaoSocial": "Razão social",
            "nomeFantasia": "Nome fantasia",
            "cep": "CEP",
            "estado": "Estado",
            "cidade": "Cidade",
            "logradouro": "Logradouro",
            "numero": "Número",
            "bairro": "Bairro",
            "complemento": "Complemento",
            "emailContato": "E-mail para contato",
            "telefone": "Telefone",
            "contatoAdicional": "Contato adicional",
        },
        () => {
            const valor = campos["documento"].val();
            return valor.length === 14;
        },
        null,
        "https://publica.cnpj.ws/cnpj/",
        new ParametrosConsulta({
                method: "GET"
            },
            null, null,
            function () {
                const valor = campos["documento"].val();

                if (valor === "") {
                    throw new ExcecaoMensagem(
                        nomeFonteCnpj,
                        `O campo "${campos["documento"].rotulo}" não pode estar vazio para consultas.`,
                        "aviso"
                    );
                }

                return valor;
            }
        ),
        function (retorno) {
            if (!retorno || retorno.length === 0 || !retorno["status"]) {
                return;
            }

            let status = retorno["status"];
            let titulo = nomeFonteCnpj;
            let mensagem, tipoMensagem;

            switch (status) {
                case 400: {
                    mensagem = "CNPJ inválido.";
                    tipoMensagem = "aviso";
                    break;
                }
                case 404: {
                    mensagem = "CNPJ não encontrado.";
                    tipoMensagem = "aviso";
                    break;
                }
                case 429: {
                    //consultarSpeedio();
                    //return;
                    mensagem = retorno["detalhes"];
                    tipoMensagem = "erro";
                    break;
                }
                case 500: {
                    mensagem = retorno["detalhes"];
                    tipoMensagem = "erro";
                    break;
                }
                default: {
                    mensagem = retorno["detalhes"];
                    tipoMensagem = "erro";
                    break;
                }
            }

            throw new ExcecaoMensagem(titulo, mensagem, tipoMensagem);
        },
        function (dados) {
            if (!dados || dados.length === 0) {
                return [];
            }

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
            registro["emailContato"] = dadosCnpj["estabelecimento"]["email"];
            const ddd1 = dadosCnpj["estabelecimento"]["ddd1"] ?? "";
            const telefone1 = dadosCnpj["estabelecimento"]["telefone1"] ?? "";
            registro["telefone"] = ddd1 + telefone1;
            const ddd2 = dadosCnpj["estabelecimento"]["ddd2"] ?? "";
            const telefone2 = dadosCnpj["estabelecimento"]["telefone2"] ?? "";
            registro["contatoAdicional"] = ddd2 + telefone2;

            return [registro];
        },
    );

    // Objeto com referências a fontes de dados
    const fontes = {
        "cnpjDadosGerais": fonteCnpj,
        "cnpjContasBancarias": Object.assign({}, fonteCnpj),
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

        dados.observacoesAprovacao = campos["observacoesAprovacao"].val();
        dados.documento = campos["documento"].cleanVal(); // Valor do campo sem máscara
        dados.cadastroComRestricao = campos["cadastroComRestricao"].campo.prop("checked"); // Estado do checkbox (marcado ou não marcado)
        dados.razaoSocial = campos["razaoSocial"].val();
        dados.nomeFantasia = campos["nomeFantasia"].val();
        dados.mercadoExterior = campos["mercadoExterior"].campo.prop("checked");
        dados.fornecedorIndustria = campos["fornecedorIndustria"].campo.prop("checked");
        dados.ramoAtividade = campos["ramoAtividade"].val();
        dados.inscricaoEstadual = campos["inscricaoEstadual"].val();
        dados.cep = campos["cep"].cleanVal();
        dados.estado = campos["estado"].val();
        dados.cidade = campos["cidade"].val();
        dados.logradouro = campos["logradouro"].val();
        dados.numero = campos["numero"].val();
        dados.bairro = campos["bairro"].val();
        dados.complemento = campos["complemento"].val();
        dados.enderecoCorresp = campos["enderecoCorresp"].val();
        dados.nomeContato = campos["nomeContato"].val();
        dados.emailContato = campos["emailContato"].val();
        dados.emailAdicional = campos["emailAdicional"].val();
        dados.telefone = campos["telefone"].cleanVal();
        dados.celular = campos["celular"].cleanVal();
        dados.contatoAdicional = campos["contatoAdicional"].cleanVal();
        dados.formaPagamento = campos["formaPagamento"].val();
        dados.banco = campos["banco"].val();
        dados.agenciaDigito = campos["agenciaDigito"].val();
        dados.contaDigito = campos["contaDigito"].val();
        dados.tipoConta = campos["tipoConta"].val();
        dados.documentoConta = campos["documentoConta"].cleanVal();
        dados.titularComRestricao = campos["titularComRestricao"].campo.prop("checked");
        dados.titularConta = campos["titularConta"].val();
        dados.favNomeFantasia = campos["favNomeFantasia"].val();
        dados.favCep = campos["favCep"].val();
        dados.favEstado = campos["favEstado"].val();
        dados.favCidade = campos["favCidade"].val();
        dados.favLogradouro = campos["favLogradouro"].val();
        dados.favBairro = campos["favBairro"].val();
        dados.favNumero = campos["favNumero"].val();
        dados.favComplemento = campos["favComplemento"].val();
        dados.favEmail = campos["favEmail"].val();
        dados.favTelefone = campos["favTelefone"].cleanVal();
        dados.observacoes = campos["observacoes"].val();
        dados.documentosPessoaFisica = await Utilitario.salvarArquivosEmString(
            campos["documentosPessoaFisica"].obterElementoHtml()
        ); // Salvamento de anexo na forma de uma string
        dados.comprovanteEndereco = await Utilitario.salvarArquivosEmString(
            campos["comprovanteEndereco"].obterElementoHtml()
        );
        dados.comprovanteContaBancaria = await Utilitario.salvarArquivosEmString(
            campos["comprovanteContaBancaria"].obterElementoHtml()
        );
        dados.nomeUsuario = campos["nomeUsuario"].val();
        dados.retornoRegra = campos["retornoRegra"].val();

        return dados;
    }

    // carregarDados(mapa: Map): void
    /*
        Extrai os dados do mapa obtido como retorno da API do workflow,
        repassando-os para os campos e variáveis necessárias.
     */
    function carregarDados(mapa) {
        campos["observacoesAprovacao"].val(mapa.get("observacoesAprovacao") || "");
        campos["documento"].val(mapa.get("documento") || "");
        const cnpjInaptoCadastro = (mapa.get("cadastroComRestricao") ?? "false") === "true";
        campos["cadastroComRestricao"].campo.prop("checked", cnpjInaptoCadastro);
        campos["razaoSocial"].val(mapa.get("razaoSocial") || "");
        campos["nomeFantasia"].val(mapa.get("nomeFantasia") || "");
        campos["mercadoExterior"].campo.prop("checked", (mapa.get("mercadoExterior") ?? "false") === "true");
        campos["fornecedorIndustria"].campo.prop("checked", (mapa.get("fornecedorIndustria") ?? "false") === "true");
        campos["ramoAtividade"].val(mapa.get("ramoAtividade") || "");
        campos["inscricaoEstadual"].val(mapa.get("inscricaoEstadual") || "");
        campos["cep"].val(mapa.get("cep") || "");
        campos["estado"].val(mapa.get("estado") || "");
        campos["cidade"].val(mapa.get("cidade") || "");
        campos["logradouro"].val(mapa.get("logradouro") || "");
        campos["numero"].val(mapa.get("numero") || "");
        campos["bairro"].val(mapa.get("bairro") || "");
        campos["complemento"].val(mapa.get("complemento") || "");
        campos["enderecoCorresp"].val(mapa.get("enderecoCorresp") || "");
        campos["nomeContato"].val(mapa.get("nomeContato") || "");
        campos["emailContato"].val(mapa.get("emailContato") || "");
        campos["emailAdicional"].val(mapa.get("emailAdicional") || "");
        campos["telefone"].val(mapa.get("telefone") || "");
        campos["celular"].val(mapa.get("celular") || "");
        campos["contatoAdicional"].val(mapa.get("contatoAdicional") || "");
        campos["formaPagamento"].val(mapa.get("formaPagamento") || "");
        campos["banco"].val(mapa.get("banco") || "");
        campos["agenciaDigito"].val(mapa.get("agenciaDigito") || "");
        campos["contaDigito"].val(mapa.get("contaDigito") || "");
        campos["tipoConta"].val(mapa.get("tipoConta") || "");
        campos["documentoConta"].val(mapa.get("documentoConta") || "");
        const cnpjInaptoTitular = (mapa.get("titularComRestricao") ?? "false") === "true";
        campos["titularComRestricao"].campo.prop("checked", cnpjInaptoTitular);
        campos["titularConta"].val(mapa.get("titularConta") || "");
        campos["favNomeFantasia"].val(mapa.get("favNomeFantasia") || "");
        campos["favCep"].val(mapa.get("favCep") || "");
        campos["favEstado"].val(mapa.get("favEstado") || "");
        campos["favCidade"].val(mapa.get("favCidade") || "");
        campos["favLogradouro"].val(mapa.get("favLogradouro") || "");
        campos["favBairro"].val(mapa.get("favBairro") || "");
        campos["favNumero"].val(mapa.get("favNumero") || "");
        campos["favComplemento"].val(mapa.get("favComplemento") || "");
        campos["favEmail"].val(mapa.get("favEmail") || "");
        campos["favTelefone"].val(mapa.get("favTelefone") || "");
        campos["observacoes"].val(mapa.get("observacoes") || "");
        campos["nomeUsuario"].val(mapa.get("nomeUsuario") || "");
        campos["retornoRegra"].val(mapa.get("retornoRegra") || "");
        campos["documentosPessoaFisica"].campo.prop(
            "files",
            Utilitario.carregarArquivosDeString(mapa.get("documentosPessoaFisica") || "")
        );
        campos["comprovanteEndereco"].campo.prop(
            "files",
            Utilitario.carregarArquivosDeString(mapa.get("comprovanteEndereco") || "")
        );
        campos["comprovanteContaBancaria"].campo.prop(
            "files",
            Utilitario.carregarArquivosDeString(mapa.get("comprovanteContaBancaria") || "")
        );
    }

    // definirEstadoInicial(): void
    /*
        Configura máscaras de campos, consultas de APIs e parâmetros diversos.
     */
    function definirEstadoInicial() {
    }

    // configurarEventos(): void
    /*
        Configura eventos em elementos diversos.
     */
    function configurarEventos() {
        // A implementar.
    }

    // gerar(): void
    /*
        Define os campos do formulário, agrupados por seção, e suas propriedades.
     */
    function gerar() {
        const camposAprovacao = [
            new CampoTexto(
                "observacoesAprovacao", "Observações de aprovação", 12, null, null, null, null, null, null, 5
            ),
        ];

        secaoAprovacao = new Secao("aprovacao", "Aprovação", camposAprovacao);
        secaoAprovacao.gerar();

        const listaEstados = [
            new OpcaoLista("AC", "AC - Acre"),
            new OpcaoLista("AL", "AL - Alagoas"),
            new OpcaoLista("AM", "AM - Amazonas"),
            new OpcaoLista("AP", "AP - Amapá"),
            new OpcaoLista("BA", "BA - Bahia"),
            new OpcaoLista("CE", "CE - Ceará"),
            new OpcaoLista("DF", "DF - Distrito Federal"),
            new OpcaoLista("ES", "ES - Espírito Santo"),
            new OpcaoLista("GO", "GO - Goiás"),
            new OpcaoLista("MA", "MA - Maranhão"),
            new OpcaoLista("MG", "MG - Minas Gerais"),
            new OpcaoLista("MS", "MS - Mato Grosso do Sul"),
            new OpcaoLista("MT", "MT - Mato Grosso"),
            new OpcaoLista("PA", "PA - Pará"),
            new OpcaoLista("PB", "PB - Paraíba"),
            new OpcaoLista("PE", "PE - Pernambuco"),
            new OpcaoLista("PI", "PI - Piauí"),
            new OpcaoLista("PR", "PR - Paraná"),
            new OpcaoLista("RJ", "RJ - Rio de Janeiro"),
            new OpcaoLista("RN", "RN - Rio Grande do Norte"),
            new OpcaoLista("RO", "RO - Rondônia"),
            new OpcaoLista("RR", "RR - Roraima"),
            new OpcaoLista("RS", "RS - Rio Grande do Sul"),
            new OpcaoLista("SC", "SC - Santa Catarina"),
            new OpcaoLista("SE", "SE - Sergipe"),
            new OpcaoLista("SP", "SP - São Paulo"),
            new OpcaoLista("TO", "TO - Tocantins"),
            new OpcaoLista("CO", "CO - COLORADO"),
            new OpcaoLista("DL", "DL - DELAWARE"),
            new OpcaoLista("EX", "EX - Exterior"),
            new OpcaoLista("IA", "IA - Iowa"),
            new OpcaoLista("KA", "KA - Kansas"),
            new OpcaoLista("NP", "NP - New Providence"),
            new OpcaoLista("TN", "TN - Tennessee"),
            new OpcaoLista("US", "US - Estados Unidos"),
            new OpcaoLista("SU", "SU - Switzerland"),
        ];

        const camposDadosPrincipais = [
            new CampoTexto(
                "documento", "CPF/CNPJ", 4, null, fontes["cnpjDadosGerais"], "cnpj",
                false, false, false
            ),
            new CampoLista("tipoPessoa", "Tipo de pessoa", 2)
                .adicionarOpcoes([
                    new OpcaoLista("F", "F - Física"),
                    new OpcaoLista("J", "J - Jurídica"),
                ]),
            new CampoCheckbox(
                "cadastroComRestricao", "Solicitar aprovação de cadastro com restrição",
                2, "Marcar caso seja necessário realizar um cadastro com alguma restrição"
            ),
            new CampoTexto(
                "razaoSocial", "Razão social", 4, null, fontes["cnpjDadosGerais"], "razaoSocial",
                true, false,
            ),
            new CampoTexto(
                "nomeFantasia", "Nome fantasia", 4, "As dicas não são obrigatórias.",
                fontes["cnpjDadosGerais"], "nomeFantasia", true, true,
            ),
            new CampoCheckbox("mercadoExterior", "Mercado exterior", 2),
            new CampoCheckbox("fornecedorIndustria", "É indústria", 2),
            new CampoLista("ramoAtividade", "Ramo de atividade", 4)
                .adicionarOpcoes([
                    new OpcaoLista("1", "1 - Banco, financeira ou seguradora"),
                    new OpcaoLista("2", "2 - Agricultura, pecuária ou silvicultura"),
                    new OpcaoLista("3", "3 - Peças e materiais de uso e consumo"),
                    new OpcaoLista("4", "4 - Prestador de serviços pessoa física"),
                    new OpcaoLista("5", "5 - Instituições governamentais"),
                    new OpcaoLista("6", "6 - Prestador de serviços pessoa jurídica"),
                    new OpcaoLista("7", "7 - Combustíveis e Lubrificantes"),
                    new OpcaoLista("8", "8 - Funcionários"),
                    new OpcaoLista("9", "9 - Intercompany"),
                    new OpcaoLista("10", "10 - Energia elétrica"),
                    new OpcaoLista("11", "11 - Cooperativas"),
                    new OpcaoLista("12", "12 - TI - Softwares"),
                    new OpcaoLista("13", "13 - TIC - Links, rádios e comunicação"),
                    new OpcaoLista("14", "14 - TI - Infraestrutura, redes e hardwares"),
                    new OpcaoLista("15", "15 - TI - Segurança (câmeras e serviços)"),
                    new OpcaoLista("16", "16 - TI - Controle de acesso e ponto"),
                    new OpcaoLista("17", "17 - TIC - Telefonia"),
                ]),
            new CampoTexto("inscricaoEstadual", "Inscrição estadual", 2),
            new CampoTexto(
                "cep", "CEP", 2,
                "Pressione TAB ou selecione outro campo para efetuar uma consulta com o CEP informado",
                fontes["cnpjDadosGerais"], "cep", true, false
            ),
            new CampoLista("pais", "País", 2,
               null, fontes["pais"], "pais", true,)
                .adicionarOpcoes([
                    new OpcaoLista("0132", "0132 - Afeganistão"),
                    new OpcaoLista("0175", "0175 - Albânia"),
                    new OpcaoLista("0230", "0230 - Alemanha"),
                    new OpcaoLista("0310", "0310 - Burkina Faso"),
                    new OpcaoLista("0370", "0370 - Andorra"),
                    new OpcaoLista("0400", "0400 - Angola"),
                    new OpcaoLista("0418", "0418 - Anguilla"),
                    new OpcaoLista("0434", "0434 - Antigua e Barbuda"),
                    new OpcaoLista("0477", "0477 - Antilhas Holandesas"),
                    new OpcaoLista("0531", "0531 - Arábia Saudita"),
                    new OpcaoLista("0590", "0590 - Argélia"),
                    new OpcaoLista("0639", "0639 - Argentina"),
                    new OpcaoLista("0647", "0647 - Armênia"),
                    new OpcaoLista("0655", "0655 - Aruba"),
                    new OpcaoLista("0698", "0698 - Austrália"),
                    new OpcaoLista("0728", "0728 - Áustria"),
                    new OpcaoLista("0736", "0736 - Azerbaijão"),
                    new OpcaoLista("0779", "0779 - Bahamas"),
                    new OpcaoLista("0809", "0809 - Bahrein"),
                    new OpcaoLista("0817", "0817 - Bangladesh"),
                    new OpcaoLista("0833", "0833 - Barbados"),
                    new OpcaoLista("0850", "0850 - Belarus"),
                    new OpcaoLista("0876", "0876 - Bélgica"),
                    new OpcaoLista("0884", "0884 - Belize"),
                    new OpcaoLista("0906", "0906 - Bermudas"),
                    new OpcaoLista("0930", "0930 - Mianmar"),
                    new OpcaoLista("0973", "0973 - Bolívia"),
                    new OpcaoLista("0981", "0981 - Bósnia-Herzegovina"),
                    new OpcaoLista("1015", "1015 - Botsuana"),
                    new OpcaoLista("1058", "1058 - Brasil"),
                    new OpcaoLista("1082", "1082 - Brunei"),
                    new OpcaoLista("1112", "1112 - Bulgária"),
                    new OpcaoLista("1155", "1155 - Burundi"),
                    new OpcaoLista("1198", "1198 - Butão"),
                    new OpcaoLista("1279", "1279 - Cabo Verde"),
                    new OpcaoLista("1376", "1376 - Cayman, Ilhas"),
                    new OpcaoLista("1414", "1414 - Camboja"),
                    new OpcaoLista("1457", "1457 - Camarões"),
                    new OpcaoLista("1490", "1490 - Canadá"),
                    new OpcaoLista("1504", "1504 - Canal, Ilhas do"),
                    new OpcaoLista("1511", "1511 - Canárias, Ilhas"),
                    new OpcaoLista("1538", "1538 - Cazaquistão"),
                    new OpcaoLista("1546", "1546 - Catar"),
                    new OpcaoLista("1589", "1589 - Chile"),
                    new OpcaoLista("1600", "1600 - China, Rep.Popular"),
                    new OpcaoLista("1619", "1619 - Formosa (Taiwan)"),
                    new OpcaoLista("1635", "1635 - Chipre"),
                    new OpcaoLista("1651", "1651 - Cocos, Ilhas"),
                    new OpcaoLista("1694", "1694 - Colômbia"),
                    new OpcaoLista("1732", "1732 - Comores, Ilhas"),
                    new OpcaoLista("1775", "1775 - Congo, República do"),
                    new OpcaoLista("1830", "1830 - Cook, Ilhas"),
                    new OpcaoLista("1872", "1872 - Coréia, Rep.Pop.Dem."),
                    new OpcaoLista("1902", "1902 - Coréia, República da"),
                    new OpcaoLista("1937", "1937 - Costa do Marfim"),
                    new OpcaoLista("1953", "1953 - Croácia"),
                    new OpcaoLista("1961", "1961 - Costa Rica"),
                    new OpcaoLista("1988", "1988 - Coveite"),
                    new OpcaoLista("1996", "1996 - Cuba"),
                    new OpcaoLista("2291", "2291 - Benin"),
                    new OpcaoLista("2321", "2321 - Dinamarca"),
                    new OpcaoLista("2356", "2356 - Dominica, Ilha"),
                    new OpcaoLista("2399", "2399 - Equador"),
                    new OpcaoLista("2402", "2402 - Egito"),
                    new OpcaoLista("2437", "2437 - Eritréia"),
                    new OpcaoLista("2445", "2445 - Emirados Árabes Unid"),
                    new OpcaoLista("2453", "2453 - Espanha"),
                    new OpcaoLista("2461", "2461 - Eslovênia"),
                    new OpcaoLista("2470", "2470 - Eslovaquia"),
                    new OpcaoLista("2496", "2496 - Estados Unidos"),
                    new OpcaoLista("2518", "2518 - Estônia"),
                    new OpcaoLista("2534", "2534 - Etiópia"),
                    new OpcaoLista("2550", "2550 - Falkland (Malvinas)"),
                    new OpcaoLista("2593", "2593 - Feroe, Ilhas"),
                    new OpcaoLista("2674", "2674 - Filipinas"),
                    new OpcaoLista("2712", "2712 - Finlândia"),
                    new OpcaoLista("2755", "2755 - França"),
                    new OpcaoLista("2810", "2810 - Gabão"),
                    new OpcaoLista("2852", "2852 - Gâmbia"),
                    new OpcaoLista("2895", "2895 - Gana"),
                    new OpcaoLista("2917", "2917 - Geórgia"),
                    new OpcaoLista("2933", "2933 - Gibraltar"),
                    new OpcaoLista("2976", "2976 - Granada"),
                    new OpcaoLista("3018", "3018 - Grécia"),
                    new OpcaoLista("3050", "3050 - Groenlândia"),
                    new OpcaoLista("3093", "3093 - Guadalupe"),
                    new OpcaoLista("3131", "3131 - Guam"),
                    new OpcaoLista("3174", "3174 - Guatemala"),
                    new OpcaoLista("3255", "3255 - Guiana Francesa"),
                    new OpcaoLista("3298", "3298 - Guiné"),
                    new OpcaoLista("3310", "3310 - Guiné-Equatorial"),
                    new OpcaoLista("3344", "3344 - Guiné-Bissau"),
                    new OpcaoLista("3379", "3379 - Guiana"),
                    new OpcaoLista("3417", "3417 - Haiti"),
                    new OpcaoLista("3450", "3450 - Honduras"),
                    new OpcaoLista("3514", "3514 - Hong Kong"),
                    new OpcaoLista("3557", "3557 - Hungria"),
                    new OpcaoLista("3573", "3573 - Iemen"),
                    new OpcaoLista("3595", "3595 - Man, Ilha de"),
                    new OpcaoLista("3611", "3611 - Índia"),
                    new OpcaoLista("3654", "3654 - Indonésia"),
                    new OpcaoLista("3697", "3697 - Iraque"),
                    new OpcaoLista("3727", "3727 - Irã"),
                    new OpcaoLista("3751", "3751 - Irlanda"),
                    new OpcaoLista("3794", "3794 - Islândia"),
                    new OpcaoLista("3832", "3832 - Israel"),
                    new OpcaoLista("3867", "3867 - Itália"),
                    new OpcaoLista("3883", "3883 - Iugoslávia"),
                    new OpcaoLista("3913", "3913 - Jamaica"),
                    new OpcaoLista("3964", "3964 - Johnston, Ilhas"),
                    new OpcaoLista("3999", "3999 - Japão"),
                    new OpcaoLista("4030", "4030 - Jordânia"),
                    new OpcaoLista("4111", "4111 - Kiribati"),
                    new OpcaoLista("4200", "4200 - Laos"),
                    new OpcaoLista("4235", "4235 - Lebuan"),
                    new OpcaoLista("4260", "4260 - Lesoto"),
                    new OpcaoLista("4278", "4278 - Letônia"),
                    new OpcaoLista("4316", "4316 - Líbano"),
                    new OpcaoLista("4340", "4340 - Libéria"),
                    new OpcaoLista("4383", "4383 - Líbia"),
                    new OpcaoLista("4405", "4405 - Liechtenstein"),
                    new OpcaoLista("4421", "4421 - Lituânia"),
                    new OpcaoLista("4456", "4456 - Luxemburgo"),
                    new OpcaoLista("4472", "4472 - Macau"),
                    new OpcaoLista("4499", "4499 - Macedônia"),
                    new OpcaoLista("4502", "4502 - Madagascar"),
                    new OpcaoLista("4525", "4525 - Madeira, Ilha da"),
                    new OpcaoLista("4553", "4553 - Malásia"),
                    new OpcaoLista("4588", "4588 - Malavi"),
                    new OpcaoLista("4618", "4618 - Maldivas"),
                    new OpcaoLista("4642", "4642 - Mali"),
                    new OpcaoLista("4677", "4677 - Malta"),
                    new OpcaoLista("4723", "4723 - Marianas do Norte"),
                    new OpcaoLista("4740", "4740 - Marrocos"),
                    new OpcaoLista("4766", "4766 - Marshall, Ilhas"),
                    new OpcaoLista("4774", "4774 - Martinica"),
                    new OpcaoLista("4855", "4855 - Maurício"),
                    new OpcaoLista("4880", "4880 - Mauritânia"),
                    new OpcaoLista("4901", "4901 - Midway, Ilhas"),
                    new OpcaoLista("4936", "4936 - México"),
                    new OpcaoLista("4944", "4944 - Moldávia"),
                    new OpcaoLista("4952", "4952 - Mônaco"),
                    new OpcaoLista("4979", "4979 - Mongólia"),
                    new OpcaoLista("4995", "4995 - Micronésia"),
                    new OpcaoLista("5010", "5010 - Montserrat, Ilhas"),
                    new OpcaoLista("5053", "5053 - Moçambique"),
                    new OpcaoLista("5070", "5070 - Namíbia"),
                    new OpcaoLista("5088", "5088 - Nauru"),
                    new OpcaoLista("5118", "5118 - Christmas, Ilha"),
                    new OpcaoLista("5177", "5177 - Nepal"),
                    new OpcaoLista("5215", "5215 - Nicarágua"),
                    new OpcaoLista("5258", "5258 - Niger"),
                    new OpcaoLista("5282", "5282 - Nigéria"),
                    new OpcaoLista("5312", "5312 - Niue, Ilha"),
                    new OpcaoLista("5355", "5355 - Norfolk, Ilha"),
                    new OpcaoLista("5380", "5380 - Noruega"),
                    new OpcaoLista("5428", "5428 - Nova Caledônia"),
                    new OpcaoLista("5452", "5452 - Papua Nova Guiné"),
                    new OpcaoLista("5487", "5487 - Nova Zelândia"),
                    new OpcaoLista("5517", "5517 - Vanuatu"),
                    new OpcaoLista("5568", "5568 - Omã"),
                    new OpcaoLista("5738", "5738 - Holanda(Países Baixo"),
                    new OpcaoLista("5754", "5754 - Palau"),
                    new OpcaoLista("5762", "5762 - Paquistão"),
                    new OpcaoLista("5800", "5800 - Panamá"),
                    new OpcaoLista("5860", "5860 - Paraguai"),
                    new OpcaoLista("5894", "5894 - Perú"),
                    new OpcaoLista("5932", "5932 - Pitcairn, Ilha"),
                    new OpcaoLista("5991", "5991 - Polinésia Francesa"),
                    new OpcaoLista("6033", "6033 - Polônia"),
                    new OpcaoLista("6076", "6076 - Portugal"),
                    new OpcaoLista("6114", "6114 - Porto Rico"),
                    new OpcaoLista("6238", "6238 - Quênia"),
                    new OpcaoLista("6254", "6254 - Quirquiz"),
                    new OpcaoLista("6289", "6289 - Reino Unido"),
                    new OpcaoLista("6408", "6408 - Centro-Africana, Rep"),
                    new OpcaoLista("6475", "6475 - Dominicana, Rep."),
                    new OpcaoLista("6602", "6602 - Reunião, Ilha"),
                    new OpcaoLista("6653", "6653 - Zimbabue"),
                    new OpcaoLista("6700", "6700 - Romênia"),
                    new OpcaoLista("6750", "6750 - Ruanda"),
                    new OpcaoLista("6769", "6769 - Rússia"),
                    new OpcaoLista("6777", "6777 - Salomão, Ilhas"),
                    new OpcaoLista("6858", "6858 - Saara Ocidental"),
                    new OpcaoLista("6874", "6874 - El Salvador"),
                    new OpcaoLista("6904", "6904 - Samoa"),
                    new OpcaoLista("6912", "6912 - Samoa Americana"),
                    new OpcaoLista("6955", "6955 - São Cristóvão e Neve"),
                    new OpcaoLista("6971", "6971 - San Marino"),
                    new OpcaoLista("7005", "7005 - São Pedro e Miquelon"),
                    new OpcaoLista("7056", "7056 - São Vicente e Granad"),
                    new OpcaoLista("7102", "7102 - Santa Helena"),
                    new OpcaoLista("7153", "7153 - Santa Lúcia"),
                    new OpcaoLista("7200", "7200 - São Tomé e Príncipe"),
                    new OpcaoLista("7285", "7285 - Senegal"),
                    new OpcaoLista("7315", "7315 - Seychelles"),
                    new OpcaoLista("7358", "7358 - Serra Leoa"),
                    new OpcaoLista("7412", "7412 - Cingapura"),
                    new OpcaoLista("7447", "7447 - Síria"),
                    new OpcaoLista("7480", "7480 - Somália"),
                    new OpcaoLista("7501", "7501 - Sri Lanka"),
                    new OpcaoLista("7544", "7544 - Suazilândia"),
                    new OpcaoLista("7560", "7560 - África do Sul"),
                    new OpcaoLista("7595", "7595 - Sudão"),
                    new OpcaoLista("7641", "7641 - Suécia"),
                    new OpcaoLista("7676", "7676 - Suíça"),
                    new OpcaoLista("7706", "7706 - Suriname"),
                    new OpcaoLista("7722", "7722 - Tadjiquistão"),
                    new OpcaoLista("7765", "7765 - Tailândia"),
                    new OpcaoLista("7803", "7803 - Tanzânia"),
                    new OpcaoLista("7820", "7820 - Terr.Britânico Oc.In"),
                    new OpcaoLista("7838", "7838 - Djibuti"),
                    new OpcaoLista("7889", "7889 - Chade"),
                    new OpcaoLista("7919", "7919 - Tcheca, Rep."),
                    new OpcaoLista("7951", "7951 - Timor Leste"),
                    new OpcaoLista("8001", "8001 - Togo"),
                    new OpcaoLista("8052", "8052 - Toquelau, Ilhas"),
                    new OpcaoLista("8109", "8109 - Tonga"),
                    new OpcaoLista("8150", "8150 - Trinidad e Tobago"),
                    new OpcaoLista("8206", "8206 - Tunísia"),
                    new OpcaoLista("8230", "8230 - Turcas e Caicos, Ilh"),
                    new OpcaoLista("8249", "8249 - Turcomenistão"),
                    new OpcaoLista("8273", "8273 - Turquia"),
                    new OpcaoLista("8281", "8281 - Tuvalu"),
                    new OpcaoLista("8311", "8311 - Ucrânia"),
                    new OpcaoLista("8338", "8338 - Uganda"),
                    new OpcaoLista("8451", "8451 - Uruguai"),
                    new OpcaoLista("8478", "8478 - Uzbequistão"),
                    new OpcaoLista("8486", "8486 - Vaticano"),
                    new OpcaoLista("8508", "8508 - Venezuela"),
                    new OpcaoLista("8583", "8583 - Vietnã"),
                    new OpcaoLista("8630", "8630 - Virgens Brit., Ilhas"),
                    new OpcaoLista("8664", "8664 - Virgens EUA, Ilhas"),
                    new OpcaoLista("8702", "8702 - Fiji"),
                    new OpcaoLista("8737", "8737 - Wake, Ilha"),
                    new OpcaoLista("8753", "8753 - Wallis e Futuna, Ilh"),
                    new OpcaoLista("8885", "8885 - Congo, Rep. Dem."),
                    new OpcaoLista("8907", "8907 - Zâmbia"),
                    new OpcaoLista("8958", "8958 - Zona Canal Panamá"),
                ]),
            new CampoLista("estado", "Estado", 2,
             null, fontes["cnpjDadosGerais"], "estado")
                .adicionarOpcoes(listaEstados),
            new CampoTexto("cidade", "Cidade", 4, null, fontes["cnpjDadosGerais"], "cidade",
                true, false),
            new CampoTexto("logradouro", "Logradouro", 4, null, fontes["cnpjDadosGerais"],
                "logradouro", true, false),
            new CampoTexto("numero", "Número", 2, null, fontes["cnpjDadosGerais"],
                "numero", true, false),
            new CampoTexto("bairro", "Bairro", 4, null, fontes["cnpjDadosGerais"],
                "bairro", true, false),
            new CampoTexto("complemento", "Complemento", 4, null, fontes["cnpjDadosGerais"],
                "complemento", true, false),
            new CampoTexto("enderecoCorresp", "Endereço de correspondência", 4),
            new CampoTexto("nomeContato", "Nome do contato", 4),
            new CampoTexto("emailContato", "E-mail para contato", 4, null, fontes["cnpjDadosGerais"],
                "emailContato", true, false, null, null, true),
            new CampoTexto("emailAdicional", "E-mail adicional", 4, null, null,
                null, null, null, null, null, true),
            new CampoTexto("telefone", "Telefone", 2, null, fontes["cnpjDadosGerais"],
                "telefone", true, false),
            new CampoTexto("celular", "Celular", 2, null, fontes["cnpjDadosGerais"],
                "celular", true, false),
            new CampoTexto("contatoAdicional", "Telefone ou celular adicional", 2),
            new CampoLista("formaPagamento", "Forma de pagamento", 2)
                .adicionarOpcoes([
                    new OpcaoLista("1", "1 - Boleto"),
                    new OpcaoLista("2", "2 - Carteira"),
                    new OpcaoLista("3", "3 - Transferência bancária"),
                    new OpcaoLista("4", "4 - Débito automático"),
                    new OpcaoLista("5", "5 - Compensação"),
                    new OpcaoLista("6", "6 - Financiamento"),
                    new OpcaoLista("7", "7 - Cartão de crédito"),
                    new OpcaoLista("8", "8 - Cheque"),
                ]),
        ];

        secaoDadosPrincipais = new Secao("dadosPrincipais", "Dados principais", camposDadosPrincipais);
        secaoDadosPrincipais.gerar();

        const camposContaBancaria = [
            new CampoLista("banco", "Banco", 4),
            new CampoTexto("agenciaDigito", "Agência e dígito", 2),
            new CampoTexto("contaDigito", "Conta bancária e dígito",  2),
            new CampoLista("tipoConta", "Tipo de conta", 2)
                .adicionarOpcoes([
                    new OpcaoLista("1", "1 - Conta corrente"),
                    new OpcaoLista("2", "2 - Conta poupança"),
                ]),
            new CampoTexto(
                "documentoConta", "CPF/CNPJ do titular", 2,
                "Pressione TAB ou selecione outro campo para efetuar uma consulta com o documento informado"
            ),
            new CampoCheckbox("titularComRestricao", "Solicitar aprovação de titular com restrição",
                2, "Marcar caso seja necessário realizar um cadastro com alguma restrição"),
            new CampoTexto("titularConta", "Titular da conta", 4),
            new CampoTexto("favNomeFantasia", "Nome fantasia", 4),
            new CampoTexto(
                "favCep", "CEP", 2,
                "Pressione TAB ou selecione outro campo para efetuar uma consulta com o CEP informado"
            ),
            new CampoLista("favEstado", "Estado", 2)
                .adicionarOpcoes(listaEstados),
            new CampoTexto("favCidade", "Cidade", 4),
            new CampoTexto("favLogradouro", "Logradouro", 4),
            new CampoTexto("favBairro", "Bairro", 4),
            new CampoTexto("favNumero", "Número", 2),
            new CampoTexto("favComplemento", "Complemento", 4),
            new CampoTexto("favEmail", "E-mail", 4, null, null, null,
                null, null, null, null, true),
            new CampoTexto("favTelefone", "Telefone ou celular", 2),
        ];

        secaoContaBancaria = new Secao("contaBancaria", "Conta bancária", camposContaBancaria);
        secaoContaBancaria.gerar();

        const camposDetalhesDocumentos = [
            new CampoTexto("observacoes", "Observações", 12, null, null,
                null, null, null, null,
                5),
            new CampoAnexo(
                "documentosPessoaFisica", "Documentos de pessoa física", 4,
                null, true,
            ),
            new CampoAnexo("comprovanteEndereco", "Comprovante de endereço", 4),
            new CampoAnexo("comprovanteContaBancaria", "Comprovante de conta bancária", 4),
        ];

        secaoDetalhesDocumentos = new Secao("detalhesDocumentos", "Detalhes e documentos", camposDetalhesDocumentos);
        secaoDetalhesDocumentos.gerar();

        const camposControle = [
            new CampoTexto(
                "retornoRegra", "Retorno da regra",  12,
                "Retorno da regra de integração do ERP que fará o cadastro no sistema.", null,
                null, null, null, null, 5,
            ),
            new CampoTexto(
                "nomeUsuario", "Usuário solicitante", 2,
            ),
        ];

        secaoControle = new Secao("controle", "Controle", camposControle);
        secaoControle.gerar();

        // TODO: melhorar isso para definir os campos mestre de forma modular
        const camposFonteDocumento = ["razaoSocial", "nomeFantasia", "cep", "estado", "cidade", "logradouro",
            "numero", "bairro", "complemento", "emailContato", "telefone", "contatoAdicional"];

        for (const id of camposFonteDocumento) {
            campos[id].definirCampoMestre(campos["documento"]);
        }
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
        carregarDados,
        salvarDados,
        obterValidacoes,
        definirEstadoInicial,
        configurarEventos,
        gerar
    };
})();