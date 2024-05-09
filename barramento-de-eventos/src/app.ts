import express from 'express';
import axios from 'axios';
import ports from '../../configPortas';

const app = express();
app.use(express.json());

app.post('/eventos', (req, res) => {
    const evento = req.body;
    //evento lembrentes
    axios.post(`http://localhost:${ports.lembretes}/eventos`, evento);
    //eventos observacoes
    axios.post(`http://localhost:${ports.observacoes}/eventos`, evento);
    //eventos consulta
    axios.post(`http://localhost:${ports.consulta}/eventos`, evento);
    //eventos registro
    axios.post(`http://localhost:${ports.registro}/eventos`, evento);
    //eventos classificacao
    axios.post(`http://localhost:${ports.classificacao}/eventos`, evento);
    res.end()
})


const port = ports.barramentoEventos
app.listen(port, () => {
  console.log(`Barramento de eventos ${port}`)
});