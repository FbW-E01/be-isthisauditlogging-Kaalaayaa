import express from 'express'
import { Low, JSONFile } from "lowdb"

const app = express()

const adapter = new JSONFile("./db.json")
const db = new Low(adapter)

await db.read()
db.data = db.data || { messages: [] }


const loggingMiddleWare = (req, res, next) => {
    const dateTime = new Date().toDateString()

    db.data.messages.push(`[${dateTime}] ${req.method} ${req.url} accessed`)
    db.write()

    const delayMS= Math.round(Math.random() * 4000) + 1000
    setTimeout(next, delayMS)
}

app.use(loggingMiddleWare)

app.get("/banana", (req, res) => {
    res.send("request sent for bananas")
})

app.get("/mango", (req, res) => {
    res.send("request sent for mangos")
})


app.post("/banana", function(req, res) {
    console.log(req.body)
    res.send("request received for bananas!\n")
})

app.post("/mango", function(req, res) {
    console.log(req.body)
    res.send("request received for mangos!\n")
})

const port = 8000
app.listen(port, () => {
    console.log("App listening on http://localhost:" +port)
})