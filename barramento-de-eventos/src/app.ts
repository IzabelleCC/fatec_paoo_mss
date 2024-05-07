import express from 'express';
import axios from 'axios';
import services from '../../configPortas';

const app = express();
app.use(express.json());

app.post('/eventos', (req, res) => {
    const evento = req.body;
    //evento lembrentes
    axios.post('http://localhost:4000/eventos', evento);
    //eventos observacoes
    axios.post('http://localhost:5000/eventos', evento);
    //eventos consulta
    axios.post('http://localhost:6000/eventos', evento);
    //eventos registro
   // axios.post('http://localhost:9000/eventos', evento);
})

const port = services.eventos
app.listen(port, () => {
  console.log(`Barramento de eventos ${port}`)
});