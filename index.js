import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

let vehicles = [];
let users = [];
let currentId = 1;
let currentUserId = 1;

app.post('/veiculos', (req, res) => {
    const { modelo, marca, ano, cor, preco } = req.body;

    if (!modelo || !marca || !ano || !cor || !preco) {
        return res.status(400).json({ 
            message: 'Todos os campos são obrigatórios' });
    }

    const newVehicle = {
        id: currentId++,
        modelo,
        marca,
        ano,
        cor,
        preco
    };

    vehicles.push(newVehicle);
    res.status(201).json({ 
        message: 'Veículo adicionado com sucesso', newVehicle });
});

app.get('/veiculos', (req, res) => {
    const { marca } = req.query;

    let filteredVehicles = vehicles;

    if (vehicles.length === 0) {
        return res.status(404).json({ message: "Nenhum veículo cadastrado" });
    }

    if (marca) {
        filteredVehicles = vehicles.filter(vehicle =>
            vehicle.marca.toLowerCase() === marca.toLowerCase()
        );

        if (filteredVehicles.length === 0) {
            return res.status(404).json({ message: `Nenhum veículo encontrado para a marca ${marca}` });
        }
    }

    res.json(filteredVehicles.map(vehicle => {
        return {
            ID: vehicle.id,
            Modelo: vehicle.modelo,
            Marca: vehicle.marca,
            Ano: vehicle.ano,
            Cor: vehicle.cor,
            Preço: `R$${vehicle.preco}`
        };
    }));
});

app.put('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    const { cor, preco } = req.body;

    const vehicle = vehicles.find(vehicle => vehicle.id === parseInt(id));

    if (!vehicle) {
        return res.status(404).json({ 
            message: 'Veículo não encontrado' });
    }

    if (cor) vehicle.cor = cor;
    if (preco) vehicle.preco = preco;

    res.json({ 
        message: 'Veículo atualizado com sucesso', vehicle });
});

app.delete('/veiculos/:id', (req, res) => {
    const { id } = req.params;

    const vehicleIndex = vehicles.findIndex(vehicle => vehicle.id === parseInt(id));

    if (vehicleIndex === -1) {
        return res.status(404).json({ 
            message: 'Veículo não encontrado' });
    }

    vehicles.splice(vehicleIndex, 1);
    res.json({ 
        message: 'Veículo removido com sucesso' });
});

app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ 
            message: 'Todos os campos são obrigatórios' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = {
        id: currentUserId++,
        nome,
        email,
        senha: hashedPassword
    };

    users.push(newUser);
    res.status(201).json({ 
        message: 'Usuário criado com sucesso', newUser });
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ 
            message: 'Email e senha são obrigatórios' });
    }

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({ 
            message: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
        return res.status(401).json({ 
            message: 'Senha inválida' });
    }

    res.json({ 
        message: 'Login realizado com sucesso' });
});

const PORT = 3030;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
