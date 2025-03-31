class CampoAnexo extends Campo {
    constructor(id, rotulo, largura, dica, multiplosAnexos, quantidadeAnexos) {
        super(id, rotulo, largura, dica, "input", "file");
        this.multiplosAnexos = multiplosAnexos ?? false;
        // TODO: implementar validação de quantidade de anexos
        this.quantidadeAnexos = quantidadeAnexos ?? 1;
        this.inicializar();
    }

    configurarCampo() {
        this.classes.push("form-control");
        this.label.append(this.rotulo);
        this.label.attr("for", this.id);

        this.coluna.append(this.label);
        this.coluna.append(this.campo);

        this.links = $("<div></div>");
        this.links.addClass("links mt-1");
        this.coluna.append(this.links);

        this.campo.on("change", () => {
            this.obterLinks();
        });

        this.campo.prop("multiple", this.multiplosAnexos);
    }

    obterLinks() {
        const links = this.links;
        const arquivos = this.campo.prop("files");
        links.html("");

        for (const arquivo of arquivos) {
            const link = $("<a></a>");
            link.attr("target", "_blank");
            link.attr("href", URL.createObjectURL(arquivo));
            link.text(arquivo.name);
            links.append(link);
            links.append($("<br>"));
        }
    }
}