import express from 'express'
import axios from 'axios';  
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns';
import ports from '../../configPortas';


const app = express()
app.use(express.json())
/*
    {
        "1":{
            "id":"1",
            "texto": "Fazer cafe"
        },
        "2":{
            "id":"2",
            "texto": "Nadar"
        }
    }
*/
interface Lembrete{
    id: string;
    texto: string;
}
const lembretes: Record<string, Lembrete> = {}
let id: string = '1'

interface iRegistro{
    data: string;
    mss: string;
    endpoint: string;
}
function registroFunction (msg: string){

    const data = new Date()
    const dataFormat = format(data, 'dd/MM/yyyy HH:mm:ss.SSS')
    const registro: iRegistro = {data: dataFormat, mss: 'Lembretes', endpoint: msg}

    axios.post(`http://localhost:${ports.barramentoEventos}/eventos`,{
        tipo: 'RegistroCriado',
        dados: registro
    })
}
//GET /lembretes obter a coleÃ§Ã£o de lembretes
app.get('/lembretes', (req,res) => {
    registroFunction('GET /lembretes')
    res.json(lembretes)
})

//POST /lembretes cadastrar novo lembrete
app.post('/lembretes', (req,res) => {
    //extrair o texto do corpo da requisiÃ§Ã£o
    const { texto } = req.body
    //construir um novo lembrete
    const lembrete = { id, texto }
    //armazenar o novo lembrete
    lembretes[id] = lembrete
    //incremento o id
    id = (+id + 1).toString()
    
    axios.post(`http://localhost:${ports.barramentoEventos}/eventos`,{
        tipo: 'LembreteCriado',
        dados: lembrete
    })
    registroFunction('POST /lembretes')
    //responder ao cliente
    res.json(lembrete)
})

//GET /lembretes/{id} obter um lembrete pelo id
app.get('/lembretes/:id', (req,res) => {
    const { id } = req.params;
    const lembrete = lembretes[id];
    if (lembrete) {
        registroFunction(`GET /lembretes/:id`)
        res.json(lembrete);
    } else {
        res.status(404).send('Lembrete nao encontrado');
    }
})

app.put('/lembretes/:id', (req,res) => {
    const { id } = req.params;
    const lembrete = lembretes[id];
    if (lembrete) {
         //extrair o texto do corpo da requisiÃ§Ã£o
        const { texto } = req.body
        //construir um novo lembrete
        const lembrete = { id, texto }
        //armazenar o novo lembrete
        lembretes[id] = lembrete
        registroFunction(`PUT /lembretes/:id`)
        res.json(lembrete);
    } else {
        res.status(404).send('Lembrete nao encontrado');
    }
})
app.post('/eventos', (req,res) => {
    try{
        console.log(req.body)
    }
    catch(e){}
    res.send()
})

const port = ports.lembretes
app.listen(port,() => console.log(`Lembretes. Porta ${port}.`))
