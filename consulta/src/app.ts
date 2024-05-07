import express from 'express';
import axios from 'axios';
import { format } from 'date-fns';
import ports from '../../configPortas';

const app = express()
app.use(express.json())

interface Observacao{
    id: string;
    texto: string;
    lembreteId: string
}

interface Lembrete {
    id: string;
    texto: string;
    observacoes?: Observacao[]
}

const baseConsolidada: Record<string, Lembrete> = {}

function registro (msg: string){

    const data = new Date()
    const dataFormat = format(data, 'dd/MM/yyyy HH:mm:ss.SSS')
    const registro: string = ` ${dataFormat} - (mss-consulta) ${msg}`

    axios.post(`http://localhost:${ports.eventos}/eventos`,{
        tipo: 'RegistroCriado',
        dados: registro
    })
}

app.get('/lembretes', (req,res) => {
    registro('GET /lembretes')
    res.status(200).json(baseConsolidada)
})

app.post('/eventos', (req, res) => {
    const tipoDeEvento: string = req.body.tipo;
    switch(tipoDeEvento){
        case 'LembreteCriado':
            const lembrete: Lembrete = req.body.dados;
            baseConsolidada[lembrete.id] = lembrete
            break
        case 'ObservacaoCriada':
            const observacao: Observacao = req.body.dados;
            const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
            observacoes.push(observacao)
            baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
            break
        default:
            break
    }

    res.status(200).json(baseConsolidada)
})

const port = ports.consulta
app.listen(port, () => {
    console.log(`Consulta. ${port}`)
})