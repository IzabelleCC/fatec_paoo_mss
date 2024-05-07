interface ServicesConfig {
    eventos: number;
    lembretes: number;
    observacoes: number;
    consulta: number;
    registro: number;
}

const services: ServicesConfig = {
    eventos: 10000,
    lembretes: 4000,
    observacoes: 5000,
    consulta: 6000,
    registro: 9000
};

export default services;