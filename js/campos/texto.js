class CampoTexto extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte, campoResultante, altura, email) {
        super(id, rotulo, largura, dica, fonte, campoFonte);
        this.tag = altura ? "textarea" : "input";
        this.campoResultante = campoResultante ?? true;

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

        this.mascaraPadrao = "";
        this.opcoesMascara = {clearIfNotMatch: true};

        this.inicializar();
    }

    configurarDetalhes() {
        if (this.fonte !== null) {
            this.classeCarregaveis = `.${Constantes.campos.classes.carregaveis}${this.fonte.id}`;
            this.campo.addClass(`${Constantes.campos.classes.carregaveis}${this.fonte.id}`);
        }

        if (!this.campoResultante && (this.fonte !== null && this.campoFonte !== null)) {
            let divExterna = $(`<div class="input-group"></div>`);
            this.filhoColuna.wrap(divExterna);

            const botao = $(`<button id="${Constantes.campos.prefixoIdBotaoPesquisa}${this.id}" type="button" title="Buscar" class="btn botao"></button>`);
            this.configurarBusca(botao);
            const buscar = $(`<i class="bi bi-search fs-4"></i>`);
            botao.append(buscar);
            this.filhoColuna.after(botao);
        }

        if (this.altura !== null) {
            this.campo.css("height", this.altura);
        }
    }

    // configurarMascara(mascara: string, opcoes: {}): void
    /*
        Configura a máscara do campo e suas opções.
     */
    configurarMascara(mascara, opcoes) {
        this.opcoesMascara = opcoes ?? this.opcoesMascara;
        this.campo.mask(mascara, opcoes ?? this.opcoesMascara);
        return this;
    }

    configurarBusca(botao) {
        const campo = this;

        botao.on("click", async function () {
            campo.iniciarCarregamento();
            const busca = TelaFactory.obterTela("busca", {campo: campo});
            await busca.abrir();
        });
    }
}