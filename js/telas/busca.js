class TelaDeBusca extends Tela {
    constructor(parametros) {
        super("busca", parametros);
        this.dados = [];
        this.preparada = false;
    }

    async abrir() {
        const tela = $(`#${this.id}`);
        const campo = this.parametros.campo;
        const fonte = campo.fonte;

        tela.removeClass("d-none");
        tela.find("div.titulo-tela").text(campo?.fonte?.nome ?? "Pesquisa");

        if (!this.preparada) {
            const busca = this;
            /*
            // Fechar a tela ao clicar no X ou fora dela
            tela.find("#fecharBusca").on("click", function () {
                busca.fechar();
            });

             */



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

            for (let i = 0; i < dados.length; i++) {
                const linha = $(`<tr ${Constantes.telas.atributos.sequenciaLinha}="${i}"></tr>`);
                const telaDeBusca = this;

                linha.on("click", function (event) {
                    const linhaSelecionada = linha.attr(Constantes.telas.atributos.sequenciaLinha);
                    Controlador.atualizarCamposFonte(telaDeBusca.parametros.campo.fonte.id, dados[linhaSelecionada]);
                    telaDeBusca.fechar();
                });

                for (const propriedade of propriedades) {
                    const coluna = $(`<td></td>`);
                    coluna.text(dados[i][propriedade]);
                    linha.append(coluna);
                }

                corpo.append(linha);
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
        this.parametros.campo.finalizarCarregamento();
    }
}