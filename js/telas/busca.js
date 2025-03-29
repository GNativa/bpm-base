class TelaDeBusca extends Tela {
    constructor(parametros) {
        super("busca", parametros);
        this.dados = [];
        this.pesquisar = null;
        this.linhaSelecionada = -1;
        this.preparada = false;
        this.pesquisavel = false;
    }

    async abrir() {
        const busca = this;
        const tela = $(`#${this.id}`);
        const campo = this.parametros.campo;
        this.pesquisar = tela.find("#buscaPesquisar");
        this.pesquisar.on("change", () => {
            console.log("AAAAAA");
            if (this.pesquisavel) {
                busca.gerarLinhas();
            }
        });
        this.pesquisavel = false;

        const fonte = campo.fonte;

        tela.removeClass("d-none");
        tela.find("div.titulo-tela").text(campo?.fonte?.nome ?? "Pesquisa");

        if (!this.preparada) {
            // Fechar a tela ao clicar no X ou fora dela
            tela.find("#fecharBusca").add("#telaDeBusca").on("click", function () {
                busca.fechar();
            });
            // Impedir a tela em si de se fechar com um clique
            tela.find("div.fundo").on("click", function (event) {
                event.stopPropagation();
            });

            this.preparada = true;
        }

        await this.obterDados(fonte);
        this.gerarLinhas();
    }

    async obterDados(fonte) {
        const token = Controlador.accessToken;

        if (token !== null) {
            await Consultor.carregarFonte(fonte, token);
            this.dados = fonte.dados;
        }
        else {
            this.dados = [{"A": 1, "B": 2, "C": 3}, {"A": 4, "B": 5, "C": 6}, {"A": 7, "B": 8, "C": 9}];
            //dados = [];
        }
    }

    gerarLinhas() {
        this.pesquisavel = false;

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
                this.pesquisar.prop("disabled", true);
            }
            else {
                this.pesquisar.prop("disabled", false);

                if (this.pesquisar.val() !== "") {
                    dadosFiltrados = this.filtrarDados(propriedades);
                }
            }

            for (let i = 0; i < dadosFiltrados.length; i++) {
                const linha = $(`<tr ${Constantes.telas.atributos.sequenciaLinha}="${i}"></tr>`);
                const busca = this;

                for (const propriedade of propriedades) {
                    const coluna = $(`<td></td>`);
                    coluna.text(dadosFiltrados[i][propriedade]);
                    linha.append(coluna);
                }

                corpo.append(linha);

                linha.on("click", (event) => {
                    busca.linhaSelecionada = linha.attr(Constantes.telas.atributos.sequenciaLinha);
                    Controlador.atualizarCamposFonte(busca.parametros.campo.fonte.id, dadosFiltrados[busca.linhaSelecionada]);
                    busca.fechar();
                });
            }
        }
        else {
            cabecalho.append(`<th scope="col" style="text-align: center">Vazio</th>`);
            corpo.append(`<tr><td style="text-align: center">Nenhum registro encontrado.</td></tr>`);
        }

        this.pesquisavel = true;
    }

    filtrarDados(propriedades) {
        return this.dados.filter((registro) => {
            for (const propriedade of propriedades) {
                const valorCelula = registro[propriedade].toString().toUpperCase();
                const valorBusca = this.pesquisar.val().toString();
                if (valorCelula.includes(valorBusca)) {
                    return true;
                }
            }

            return false;
        });
    }

    fecharTela() {
        $("#telaDeBusca").addClass("d-none");
    }

    fechar() {
        this.fecharTela();
        this.parametros.campo.finalizarCarregamento(this.linhaSelecionada === -1);
        this.linhaSelecionada = -1;
    }
}