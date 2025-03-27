class Busca {
    constructor(campo) {
        this.linhaSelecionada = -1;
        this.preparada = false;
        this.campo = campo;
    }

    async abrir() {
        const tela = $("#telaDeBusca");
        const campo = this.campo;
        const fonte = campo.fonte;

        tela.removeClass("d-none");
        tela.find("div.titulo-tela").text(campo?.fonte?.nome ?? "Pesquisa");

        if (!this.preparada) {
            const busca = this;
            // Fechar a tela ao clicar no X ou fora dela
            tela.find("#fecharBusca").add("#telaDeBusca").on("click", function () {
                busca.fechar(campo);
            });

            // Impedir a tela em si de se fechar com um clique
            tela.find("div.fundo").on("click", function (event) {
                event.stopPropagation();
            });

            this.preparada = true;
        }

        const token = Controlador.accessToken;
        let dados = [];

        if (token !== null) {
            await Consultor.carregarFonte(fonte, token);
            dados = fonte.dados;
        }
        else {
            dados = [{"A": 1, "B": 2, "C": 3}, {"A": 1, "B": 2, "C": 3}, {"A": 1, "B": 2, "C": 3}];
            //dados = [];
        }

        const cabecalho = tela.find("thead > tr").empty();
        const corpo = tela.find("tbody").empty();

        if (dados.length > 0) {
            const primeiroRegistro = dados[0];
            let propriedades = [];

            for (const propriedade in primeiroRegistro) {
                propriedades.push(propriedade);
                cabecalho.append($(`<th scope="col">${propriedade}</th>`));
            }

            for (const registro of dados) {
                const linha = $(`<tr></tr>`);

                for (const propriedade of propriedades) {
                    const coluna = $(`<td></td>`);
                    coluna.text(registro[propriedade]);
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
        this.campo.finalizarCarregamento();
    }
}