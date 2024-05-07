import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { format } from 'date-fns';
import services from '../../configPortas';

const app = express()
app.use(express.json())
/*
a estrutura da base de observaÃ§Ãµes...
{
    "1":[
        {"id"}
    ]
}
*/
interface Observacao{
    id: string;
    texto: string;
}

function registro (msg: string){

    const data = new Date()
    const dataFormat = format(data, 'dd/MM/yyyy HH:mm:ss.SSS')
    const registro: string = ` ${dataFormat} - (mss-observacoes) ${msg}`

    axios.post('http://localhost:9000/eventos',{
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
    const obs = {id: idObs, texto}
    observacoesDoLembrete.push(obs)
    //caso contrario, pegar uma colecao nova, vazia.   
    // na coleÃ§Ã£o pega no passo anterior, adiciono um novo objeto caracterizado por id e texto
    observacoesDoLembrete.push({id: idObs, texto})
    // atualizar o ponteiro na base global para que ele aponte apar a coleção que contema nova observacao
    observacoes[req.params.id] = observacoesDoLembrete
    axios.post('http://localhost:10000/eventos', {
        tipo: 'ObservacaoCriada',
        dados: {...obs, lembreteId: req.params.id}
    })
    registro('POST /lembretes/:id/observacoes')
    //responder para o cliente com status 201 e entregando a ele a coleÃ§Ã£o atualizada
    res.status(201).json(obs)
})

//GET /lembretes/123456/observaÃ§Ãµes
app.get('/lembretes/:id/observacoes', (req,res) => {
    registro('GET /lembretes/:id/observacoes')
   res.json(observacoes[req.params.id] || [])
})

app.post('/eventos', (req, res) => {
    registro('POST /eventos')
    console.log(req.body)
    res.send()
})

const port = services.observacoes
app.listen(port, () => {
    console.log(`Observacoes. ${port}`)
})
