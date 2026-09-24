const express = require("express")
const cors = require("cors")
const dados = require("./dados.json")

function autoIncrement() {
    return dados.length ? Number(dados[dados.length - 1].id) + 1 : 1
}

const rotaInicial = (req, res) => {
    res.json("Back-end respondendo")
}

const createConsumo = (req, res) => {
    const consumo = req.body
    consumo.id = autoIncrement()
    dados.push(consumo)
    res.status(201).json(consumo)
}

const readConsumo = (req, res) => {
    res.json(dados)
}

const buscaConsumoPorId = (req, res) => {
    const consumo = dados.find(c => c.id == Number(req.params.id))
    if (consumo) res.json(consumo)
    else res.status(404).json("Id não encontrado")
}

const buscaConsumo = (req, res) => {
    const { id, equipamento, local } = req.query
    const norm = (t) => String(t ?? "").toLowerCase()

    const resultado = dados.filter(c =>
        (!id || c.id == Number(id)) &&
        (!equipamento || norm(c.equipamento).includes(norm(equipamento))) &&
        (!local || norm(c.local).includes(norm(local)))
    )

    if (resultado.length > 0) res.json(resultado)
    else res.status(404).json("Nenhum consumo encontrado")
    // Exemplo de como buscar por equipamento: /consumos/busca?equipamento=ar
    // Exemplo de como buscar por local: /consumos/busca?local=secretaria
    // Exemplo de como buscar por equipamento e local: /consumos/busca?equipamento=ar&local=secretaria
}

const updateConsumo = (req, res) => {
    const id = Number(req.params.id)
    const novoConsumo = req.body
    novoConsumo.id = id
    let status = 0

    dados.forEach((consumo, indice) => {
        if (consumo.id == id) {
            dados[indice] = novoConsumo
            status = 1
        }
    })

    if (status == 1) {
        res.status(202).json(novoConsumo)
    } else {
        res.status(404).send("Consumo não encontrado")
    }
}

const deleteConsumo = (req, res) => {
    const id = req.params.id
    let status = 0

    dados.forEach((consumo, indice) => {
        if (consumo.id == id) {
            dados.splice(indice, 1)
            status = 1
        }
    })

    if (status == 1) {
        res.json("Consumo excluido com sucesso")
    } else {
        res.status(404).send("Consumo não encontrado")
    }
}

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const porta = 3000

app.get('/', rotaInicial)
app.post('/consumos', createConsumo)
app.get('/consumos', readConsumo)
app.get('/consumos/busca', buscaConsumo)
app.get('/consumos/:id', buscaConsumoPorId)
app.put('/consumos/:id', updateConsumo)
app.delete('/consumos/:id', deleteConsumo)

app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`)
})