import * as dotenv from 'dotenv';
import {GoogleGenerativeAI} from "@google-cloud/vertexai";
dotenv.config();

async function sendPrompt(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(prompt);

        return result.response.text(); // Retorna el texto en lugar de imprimirlo
    } catch (error) {
        console.error("Error sending prompt:", error);
        return null; // o lanza el error, dependiendo de tus necesidades
    }
}
