// Classe abstrata
class CampoEntrada extends Campo {
    constructor(id, rotulo, largura, dica, tipo, fonte, campoFonte) {
        super(id, rotulo, largura, dica, "input", tipo, fonte, campoFonte);
        this.filhoColuna = $(`<div></div>`);
        this.coluna.append(this.filhoColuna);
    }

    configurarCampo() {
        let classeFilha = "form-floating";

        this.label.append(this.rotulo);
        this.label.attr("for", this.id);

        if (this.tipo !== "checkbox") {
            this.classes.push("form-control");
        }
        else {
            this.classes.push("form-check-input");
            classeFilha = "form-check";
            this.label.addClass("mt-1 ms-2");
        }

        this.filhoColuna.addClass(classeFilha);

        if (this.tipo !== "file") {
            this.filhoColuna.append(this.campo);
            this.filhoColuna.append(this.label);
        }
        else {
            this.filhoColuna.append(this.label);
            this.filhoColuna.append(this.campo);
        }

        this.configurarDetalhes();
    }

    configurarDetalhes() {
        // A ser implementado pelas classes filhas
    }
}