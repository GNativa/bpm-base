class CampoTexto extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte, altura, email) {
        super(id, rotulo, largura, dica, fonte, campoFonte);
        this.tag = altura ? "textarea" : "input";

        if (altura) {
            this.altura = `${altura}lh`;
            this.tipo = null;
        }
        else {
            this.altura = null;

            if (email) {
                this.tipo = "email";
            }
            else {
                this.tipo = "texto";
            }
        }

        this.inicializar();
    }

    configurarDetalhes() {
        if (this.fonte !== null) {
            let divExterna = $(`<div class="input-group"></div>`);
            this.filhoColuna.wrap(divExterna);
            this.classeCarregaveis = `.carregaveis-${this.id}`;
            this.campo.addClass(`carregaveis-${this.id}`);

            const botao = $(`<button id="${Constantes.prefixoIdBotaoPesquisa}${this.id}" type="button" title="Buscar" class="btn botao"></button>`);
            this.configurarBusca(botao);
            const buscar = $(`<i class="bi bi-search fs-4"></i>`);
            botao.append(buscar);
            this.filhoColuna.after(botao);
        }

        if (this.altura !== null) {
            this.campo.css("height", this.altura);
        }
    }

    configurarBusca(botao) {
        const campo = this;

        botao.on("click", async function () {
            campo.iniciarCarregamento();
            await Busca.abrir(campo);
        });
    }
}