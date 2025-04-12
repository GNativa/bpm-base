class ExcecaoMensagem extends Error {
    constructor(titulo, mensagem, tipoMensagem) {
        super(mensagem);
        this.name = this.constructor.name;
        this.titulo = titulo;
        this.tipoMensagem = tipoMensagem;
    }
}