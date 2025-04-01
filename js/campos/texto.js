class CampoTexto extends CampoEntrada {
    constructor(id, rotulo, largura, dica, fonte, campoFonte, campoResultante, limitarValores, filtrarValorLimpo, altura, email, tratarConsulta) {
        super(id, rotulo, largura, dica, null, fonte, campoFonte);
        this.tag = altura ? "textarea" : "input";
        this.campoResultante = campoResultante ?? true;
        this.limitarValores = limitarValores ?? true;
        this.filtrarValorLimpo = filtrarValorLimpo ?? false;
        this.tratarConsulta = tratarConsulta ?? function() {};
        this.valorAnterior = "";
        this.menuDropdown = null;
        this.pesquisarNovamente = true; // Controle de pesquisas para não realizar pesquisas redundantes ao filtrar algo

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

    configurarDetalhes() {
        const campo = this.campo;

        if (this.fonte !== null) {
            // Guardar referência à fonte de dados do campo em HTML
            this.campo.attr(Constantes.campos.atributos.fonte, this.fonte.id);
        }

        // Configurar pesquisa na fonte caso o campo seja um "campo mestre"
        if (!this.campoResultante && (this.fonte !== null && this.campoFonte !== null)) {
            this.configurarPesquisa();
        }

        if (this.altura !== null) {
            campo.css("height", this.altura);
        }
    }

    configurarPesquisa() {
        // Criar dropdown e adicionar classe ao div superior para comportá-lo
        this.campo.addClass("dropdown-toggle");
        this.menuDropdown = $(`<ul class="dropdown-menu w-100"></ul>`);
        this.filhoColuna.addClass("dropdown");
        this.filhoColuna.append(this.menuDropdown);

        // Função para preencher os campos relacionados
        // e limpá-los quando esse campo for apagado
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
                if (this.pesquisarNovamente) {
                    // this.fonte.definirDados(await Consultor.carregarFonte(this.fonte, Controlador.accessToken, this.fonte.filtros));
                    this.fonte.definirDados(Constantes.fontes.dadosTeste);
                    this.pesquisarNovamente = false;
                }

                const dados = this.fonte.dados;

                if (dados.length === 0) {
                    this.falharCarregamento();
                    this.pesquisarNovamente = true;
                    return;
                }

                let valor;

                if (this.filtrarValorLimpo) {
                    valor = this.cleanVal();
                }
                else {
                    valor = this.val();
                }

                // Filtrar dados com base no que foi digitado no campo
                const dadosFiltrados = Utilitario.filtrarDados(dados, valor, dados[0], this.campoFonte);

                if (dadosFiltrados.length === 1) {
                    Controlador.atualizarCamposFonte(this.fonte.id, dadosFiltrados[0]);
                    this.finalizarCarregamento();
                    this.pesquisarNovamente = true;
                    this.tratarConsulta(dadosFiltrados);
                }
                else if (dadosFiltrados.length > 0) {
                    this.configurarDropdown(dadosFiltrados);
                    this.tratarConsulta(dadosFiltrados);
                }
                else {
                    if (this.limitarValores) {
                        Controlador.atualizarCamposFonte(this.fonte.id);
                    }

                    this.falharCarregamento();
                    this.pesquisarNovamente = false;
                }

                this.valorAnterior = event.target.value;
            }
            catch (e) {
                Mensagem.exibir("Erro ao carregar dados",
                    `Houve um erro ao carregar os dados da fonte "${this.fonte.nome}" (ID "${this.fonte.id}")`
                    + `para o campo "${this.rotulo}" (ID "${this.id}"): ${e}`,
                    "erro");
                this.falharCarregamento();
            }
        }

        this.campo.on("blur", callback);

        let divExterna = $(`<div class="input-group"></div>`);
        this.filhoColuna.wrap(divExterna);

        const botao = $(`<button id="${Constantes.campos.prefixoIdBotaoPesquisa}${this.id}" type="button" title="Buscar" class="btn botao"></button>`);
        this.configurarBusca(botao);
        const buscar = $(`<i class="bi bi-search fs-4"></i>`);
        botao.append(buscar);
        this.filhoColuna.after(botao);
    }

    configurarDropdown(dadosFiltrados) {
        let quantidadeLinhas;

        if (dadosFiltrados.length < Constantes.fontes.linhasPreSelecao) {
            quantidadeLinhas = dadosFiltrados.length;
        }
        else {
            quantidadeLinhas = Constantes.fontes.linhasPreSelecao;
        }

        this.menuDropdown.empty();

        for (let i = 0; i < quantidadeLinhas; i++) {
            const itemDropdown = $(`<li class="dropdown-item"><a href="#" class="dropdown-item"></a></li>`);
            itemDropdown.attr(Constantes.gerais.atributos.sequenciaLinha, i);
            itemDropdown.text(dadosFiltrados[i][this.campoFonte]);
            itemDropdown.on("click", () => {
                Controlador.atualizarCamposFonte(
                    this.fonte.id,
                    dadosFiltrados[itemDropdown.attr(Constantes.gerais.atributos.sequenciaLinha,)]
                );
                this.finalizarCarregamento();
                this.pesquisarNovamente = true;
                bootstrap.Dropdown.getOrCreateInstance(this.campo).toggle();

                /*
                setTimeout(() => {
                    this.campo.attr("data-bs-toggle", null);
                }, 1000);

                 */
            });

            this.menuDropdown.append(itemDropdown);
        }

        bootstrap.Dropdown.getOrCreateInstance(this.campo).toggle();
    }
}