class Busca {
    static linhaSelecionada = -1;
    static preparada = false;

    static async abrir(campo) {
        const tela = $("#telaDeBusca");
        const fonte = campo.fonteDeDados;
        tela.removeClass("d-none");

        if (!this.preparada) {
            tela.find("#fecharBusca").on("click", function () {
                Busca.fechar(campo);
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
            dados = [{"A": 1, "B": 2, "C": 3}];
        }

        if (dados.length > 0) {
            const primeiroRegistro = dados[0];
            let propriedades = [];

            const cabecalho = tela.find("thead > tr").empty();
            const corpo = tela.find("tbody").empty();

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
    }

    static fechar(campo) {
        $("#telaDeBusca").addClass("d-none");
        campo.finalizarCarregamento();
    }
}