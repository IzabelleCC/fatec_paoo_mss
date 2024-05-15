interface ServicesConfig {
    barramentoEventos: number;
    lembretes: number;
    observacoes: number;
    consulta: number;
    registro: number;
    classificacao: number;
}

const ports: ServicesConfig = {
    barramentoEventos: 10000,
    lembretes: 4000,
    observacoes: 5000,
    consulta: 6000,
    registro: 9000,
    classificacao: 7000
};

export default ports;