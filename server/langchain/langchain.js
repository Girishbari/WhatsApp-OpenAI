const { ChatOpenAI } = require("langchain/chat_models/openai");
const { SerpAPI } = require("langchain/tools")
const dotenv = require("dotenv");


dotenv.config();

const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',

    temperature: 0
})

const tools = [new SerpAPI()]


module.exports = {
    ChatOpenAI,
    SerpAPI,
    tools,
    llm
}