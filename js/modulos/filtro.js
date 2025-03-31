class Filtro {
    constructor(operadorLogico, nomeCampo, operador, ordemAbertura, ordemFechamento, valor) {
        this.logicalOperator = operadorLogico; // AND, OR
        this.fieldName = nomeCampo;            //
        this.operator = operador;              // =, <>, >, <, >=, <=, is, is not
        this.openingOrder = ordemAbertura;     // (, vazio
        this.closingOrder = ordemFechamento;   // ), vazio
        this.value = valor;                    // valor entre aspas simples
    }
}