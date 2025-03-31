const Consultor = (() => {
    const obterDados = (url) => {
        return new Promise((resolve, reject) => {
            $.getJSON(url, function(data) {
                resolve(data);
            }).fail(function(jqxhr, textStatus, error) {
                reject(error);
            });
        });
    };

    const carregarFonte = async (fonte, token, filtros, parametrosConsulta, urlApi, metodo) => {
        if (fonte.tipo === Constantes.fontes.tipos.tabela) {
            const url = "https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/ecm_form/actions/getResultSet";
            const corpo = {
                dataSource: `${fonte.nome}`,
                token: `${token}`,
                top: 50000,
                filters: filtros ?? [],
                // filters: [
                    // {
                    //   "logicalOperator": "AND",
                    //   "fieldName": "nomeCampoFonte",
                    //   "operator": "=",
                    //   "openingOrder": "(",
                    //   "closingOrder": ")",
                    //   "value": "'valor'"
                    // }
                // ]
            };
            const parametros = parametrosConsulta ?? {};

            for (const parametro in parametros) {
                corpo[parametro] = parametros[parametro];
            }

            const resposta = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${token}`,
                },
                body: JSON.stringify(corpo),
            });

            const json = await resposta.json();
            return JSON.parse(json["data"].replace("\\", ""))["value"];
        }

        if (fonte.tipo === Constantes.fontes.tipos.api) {
            const url = urlApi;
            const corpo = parametrosConsulta;
            const init = {
                method: metodo,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            };

            if (corpo) {
                init.body = JSON.stringify(corpo);
            }

            const resposta = await fetch(url, init);
            const json = await resposta.json();

            if (typeof json === "object") {
                return [json];
            }
        }

        return [{}];
    }

    return { obterDados, carregarFonte };
})();