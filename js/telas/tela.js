class Tela {
    constructor(id, parametros = {titulo: "Título"}) {
        this.id = `${Constantes.telas.atributos.id}${id}`; //
        this.titulo = parametros.titulo;                   //
        this.parametros = parametros;                      // Parâmetros diversos
        this.container = null;                             // Div da tela
        this.aberta = false;                               // Indica se a tela está aberta ou não
    }

    abrir() {
        if (!this.container) {
            this.container = this.criarEstrutura();
            $("body").append(this.container);
        }

        this.container.removeClass("d-none");
        this.aberta = true;
    }

    fechar() {
        if (this.container) {
            this.container.addClass("d-none");
        }

        this.aberta = false;

        // Remover a tela caso não for usada por 1 minuto
        setTimeout(() => {
            if (this.container && this.container.hasClass("d-none")) {
                this.container.remove();
                this.container = null;
            }
        }, 60000);
    }

    criarEstrutura() {
        const div = $(`
            <div id="${this.id}" class="tela d-none">
                <div class="fundo container-fluid">
                    <div class="secao-superior">
                        <div class="row">
                            <div class="col barra">
                                <div id="${Constantes.telas.atributos.idTitulo}${this.id}" class="titulo-tela w-100">
                                    ${this.titulo}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const botaoFechar = $(`
            <button type="button" id="${Constantes.telas.atributos.idFechar}${this.id}" class="btn botao" title="Fechar">
                <i class="bi bi-x-square-fill"></i>
            </button>
        `);

        // Fechar a tela ao clicar no X ou fora dela
        botaoFechar.add(div).on("click", () => {
            this.fechar();
        });

        div.find(".barra").append(botaoFechar);

        // Impedir a tela em si de se fechar com um clique
        div.find(".fundo").on("click", (event) => {
            event.stopPropagation();
        });

        return div;
    }
}
