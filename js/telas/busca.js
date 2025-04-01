class TelaDeBusca extends Tela {
    constructor(parametros) {
        super("busca", parametros);
        this.dados = [];
        this.campoPesquisar = null;
        this.linhaSelecionada = -1;
        this.preparada = false;
        this.pesquisavel = false;
    }

    async abrir() {
        const busca = this;
        const tela = $(`#${this.id}`);
        const campo = this.parametros.campo;
        busca.campoPesquisar = tela.find("#buscaPesquisar");

        busca.campoPesquisar.on("keydown", (event) => {
            if (busca.campoPesquisar.val() === "") {
                busca.pesquisar();
            } else if (busca.pesquisavel && event.key === "Enter") {
                busca.pesquisar();
            }
        });

        busca.pesquisavel = false;

        const fonte = campo.fonte;

        tela.removeClass("d-none");
        tela.find("div.titulo-tela").text(campo?.fonte?.nome ?? "Pesquisa");

        if (!busca.preparada) {
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

        await busca.obterDados(fonte);
        busca.pesquisar();
    }

    async obterDados(fonte) {
        const token = Controlador.accessToken;

        if (token !== null) {
            fonte.definirDados(await Consultor.carregarFonte(fonte, token));
            this.dados = fonte.dados;
        }
        else {
            this.dados = Constantes.fontes.dadosTeste;
            //dados = [];
        }
    }

    pesquisar() {
        this.iniciarPesquisa();
        this.gerarLinhas();
        this.finalizarPesquisa();
    }

    gerarLinhas() {
        const tela = $(`#${this.id}`);
        const dados = this.dados;
        const cabecalho = tela.find("thead > tr").empty();
        const corpo = tela.find("tbody").empty();

        if (dados.length > 0) {
            const primeiroRegistro = dados[0];
            let propriedades = [];

            for (const propriedade in primeiroRegistro) {
                propriedades.push(propriedade);
                cabecalho.append($(`<th scope="col">${propriedade}</th>`));
            }

            let dadosFiltrados = [...this.dados];

            if (dadosFiltrados.length === 1) {
                this.campoPesquisar.prop("disabled", true);
            }
            else {
                this.campoPesquisar.prop("disabled", false);

                if (this.campoPesquisar.val() !== "") {
                    dadosFiltrados = Utilitario.filtrarDados(dadosFiltrados, this.campoPesquisar.val(), primeiroRegistro);
                }
            }

            for (let i = 0; i < dadosFiltrados.length; i++) {
                const linha = $(`<tr ${Constantes.gerais.atributos.sequenciaLinha}="${i}"></tr>`);
                const busca = this;

                for (const propriedade of propriedades) {
                    const coluna = $(`<td></td>`);
                    coluna.text(dadosFiltrados[i][propriedade]);
                    linha.append(coluna);
                }

                corpo.append(linha);

                linha.on("click", () => {
                    busca.linhaSelecionada = linha.attr(Constantes.gerais.atributos.sequenciaLinha);
                    Controlador.atualizarCamposFonte(busca.parametros.campo.fonte.id, dadosFiltrados[busca.linhaSelecionada]);
                    busca.fechar();
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
        this.parametros.campo.finalizarCarregamento(this.linhaSelecionada === -1);
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
}