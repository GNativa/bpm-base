class ParametrosConsulta {
    constructor(requisicao, corpo, url, obterSufixoUrl) {
        this.requisicao = requisicao ?? {};
        this.corpo = corpo ?? {};
        this.url = url ?? [];
        this.obterSufixoUrl = obterSufixoUrl ?? null;
    }
}