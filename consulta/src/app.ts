import express from 'express';
import axios from 'axios';
import { format } from 'date-fns';
import ports from '../../configPortas';

const app = express()
app.use(express.json())

interface iRegistro{
    data: string;
    mss: string;
    endpoint: string;
}
function registroFunction (msg: string){

    const data = new Date()
    const dataFormat = format(data, 'dd/MM/yyyy HH:mm:ss.SSS')
    const registro: iRegistro = {data: dataFormat, mss: 'Consulta', endpoint: msg}

    axios.post(`http://localhost:${ports.barramentoEventos}/eventos`,{
        tipo: 'RegistroCriado',
        dados: registro
    })
}

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


const funcoes: Record<string, Function> = {
    LembreteCriado: (lembrete: Lembrete) => {
        baseConsolidada[lembrete.id] = lembrete
    },
    ObservacaoCriada: (observacao: Observacao) => {
        console.log("ObservacaoCriada recebida")
        const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
        observacoes.push(observacao)
        baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
    },
    ObservacaoAtualizada: (observacao: Observacao) => {
        console.log("ObservacaoAtualizada recebida")
        const observacoesAux: Observacao[] = baseConsolidada[observacao.lembreteId]['observacoes']!
        const indice = observacoesAux.findIndex(o => o.id === observacao.id)
        observacoesAux[indice] = observacao
    }
}

app.get('/lembretes', (req,res) => {
    registroFunction('GET /lembretes')
    res.status(200).json(baseConsolidada)
})

app.post('/eventos', (req, res) => {
    try{
    
        console.log(req.body)
        funcoes[req.body.tipo](req.body.dados)
    }
    catch(e){}
    res.end()
})

const port = ports.consulta
app.listen(port, () => {
    console.log(`Consulta. ${port}`)
})