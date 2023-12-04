import env from "./src/environment.js"
import express from "express"
import axios from "axios"
import cors from "cors"
import ImageRoutes from "./src/routes/ImageRoutes.js"
import UserRoutes from "./src/routes/UserRoutes.js"

const app = express()

app.use(cors())
app.use(express.json({ limit: "2mb" }))
app.use(express.urlencoded({ extended: true}))


app.use("/", ImageRoutes)
app.use("/user", UserRoutes)

app.listen(env.port, () => {
    console.log(`Servidor ativo na porta ${env.port}`)
})
