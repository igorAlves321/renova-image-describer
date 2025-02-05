import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ImageController {
    constructor() {
        this.getDetails = this.getDetails.bind(this);
        this.clearHistory = this.clearHistory.bind(this);
    }

    // Método para enviar a imagem Base64 para VisionBot e obter o requestId
    async uploadImageToVisionBot(imageBase64) {
        try {
            console.log("Enviando imagem para VisionBot...");

            // Remover prefixo Base64, se houver
            const sanitizedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

            const response = await axios.post("https://visionbot.ru/apiv2/in.php", 
                new URLSearchParams({
                    body: sanitizedBase64,
                    lang: "pt",
                    target: "nothing",
                    bm: "1"
                }), 
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" }
                }
            );

            if (response.data.status === "ok") {
                console.log("Imagem enviada! Request ID:", response.data.id);
                return response.data.id;
            } else {
                throw new Error("Erro ao fazer upload da imagem: " + response.data.status);
            }
        } catch (error) {
            console.error("Erro ao enviar imagem para VisionBot:", error.message);
            return null;
        }
    }

    // Método para buscar a descrição gerada pela VisionBot
    async getVisionBotResult(requestId) {
        const maxRetries = 18; // Tentaremos por 90 segundos (5s por tentativa)
        
        for (let i = 0; i < maxRetries; i++) {
            console.log(`Tentativa ${i + 1}: buscando resultado da API...`);

            try {
                const response = await axios.post("https://visionbot.ru/apiv2/res.php",
                    new URLSearchParams({ id: requestId }), 
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" }
                    }
                );

                if (response.data.status === "ok") {
                    console.log("Descrição recebida da API VisionBot:", response.data.text);
                    return response.data.text;
                } else if (response.data.status === "notready") {
                    console.log("A descrição ainda não está pronta, aguardando...");
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos
                } else {
                    throw new Error("Erro ao obter o resultado: " + response.data.status);
                }
            } catch (error) {
                console.error("Erro ao buscar resultado da VisionBot:", error.message);
                return null;
            }
        }

        throw new Error("Tempo limite excedido ao buscar descrição.");
    }

    // Método para obter a descrição da imagem
    async getDetails(req, res) {
        console.log("Recebendo requisição no endpoint /image com dados:", req.body);

        const { imagePath, title, userId, saveDescription, description } = req.body;

        if (!imagePath || (saveDescription && !title)) {
            console.error("Dados inválidos na requisição:", req.body);
            return res.status(400).json({
                message: "Caminho da imagem e título são obrigatórios ao salvar a descrição.",
            });
        }

        let infoImage = description;
        if (!infoImage) {
            try {
                console.log("Processando imagem Base64 diretamente...");

                // Envia a imagem para VisionBot e obtém o requestId
                const requestId = await this.uploadImageToVisionBot(imagePath);

                if (!requestId) {
                    console.error("Não foi possível obter um requestId.");
                    return res.status(500).json({ message: "Erro ao processar a imagem." });
                }

                // Obtém a descrição da imagem
                infoImage = await this.getVisionBotResult(requestId);

                if (!infoImage) {
                    console.error("A API VisionBot não retornou uma descrição.");
                    return res.status(500).json({ message: "Não foi possível obter detalhes da imagem." });
                }

                console.log("Descrição gerada pela API VisionBot:", infoImage);
            } catch (error) {
                console.error("Erro ao processar a imagem:", {
                    message: error.message,
                    stack: error.stack,
                });
                return res.status(500).json({ message: "Erro ao processar a imagem." });
            }
        }

        if (saveDescription) {
            try {
                console.log("Salvando descrição no banco de dados...");

                const imageDescription = await prisma.imageDescription.create({
                    data: {
                        imageUrl: imagePath, // Pode ser a string Base64 ou um URL real
                        description: infoImage,
                        title,
                        userId,
                    },
                });

                console.log("Descrição salva com sucesso no banco de dados:", imageDescription);
                return res.status(200).json({
                    message: "Descrição da imagem salva com sucesso",
                    data: imageDescription,
                });
            } catch (error) {
                console.error("Erro ao salvar descrição no banco de dados:", {
                    message: error.message,
                    stack: error.stack,
                });
                return res.status(500).send("Erro ao salvar descrição no banco de dados.");
            }
        } else {
            console.log("Retornando descrição gerada ao cliente.");
            return res.status(200).json({
                message: "Informações da imagem",
                data: infoImage,
            });
        }
    }

    // Método para limpar o histórico de um usuário
    async clearHistory(req, res) {
        const { userId } = req.params;

        console.log("Recebendo requisição para limpar histórico do usuário:", userId);

        try {
            const result = await prisma.imageDescription.deleteMany({
                where: { userId },
            });

            console.log(`Histórico limpo com sucesso para o usuário ${userId}. Registros deletados:`, result.count);
            return res.status(200).send("Histórico limpo com sucesso.");
        } catch (error) {
            console.error("Erro ao limpar o histórico:", {
                message: error.message,
                stack: error.stack,
            });
            return res.status(500).send("Erro ao limpar o histórico.");
        }
    }
}

export default ImageController;
