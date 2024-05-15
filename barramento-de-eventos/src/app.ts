import express from 'express';
import axios from 'axios';
import ports from '../../configPortas';

const app = express();
app.use(express.json());

interface Evento{
  tipo: string;
  dados: {}
}
const eventos: Evento[] = [];

app.post('/eventos', async (req, res) => {
    const evento = req.body;
    eventos.push(evento)
    console.log(evento)

    try{
      //evento lembrentes
     await axios.post(`http://localhost:${ports.lembretes}/eventos`, evento);
    }catch(e){}
    try{
      //eventos observacoes
     await axios.post(`http://localhost:${ports.observacoes}/eventos`, evento);
    }catch(e){}
    try{
      //eventos consulta
     await axios.post(`http://localhost:${ports.consulta}/eventos`, evento);
    }catch(e){}
    try{
      //eventos registro
     await axios.post(`http://localhost:${ports.registro}/eventos`, evento);
    }catch(e){}
    try{
      //eventos classificacao
      await axios.post(`http://localhost:${ports.classificacao}/eventos`, evento);
    }catch(e){}
    res.end()
})

app.get('/eventos', (req, res) => {
  res.json(eventos)
})
const port = ports.barramentoEventos
app.listen(port, () => {
  console.log(`Barramento de eventos ${port}`)
});