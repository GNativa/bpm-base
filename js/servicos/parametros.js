class ParametrosConsulta {
    constructor(requisicao, corpo, url, obterUrlDinamica) {
        this.requisicao = requisicao ?? {};
        this.corpo = corpo ?? {};
        this.url = url ?? [];
        this.obterUrlDinamica = obterUrlDinamica ?? null;
    }
}