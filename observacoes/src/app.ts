import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { format } from 'date-fns';
import ports from '../../configPortas';

const app = express()
app.use(express.json())

const funcoes: Record<string, Function> = {
    ObservacaoClassificada: (observacao: Observacao) => {
        // encontrar a observacao na base local e atualizar o seu status
        const observacoesAux = observacoes[observacao.id]
        const obsParaAtualizar: Observacao = observacoesAux.find(o => o.id === observacao.id)!
        obsParaAtualizar.status = observacao.status
        // emitir um evento do tipo ObservacaoAtualizada
        axios.post(`http://localhost:${ports.barramentoEventos}/eventos`, {
            tipo: 'ObservacaoAtualizada',
            dados: {
                id: observacao.id,
                texto: observacao.texto,
                lembreteId: observacao.lembreteId,
                status: observacao.status
            }
        })
    }
}

app.post('/eventos', (req, res) => {
    try{
        console.log(req.body)
        funcoes[req.body.tipo](req.body.dados)
    }
    catch(e){}
    res.send()
})

interface Observacao{
    id: string;
    texto: string;
    lembreteId: string;
    status: string;
}

interface iRegistro{
    data: string;
    mss: string;
    endpoint: string;
}
function registroFunction (msg: string){
    
    const data = new Date()
    const dataFormat = format(data, 'dd/MM/yyyy HH:mm:ss.SSS')
    const registro: iRegistro = {data: dataFormat, mss: 'Observacoes', endpoint: msg}

    axios.post(`http://localhost:${ports.barramentoEventos}/eventos`,{
        tipo: 'RegistroCriado',
        dados: registro
    })
}
const observacoes: Record<string, Observacao[]> = {}

//POST //lembretes/123/observaÃ§Ãµes
app.post('/lembretes/:id/observacoes', (req,res) => {
    //gerar id de observcao
    const idObs = uuidv4();
    //extrair o texto do corpo da requisicao
    const { texto } = req.body
    //pegar a colecao de observacoes do lembrete cujo id encontra na url, caso exista
    const observacoesDoLembrete: Observacao[] = observacoes[req.params.id] || []
    const obs = {id: idObs, texto, status: 'aguardando', lembreteId: req.params.id}
    observacoesDoLembrete.push(obs)
    //caso contrario, pegar uma colecao nova, vazia.   
    // na coleÃ§Ã£o pega no passo anterior, adiciono um novo objeto caracterizado por id e texto
    // atualizar o ponteiro na base global para que ele aponte apar a coleção que contema nova observacao
    observacoes[req.params.id] = observacoesDoLembrete
    axios.post(`http://localhost:${ports.barramentoEventos}/eventos`, {
        tipo: 'ObservacaoCriada',
        dados: {...obs, lembreteId: req.params.id}
    })
    registroFunction('POST /lembretes/:id/observacoes')
    //responder para o cliente com status 201 e entregando a ele a coleÃ§Ã£o atualizada
    res.status(201).json(obs)
})

//GET /lembretes/123456/observaÃ§Ãµes
app.get('/lembretes/:id/observacoes', (req,res) => {
    registroFunction('GET /lembretes/:id/observacoes')
   res.json(observacoes[req.params.id] || [])
})


const port = ports.observacoes
app.listen(port, () => {
    console.log(`Observacoes. ${port}`)
})
