import express from 'express'
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
//GET /lembretes obter a coleÃ§Ã£o de lembretes
app.get('/lembretes', (req,res) => {
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
    //responder ao cliente
    res.json(lembrete)
})

//GET /lembretes/{id} obter um lembrete pelo id
app.get('/lembretes/:id', (req,res) => {
    const { id } = req.params;
    const lembrete = lembretes[id];
    if (lembrete) {
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
        res.json(lembrete);
    } else {
        res.status(404).send('Lembrete nao encontrado');
    }
})

const port = 4000
app.listen(port,() => console.log(`Lembretes. Porta ${port}.`))
