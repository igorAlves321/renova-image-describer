import axios from "axios";
import { PrismaClient } from "@prisma/client";
import env from "../environment.js";

const prisma = new PrismaClient();

class ImageController {
    constructor() {
        this.getDetails = this.getDetails.bind(this);
    }

    async requestDetails(imageData) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.api_key}`
        };

        const payload = {
            "model": "gpt-4-vision-preview",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Descreva em até 1000 caracteres com riqueza de detalhes esta imagem. Não repita muitas palavras, e seja objetivo, não esquecendo de detalhar o que for possível. Em caso de planilhas, separe os resultados..."
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
        };

        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
            const data = response.data;
            return data.choices && data.choices.length ? data.choices[0].message.content : null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async getDetails(req, res) {
        const { image, title, userId, saveDescription } = req.body;
        if (!image || (saveDescription && !title)) {
            return res.status(400).json({ message: "Image and title are required when saving the description" });
        }

        const infoImage = await this.requestDetails(image);
        if (!infoImage) {
            return res.status(500).json({ message: "Não foi possível obter detalhes da imagem." });
        }

        if (saveDescription) {
            try {
                const imageDescription = await prisma.imageDescription.create({
                    data: {
                        imageUrl: image,
                        description: infoImage,
                        title, // Adicionando o título
                        userId
                    }
                });

                return res.status(200).json({
                    message: "Descrição da imagem salva com sucesso",
                    data: imageDescription
                });
            } catch (error) {
                console.error(`Erro ao salvar descrição da imagem: ${error.message}`);
                return res.status(500).send('Erro ao salvar descrição da imagem');
            }
        } else {
            return res.status(200).json({
                message: "Informações da imagem",
                data: infoImage
            });
        }
    }
}

export default ImageController;
