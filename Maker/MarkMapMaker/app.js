import * as dotenv from 'dotenv';
import * as fs from "node:fs";
import loadPrompts from './proccess/LoadPrompts.js';
import generateMarkMap from "./proccess/GenerateMarkMap.js";
import  sendPrompt  from './proccess/sendPrompt.js';
import enhanceMarkmap from "./proccess/EnhanceMarkmap.js";
import { agregarTema } from './proccess/SaveTopic.js';
import logger from "./utility/Logger/logger.js";

dotenv.config();

const alias = process.argv[2];
const topic = process.argv[3] ?? process.argv[2];
const enhancementLevel = 3;

const prompts = loadPrompts();

const basicInfoPrompt = prompts.getTopicDetails.replaceAll('{input}', topic);
const topicInfo = await sendPrompt(basicInfoPrompt, process.env.GEMINI_API_KEY);
const markMapPrompt = prompts.convertToMarkmap.replaceAll('{lista_de_temas}', topicInfo);
const example = fs.readFileSync('Example/example.md', 'utf8');
let markMapCode = await sendPrompt(markMapPrompt + "\n te adjunto un ejemplo: " + example, process.env.GEMINI_API_KEY);

markMapCode = await enhanceMarkmap(markMapCode, enhancementLevel, prompts.markMapEnhancement);
markMapCode = markMapCode.substring(11, markMapCode.length - 4);
let complementaryDataPrompt = prompts.complementaryData.replaceAll('{markmap_a_utilizar}', markMapCode);
let complementaryData = await sendPrompt(complementaryDataPrompt, process.env.GEMINI_API_KEY);

fs.writeFileSync(`${process.env.RESULTS_DIR}/Raw/${alias}.md`, markMapCode);
fs.writeFileSync(`${process.env.RESULTS_DIR}/Complement/${alias}_complement.txt`, complementaryData);
agregarTema(alias);
generateMarkMap(markMapCode, `${process.env.RESULTS_DIR}/HTML/${alias}.html`);

logger.info(markMapCode);
logger.info(topicInfo);