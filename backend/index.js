import dotenv from "dotenv"
const env = dotenv.config().parsed
const apiKey = env.api_key

const imagePath = "IMG-20230718-WA0003.jpg"
import axios from "axios"
import { promises as fs } from "fs"

async function encodeImage(imagePath) {
  try {
    const data = await fs.readFile(imagePath);
    return Buffer.from(data).toString('base64');
  } catch (err) {
    console.error("Deu erro.", err)
    return
  }
}


async function getImageDetails(imagePath) {
  const imageEncoded = await encodeImage(imagePath)
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  }

  const payload = {
    "model": "gpt-4-vision-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Descreva com detalhes esta imagem:"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": `data:image/jpeg;base64,${imageEncoded}}`
            }
          }
        ]
      }
    ],
    "max_tokens": 500
  }

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers: headers })
    const data = response.data
    if (!data.choices) {
      console.log("Não foi possível obter a descrição da imagem.")
      return
    }
    const message = data.choices[0].message.content
    console.log(message)
  } catch (err) {
    console.error("Erro ao fazer requisição", err)
  }
}

getImageDetails(imagePath)