import sendPrompt from "./SendPrompt.js";

async function enhanceMarkmap (markmapCode, enhancementLevel, basePrompt){
    let enhancementPrompt = "";
    for (let i = 0; i < enhancementLevel; i++) {
        enhancementPrompt = basePrompt.replaceAll('{markmap_a_corregir}', markmapCode);
        markmapCode = await sendPrompt(enhancementPrompt, process.env.GEMINI_API_KEY);
    }
    return markmapCode;
}

export default enhanceMarkmap;