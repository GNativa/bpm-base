// Campo({id: string, rotulo: string, largura: integer, dica: string, fonte: Fonte, campoFonte: string})
/*
    - Representação abstrata de um campo no formulário.
 */
class Campo {
    constructor(id, rotulo, largura, dica, tag, tipo, fonte, campoFonte) {
        this.id = id;
        this.rotulo = rotulo;
        this.largura = largura;
        this.dica = dica ?? null;
        this.fonte = fonte ?? null;
        this.campoFonte = campoFonte ?? null;
        this.campoMestre = null;

        this.tag = tag;
        this.tipo = tipo;
        this.classes = ["campo"];

        this.obrigatorio = false;
        this.visivel = true;
        this.editavel = true;
        this.valido = true;

        this.obrigatoriedadeSobrescrita = false;
        this.visibilidadeSobrescrita = false;
        this.editabilidadeSobrescrita = false;

        this.consistenciaAtiva = null;
        this.feedback = null;
        this.classeCarregaveis = null;

        this.coluna = $("<div></div>");
        this.campo = null;
        this.label = null;
    }

    inicializar() {
        this.configurarElementos();
        this.definirVisibilidade(true);
        this.definirEdicao(true);
    }

    // configurarElementos(): void
    /*
        Configura os parâmetros e comportamentos do HTML envolvendo o campo e o adiciona à página.
     */
    configurarElementos() {
        const id = this.id;

        const rotulo = this.rotulo;
        const largura = this.largura;
        const dica = this.dica;
        const coluna = this.coluna;
        const fonte = this.fonte;

        const classeColuna = largura >= 1 && largura <= 12 ? `col-${largura}` : "col";
        coluna.addClass(classeColuna);

        const tag = this.tag;
        const tipo = this.tipo;

        this.campo = $(`<${tag}></${tag}>`);
        this.label = $("<label></label>");

        this.campo.attr("id", id);
        this.campo.attr("name", id);
        this.campo.attr("placeholder", rotulo);
        this.campo.attr("title", rotulo);

        if (dica !== null) {
            const icone = $("<i></i>");
            icone.addClass("bi bi-info-circle-fill me-2 pe-auto informativo");
            icone.attr("data-bs-toggle", "tooltip");
            icone.attr("data-bs-placement", "top");
            icone.attr("data-bs-title", dica);
            this.label.append(icone);
        }

        if (tipo !== null) {
            this.campo.attr("type", `${tipo}`);
        }

        if (fonte !== null) {
            this.campo.attr(Constantes.campos.atributos.fonte, `${fonte.nome}`);
            this.campo.attr(Constantes.campos.atributos.campoFonte, `${this.campoFonte}`);
        }

        this.configurarCampo();

        this.feedback = $("<div></div>");
        this.feedback.addClass("feedback");
        this.coluna.append(this.feedback);
        this.feedback.hide();

        for (const classe of this.classes) {
            this.campo.addClass(classe);
        }

        this.campo.on("change", function() {
            const elemento = $(this);

            if (elemento.val() === "") {
                elemento.attr("title", `${rotulo}`);
                return;
            }

            if (elemento.attr("type") === "checkbox") {
                elemento.attr("title", `${rotulo}: ${elemento.prop("checked") ? "Sim" : "Não"}`);
            }
            else {
                elemento.attr("title", `${rotulo}: ${elemento.val()}`);
            }
        });
    }

    configurarCampo() {
        // A ser implementado pelas classes filhas
    }

    // adicionarEvento(evento: string, funcao: function(): void): void
    /*
        Configura a máscara e opções de máscara do campo.
     */
    adicionarEvento(evento, funcao) {
        this.campo.on(evento, funcao);
        return this;
    }

    removerEvento(evento) {
        this.campo.off(evento);
        return this;
    }

    definirCampoMestre(campo) {
        this.campoMestre = campo;
        this.classeCarregaveis = campo.classeCarregaveis;
        this.campo.addClass(campo.classeCarregaveis);
    }

    definirConsistenciaAtiva(validacao) {
        this.consistenciaAtiva = validacao;
    }

    definirFeedback(mensagem) {
        this.feedback.text(mensagem);
        return this;
    }

    mostrarFeedback(mostrar) {
        const feedback = this.feedback;

        if (mostrar) {
            feedback.show();
        }
        else {
            feedback.hide();
        }

        return this;
    }

    sobrescreverObrigatoriedade(sobrescrever) {
        this.obrigatoriedadeSobrescrita = sobrescrever;
    }

    sobrescreverEditabilidade(sobrescrever) {
        this.editabilidadeSobrescrita = sobrescrever;
    }

    sobrescreverVisibilidade(sobrescrever) {
        this.visibilidadeSobrescrita = sobrescrever;
    }

    definirObrigatoriedade(obrigatorio) {
        if (this.obrigatoriedadeSobrescrita) {
            return this;
        }

        const campo = this.campo;
        this.obrigatorio = obrigatorio;
        campo.prop("aria-required", obrigatorio);
        campo.prop("required", obrigatorio);

        if (obrigatorio) {
            campo.on("blur.obrigatorio", configurar);
        }
        else {
            campo.off("blur.obrigatorio");
            campo.removeClass("nao-preenchido");
        }

        function configurar() {
            if (campo.val() === "" || (campo.prop("type") === "checkbox" && !campo.prop("checked"))) {
                campo.addClass("nao-preenchido");
            }
            else {
                campo.removeClass("nao-preenchido");
            }
        }

        return this;
    }

    definirVisibilidade(visivel) {
        if (this.visibilidadeSobrescrita) {
            return this;
        }

        this.visivel = visivel;

        if (this.visivel) {
            $(this.coluna).show();
        }
        else {
            $(this.coluna).hide();
        }

        return this;
    }

    definirEdicao(editavel) {
        if (this.editabilidadeSobrescrita) {
            return this;
        }

        this.editavel = editavel;
        this.campo.prop("disabled", !this.editavel);

        if (this.fonte !== null) {
            $(`#${Constantes.campos.prefixoIdBotaoPesquisa}${this.id}`).prop("disabled", !this.editavel);
        }

        return this;
    }

    definirValidez(valido) {
        this.valido = valido;
        const campo = this.campo;

        campo.prop("aria-invalid", !valido);

        if (valido) {
            campo.removeClass("invalido");
        }
        else {
            campo.addClass("invalido");
        }
    }

    configurarConsulta(carregaveis, classe, consulta) {
        this.classeCarregaveis = "." + classe;
        this.campo.addClass(classe);

        for (const carregavel of carregaveis) {
            carregavel.campo.addClass(classe);
        }

        this.adicionarEvento("blur.consulta", consulta);
    }

    iniciarCarregamento() {
        const carregaveis = $(this.classeCarregaveis);
        carregaveis.removeClass("carregado");
        this.campo.removeClass("carregado-falha");
        carregaveis.css("animation-delay", "0s");
        this.campo.addClass("carregando");
    }

    finalizarCarregamento(interromperAnimacao) {
        const carregaveis = $(this.classeCarregaveis);
        const carregaveisVisiveis = carregaveis.filter(function () {
            return this.style.display !== "none"
        });

        for (let i = 0; i < carregaveisVisiveis.length; i++) {
            const tempo = ((i + 1) * 0.15);
            carregaveisVisiveis[i].style.animationDelay = `${tempo}s`;

            /*
            setTimeout(function () {
                carregaveisVisiveis[i].classList.remove("carregado");
            }, tempo * 10000);
             */
        }

        this.campo.removeClass("carregando");
        this.campo.addClass("carregado");

        if (!interromperAnimacao) {
            carregaveisVisiveis.addClass("carregado");
        }
    }

    falharCarregamento() {
        this.campo.removeClass("carregando");
        this.campo.addClass("carregado-falha");
    }

    obterElementoHtml() {
        return this.campo[0];
    }

    val(valor) {
        if (valor === undefined) {
            return this.campo.val();
        }

        return this.campo.val(valor).trigger("input").trigger("change");
    }

    cleanVal() {
        return this.campo.cleanVal();
    }

    on(evento, funcao) {
        this.campo.on(evento, funcao);
        return this;
    }
}