import express from 'express';
import axios from 'axios';

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
     await axios.post(`http://192.168.1.22:4000/eventos`, evento);
    }catch(e){}
    try{
      //eventos observacoes
     await axios.post(`http://192.168.1.22:5000/eventos`, evento);
    }catch(e){}
    try{
      //eventos consulta
     await axios.post(`http://192.168.1.22:6000/eventos`, evento);
    }catch(e){}
    try{
      //eventos registro
     await axios.post(`http://192.168.1.22:9000/eventos`, evento);
    }catch(e){}
    try{
      //eventos classificacao
      await axios.post(`http://192.168.1.22:7000/eventos`, evento);
    }catch(e){}
    res.end()
})

app.get('/eventos', (req, res) => {
  res.json(eventos)
})

const port = 10000
app.listen(port, () => {
  console.log(`Barramento de eventos ${port}`)
});