import env from "./src/environment.js"
import express from "express"
import axios from "axios"
import cors from "cors"
import ImageRoutes from "./src/routes/ImageRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))


app.use("/image", ImageRoutes)

app.listen(env.port, () => {
    console.log(`Servidor ativo na porta ${env.port}`)
})
