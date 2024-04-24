import express from 'express';
import axios from 'axios'

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

const funcoes: Record<string, Function> = {
    LembreteCriado: (lembrete:Lembrete) => {
        baseConsolidada[lembrete.id] = lembrete
    },
    ObservacaoCriada: (observacao: Observacao) => {
        const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
        observacoes.push(observacao)
        baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
    }
}

app.get('/lembretes', (req,res) => {
    res.status(200).json(baseConsolidada)
})

app.post('/eventos', (req, res) => {
    funcoes[req.body.tipo](req.body.dados)
    res.status(200).json(baseConsolidada)
})

const port = 6000
app.listen(port, () => {
    console.log(`Consulta. ${port}`)
})