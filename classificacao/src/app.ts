import express from 'express'
import axios from 'axios'
import ports from '../../configPortas'

const app = express()
app.use(express.json())


const palavraChave = 'importante'

interface Observacao{
    id: string;
    texto: string;
    lembreteId: string;
    status: string;
}

const funcoes: Record<string, Function> = {
    ObservacaoCriada: (observacao: Observacao) => {
        //use um if/else para fazer essa logica, atualizando o status da observacao
        observacao.status = observacao.texto.includes(palavraChave) ? 'importante' : 'comum'
        axios.post(`http://localhost:${ports.barramentoEventos}/eventos`,{
            tipo: 'ObservacaoClassificada',
            dados:{...observacao}
        })
    }
}

app.post('/eventos', (req, res) => {
    try{
        console.log(req.body)
        funcoes[req.body.tipo](req.body.dados)
    }
    
    catch(e){
        res.end()
    }
})

const port = ports.classificacao
app.listen(port, () => {
  console.log(`Classificacao ${port}`)
});