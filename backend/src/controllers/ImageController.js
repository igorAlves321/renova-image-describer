import env from "../environment.js"

class ImageController {
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
                            "text": "Descreva com riqueza de detalhes esta imagem, explorando o máximo de informações possíveis."
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
            "max_tokens": 500
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
            return null
        }
    }

    async getDetails(req, res) {
        const { image } = req.body
        if (!image) {
            return res.status(400).json({ message: "Image is required" })
        }

        const imageInfo = await this.requestDetails(image)
        if (!imageInfo) {
            return res.status(500).json({
                message: "Não foi possível obter detalhes da imagem."
            })
        }
    }
}

export default ImageController