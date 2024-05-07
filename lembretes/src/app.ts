import express from 'express'
import axios from 'axios';  
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns';
import services from '../../configPortas';


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


function registro (msg: string){

    const data = new Date()
    const dataFormat = format(data, 'dd/MM/yyyy HH:mm:ss.SSS')
    const registro: string = ` ${dataFormat} - (mss-lembretes) ${msg}`

    axios.post('http://localhost:9000/eventos',{
        tipo: 'RegistroCriado',
        dados: registro
    })
}
//GET /lembretes obter a coleÃ§Ã£o de lembretes
app.get('/lembretes', (req,res) => {
    registro('GET /lembretes')
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
    
    axios.post('http://localhost:10000/eventos',{
        tipo: 'LembreteCriado',
        dados: lembrete
    })
    registro('POST /lembretes')
    //responder ao cliente
    res.json(lembrete)
})

//GET /lembretes/{id} obter um lembrete pelo id
app.get('/lembretes/:id', (req,res) => {
    const { id } = req.params;
    const lembrete = lembretes[id];
    if (lembrete) {
        registro(`GET /lembretes/:id`)
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
        registro(`PUT /lembretes/:id`)
        res.json(lembrete);
    } else {
        res.status(404).send('Lembrete nao encontrado');
    }
})
app.post('/eventos', (req,res) => {
    registro(`POST /eventos`)
    console.log(req.body)
    res.send()
})

const port = services.lembretes
app.listen(port,() => console.log(`Lembretes. Porta ${port}.`))
