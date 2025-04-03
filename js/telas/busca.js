class TelaDeBusca extends Tela {
    constructor(parametros) {
        super("busca", parametros);
        this.fonte = parametros.campo.fonte; // Fonte de dados correspondente à tela
        this.campoPesquisar = null;          // Campo de pesquisa
        this.linhaSelecionada = -1;          // Índice da linha selecionada na tabela
        this.preparada = false;              // Indica se a tela já foi preparada ou não
        this.pesquisavel = false;            //
        this.dadosFiltrados = [];            // Dados filtrados da fonte de dados
    }

    async abrir() {
        const busca = this;
        const tela = $(`#${this.id}`);
        const campo = this.parametros.campo;

        busca.pesquisavel = false;

        tela.removeClass("d-none");
        tela.find("div.titulo-tela").text(campo?.fonte?.nome ?? "Pesquisa");

        if (!busca.preparada) {
            busca.campoPesquisar = tela.find("#buscaPesquisar");
            busca.campoPesquisar.on("keydown", (event) => {
                if (busca.campoPesquisar.val() === "") {
                    busca.pesquisar();
                } else if (busca.pesquisavel && event.key === "Enter") {
                    busca.pesquisar();
                }
            });

            // Fechar a tela ao clicar no X ou fora dela
            tela.find("#fecharBusca").add("#telaDeBusca").on("click", function () {
                busca.fechar();
            });
            // Impedir a tela em si de se fechar com um clique
            tela.find("div.fundo").on("click", function (event) {
                event.stopPropagation();
            });

            busca.preparada = true;
        }

        await this.pesquisar(true);
    }

    async obterDados(fonte) {
        const token = Controlador.obterToken();

        if (token !== null) {
            try {
                fonte.definirDados(await Consultor.carregarFonte(fonte, token, fonte.filtros));
            }
            catch (e) {
                Mensagem.exibir("Erro ao carregar dados",
                    `Houve um erro ao carregar os dados da fonte "${this.fonte.nome}" (ID "${this.fonte.id}")`
                    + `para a tela de busca: ${e}`,
                    "erro");
                this.falharPesquisa();
            }
        }
        else {
            Mensagem.exibir("Erro ao carregar dados",
                `Houve um erro desconhecido ao carregar os dados. Feche e abra a tela para tentar`
                + `realizar a pesquisa novamente.`,
                "erro");
            this.falharPesquisa();
            this.fonte.definirDados([]);
        }
    }

    async pesquisar(carregarDados) {
        this.iniciarPesquisa();

        if (carregarDados) {
            await this.obterDados(this.parametros.campo.fonte);
        }

        this.gerarLinhas();
        this.finalizarPesquisa();
    }

    gerarLinhas() {
        const tela = $(`#${this.id}`);
        const dados = this.fonte.dados;
        const descricoes = this.fonte.descricoes;
        const cabecalho = tela.find("thead tr").empty();
        const corpo = tela.find("tbody").empty();

        if (dados.length > 0) {
            for (const chave in descricoes) {
                cabecalho.append($(`<th scope="col">${descricoes[chave]}</th>`));
            }

            this.dadosFiltrados = [...dados];

            if (dados.length === 1) {
                this.campoPesquisar.prop("disabled", true);
            }
            else {
                this.campoPesquisar.prop("disabled", false);

                if (this.campoPesquisar.val() !== "") {
                    this.dadosFiltrados = Utilitario.filtrarDados(this.dadosFiltrados, this.campoPesquisar.val(), descricoes);
                }
            }

            for (let i = 0; i < this.dadosFiltrados.length; i++) {
                const linha = $(`<tr></tr>`);
                linha.attr(Constantes.gerais.atributos.sequencia, i);

                for (const propriedade in descricoes) {
                    const coluna = $(`<td></td>`);
                    coluna.text(this.dadosFiltrados[i][propriedade]);
                    linha.append(coluna);
                }

                corpo.append(linha);

                linha.on("click", () => {
                    this.linhaSelecionada = Number(linha.attr(Constantes.gerais.atributos.sequencia));
                    Controlador.atualizarCamposFonte(this.parametros.campo.fonte.id, this.dadosFiltrados[this.linhaSelecionada]);
                    this.fechar();
                });
            }
        }
        else {
            cabecalho.append(`<th scope="col" style="text-align: center">Vazio</th>`);
            corpo.append(`<tr><td style="text-align: center">Nenhum registro encontrado.</td></tr>`);
        }
    }

    fecharTela() {
        $("#telaDeBusca").addClass("d-none");
    }

    fechar() {
        this.fecharTela();
        this.campoPesquisar.val("");

        let selecionouLinha = true, valor;

        if (this.linhaSelecionada === -1) {
            selecionouLinha = false;
            valor = null;
        }
        else {
            valor = this.dadosFiltrados[this.linhaSelecionada][this.parametros.campo.campoFonte];
        }

        this.parametros.campo.notificarFimDePesquisa(selecionouLinha, valor);
        this.linhaSelecionada = -1;
    }

    iniciarPesquisa() {
        this.pesquisavel = false;
        this.campoPesquisar.removeClass("carregado");
        this.campoPesquisar.addClass("carregando");
    }

    finalizarPesquisa() {
        this.pesquisavel = true;
        this.campoPesquisar.removeClass("carregando");
        this.campoPesquisar.addClass("carregado");
    }

    falharPesquisa() {
        this.campoPesquisar.removeClass("carregando");
        this.campoPesquisar.addClass("carregado-falha");

        setTimeout(() => {
            this.campoPesquisar.removeClass("carregado-falha");
        }, 1000);
    }
}