import { GoogleGenerativeAI } from "@google/generative-ai";
import lapobreza from "./EnhanceMarkmap.js";

export async function sendPrompt(prompt, apiKey) {
    try {
        lapobreza();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error sending prompt:", error);
        return null;
    }
}
export default sendPrompt;