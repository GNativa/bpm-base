class ListaObjetos extends Secao {
    #colecao;
    #validador;
    #factories = [];
    #filtros = [];
    #colunaBotoes = $(`<div class="col-4 d-flex justify-content-end"></div>`);
    #camposLista = new Map();
    #linhas = new Map();
    #permiteAdicionarLinhas;
    #permiteRemoverLinhas;

    constructor(id, titulo, colecao, validador, factories, filtros,
                permiteAdicionarLinhas = true, permiteRemoverLinhas = true) {
        super(id, titulo, null);
        this.#colecao = colecao;
        this.#validador = validador;
        this.#factories = factories ?? [];
        this.#filtros = filtros ?? [];
        this.#permiteAdicionarLinhas = permiteAdicionarLinhas;
        this.#permiteRemoverLinhas = permiteRemoverLinhas;
    }

    gerar() {
        super.gerar();
        this.#configurarFiltros();
    }

    #configurarFiltros() {
        const factories = this.#factories.filter((factory) => {
            return this.#filtros.indexOf(factory.idCampo) !== -1;
        });

        if (factories.length === 0) {
            return;
        }

        const hr = $(`<hr class="border-0">`);
        const linhaFiltros = $(`<div class="row"></div>`);

        const primeiraLinha = this.#linhas.get(0);
        primeiraLinha.before(hr);
        hr.before(linhaFiltros);

        const botaoFiltrar = $(`
            <button type="button" title="Filtrar" id="botaoFiltrar${this.id}" class="btn botao ms-3">
                <i class="bi bi-plus fs-5 me-2">bi-funnel-fill</i>Filtrar
            </button>
        `);

        this.#colunaBotoes.append(botaoFiltrar);

        // TODO: implementar filtro
        botaoFiltrar.on("click", () => {

        });

        for (const factory of factories) {
            const idCampoFiltro = `${factory.idCampo}${Constantes.campos.atributos.filtroListaObjetos}`;
            const campo = factory.construir(idCampoFiltro);
            linhaFiltros.append(campo.coluna);
        }
    }

    get tamanho() {
        return this.#camposLista.size;
    }

    obterLinha(indice) {
        return this.#camposLista.get(indice);
    }

    criarLinha() {
        const indice = this.obterIndiceUltimaLinha() + 1;

        const linhaItem = $(`
            <div ${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}"
                 class="row g-3 pb-3 linha-secao">
            </div>
        `);

        const botaoRemover = $(`
            <button type="button" title="Remover linha" id="removerLinhaSecao${this.id}${indice}" class="btn botao ms-3">
                <i class="bi bi-x fs-5"></i>
            </button>
        `);

        botaoRemover.on("click", () => {
            this.removerLinha(indice);
        });

        const hr = $("<hr>");

        if (indice === 0 || Utilitario.obterEtapa() === null) {
            botaoRemover.prop("disabled", true);
            hr.addClass("border-0");
        }
        else {
            hr.addClass("border-0");
            //linhaItem.addClass("mt-1");
        }

        if (this.#permiteRemoverLinhas) {
            const colunaBotaoRemover = $(`<div class="col-12 d-flex justify-content-end"></div>`);
            colunaBotaoRemover.append(botaoRemover);
            linhaItem.append(colunaBotaoRemover);
        }

        this.divSecao.append(linhaItem);

        const camposDaLinha = [];

        for (const factory of this.#factories) {
            const novoId = `${factory.idCampo}${indice}`;

            if (camposDaLinha.find((campo) => campo.id === novoId)
                || document.getElementById(novoId) !== null) {
                this.lancarErroDeCampoDuplicado(factory.idCampo);
            }

            const campo = factory.construir(novoId);
            campo.atribuirListaObjetos(this);
            campo.atribuirIdAgrupado(factory.idCampo);
            campo.atribuirLinhaLista(indice);

            linhaItem.append(campo.coluna);
            camposDaLinha.push(campo);
        }

        this.divSecao.append(linhaItem);
        linhaItem.before(hr);
        this.#linhas.set(indice, linhaItem);
        this.#camposLista.set(indice, camposDaLinha);
    }

    salvarCampos() {
        const campos = this.#camposLista.get(this.obterIndiceUltimaLinha());
        this.#colecao.salvarCampos(campos);

        if (this.obterIndiceUltimaLinha() > 0) {
            this.#validador.configurarValidacoesFixas(Utilitario.obterEtapa(), this.#colecao, this.obterIndiceUltimaLinha());
            this.#validador.configurarValidacoes(true);
        }
    }

    removerLinha(indice = 0) {
        $(`
            [${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}"],
            hr:has(+ [${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}"])
        `).remove();

        const lista = this.#camposLista.get(indice);
        this.#colecao.removerCampos(lista);
        this.#validador.removerCamposValidados(lista);
        this.#camposLista.delete(indice);

        this.#validador.configurarValidacoes(false);
    }

    obterIndiceUltimaLinha() {
        const chaves = this.#camposLista.keys().toArray();
        const indice = Math.max(...chaves);
        return indice === -Infinity ? -1 : indice;
    }

    configurarTitulo(elementoSecao = $("")) {
        // const colunaSuperior = $(`<div class="col-12"></div>`);
        const linhaTitulo = $(`<div class="row mt-3"></div>`);
        const colunaTitulo = $(`<div class="col"></div>`);
        const tituloSecao = $(`<div class="titulo-m"></div>`);
        tituloSecao.text(this.titulo);

        // colunaSuperior.append(linhaTitulo);
        linhaTitulo.append(colunaTitulo);

        if (this.#permiteAdicionarLinhas) {
            const botaoNovaLinha = $(`
                <button type="button" title="Nova linha" id="novaLinha${this.id}" class="btn botao ms-3">
                    <i class="bi bi-plus fs-5 me-2"></i>Nova linha
                </button>
            `);

            if (Utilitario.obterEtapa() !== null) {
                botaoNovaLinha.on("click", () => {
                    this.adicionarLinha();
                });
            } else {
                botaoNovaLinha.prop("disabled", true);
            }

            this.#colunaBotoes.append(botaoNovaLinha);
        }

        linhaTitulo.append(this.#colunaBotoes);
        colunaTitulo.append(tituloSecao);
        // elementoSecao.append(colunaSuperior);
        elementoSecao.append(linhaTitulo);
        // elementoSecao.append(hr);
    }
}