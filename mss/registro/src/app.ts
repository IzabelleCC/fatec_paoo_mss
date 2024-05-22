import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(express.json())

interface Registro {
    tipo: string;
    dados: any;
}

const baseRegistros: Record<string, any> = {}


app.post('/eventos', (req, res) => {
    const evento: Registro = req.body
    if(evento.tipo === 'RegistroCriado'){
        baseRegistros[uuidv4()] = evento.dados;
    }
    console.log(baseRegistros)
    res.status(200).json(baseRegistros)
})

app.get('/registros', (req,res) => {
    res.status(200).json(baseRegistros)
})

const port = 9000
app.listen(port, () => {
    console.log(`Observacoes. ${port}`)
})