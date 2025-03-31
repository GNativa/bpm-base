class CampoTexto extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte, campoResultante, limitarValores, altura, email, tratamentoConsulta) {
        super(id, rotulo, largura, dica, null, fonte, campoFonte);
        this.tag = altura ? "textarea" : "input";
        this.campoResultante = campoResultante ?? true;
        this.limitarValores = limitarValores ?? true;
        this.tratamentoConsulta = tratamentoConsulta ?? function() {};
        this.valorAnterior = "";
        this.dropdown = null;

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
        const campo = this.campo;

        if (this.fonte !== null) {
            this.campo.attr(Constantes.campos.atributos.fonte, this.fonte.id);
        }

        if (!this.campoResultante && (this.fonte !== null && this.campoFonte !== null)) {
            // Configurar dropdown de opções filtradas
            this.dropdown = $(`<ul class="list-group"></ul>`);
            this.dropdown.append($(`<li class="list-group-item">Item</li>`));
            this.dropdown.append($(`<li class="list-group-item">Item 2</li>`));
            this.campo.after(this.dropdown);

            // Função para limpar outros campos relacionados quando este tiver seus valores limpos,
            const callback = async (event) => {
                if (event.target.value === "") {
                    const camposFonte = $(`[${Constantes.campos.atributos.fonte}=${this.fonte.id}]`);
                    camposFonte.val("").trigger("input").trigger("change");
                    return;
                }

                if (event.target.value === this.valorAnterior) {
                    return;
                }

                this.iniciarCarregamento();

                try {
                    // this.fonte.definirDados(await Consultor.carregarFonte(this.fonte, Controlador.accessToken, this.fonte.filtros));
                    this.fonte.definirDados(Constantes.fontes.dadosTeste);
                    const dados = this.fonte.dados;

                    if (dados.length === 0) {
                        this.finalizarCarregamento();
                        return;
                    }

                    const dadosFiltrados = Utilitario.filtrarDados(dados, this.val(), dados[0], this.campoFonte);

                    // TODO: exibir dropdown em vez de imediatamente atribuir valores aos campos

                    if (dadosFiltrados.length > 0) {
                        Controlador.atualizarCamposFonte(this.fonte.id, dadosFiltrados[0]);
                    }
                    else if (this.limitarValores) {
                        Controlador.atualizarCamposFonte(this.fonte.id);
                    }

                    this.valorAnterior = event.target.value;

                    this.finalizarCarregamento();
                }
                catch (e) {
                    Mensagem.exibir("Erro ao carregar dados",
                        `Houve um erro ao carregar os dados da fonte "${this.fonte.nome}" (ID "${this.fonte.id}")`
                        + `para o campo "${this.rotulo}" (ID "${this.id}"): ${e}`,
                        "erro");
                    this.falharCarregamento();
                }
            }

            campo.on("blur", callback);

            let divExterna = $(`<div class="input-group"></div>`);
            this.filhoColuna.wrap(divExterna);

            const botao = $(`<button id="${Constantes.campos.prefixoIdBotaoPesquisa}${this.id}" type="button" title="Buscar" class="btn botao"></button>`);
            this.configurarBusca(botao);
            const buscar = $(`<i class="bi bi-search fs-4"></i>`);
            botao.append(buscar);
            this.filhoColuna.after(botao);
        }

        if (this.altura !== null) {
            campo.css("height", this.altura);
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