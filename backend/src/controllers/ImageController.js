import env from "../environment.js"
import axios from "axios"

class ImageController {
    constructor() {
        this.getDetails = this.getDetails.bind(this)
    }


    async requestDetails(imageData) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.api_key}`
        }

        const payload = {
            "model": "gpt-4-vision-preview",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Descreva em até 1000 caracteres com riqueza de detalhes esta imagem. Não repita muitas palavras, e seja objetivo, não esquecendo de detalhar o que for possível. Em caso de planilhas, separe os resultados. Exemplo: Na planilha, temos duas colunas. Na primeira, o nome de cada pessoa, e na segunda a mensagem, aprovado, melhorar nota ou reprovado. Aprovados: 10 (jão, maria, gustavo...), Melhorar nota: 5 (Joaquim, Fernando...), Reprovados: 3 (tiago, jeniffer, Bianca, ...)."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imageData
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 600
        }

        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
                timeout: 0,
                headers: headers
            })
            const data = response.data
            if (!data.choices) {
                return null
            }
            const message = data.choices[0].message.content
            return message
        } catch (err) {
            console.log(err)
            return null
        }
    }


    async getDetails(req, res) {
        const { image } = req.body
        if (!image) {
            return res.status(400).json({ message: "Image is required" })
        }

        const infoImage = await this.requestDetails(image)
        if (!infoImage) {
            return res.status(500).json({
                message: "Não foi possível obter detalhes da imagem."
            })
        }

        return res.status(200).json({
            message: "Informações da imagem",
            data: infoImage
        })
    }

}

export default ImageController