const { initializeAgentExecutorWithOptions } = require("langchain/agents")
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { SerpAPI } = require("langchain/tools")
const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser");
const { Client, LocalAuth } = require('whatsapp-web.js');
const { Client: NotionClient } = require("@notionhq/client")
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const qrcode = require('qrcode-terminal');
const dotenv = require("dotenv");
const path = require('path')

dotenv.config();


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // needs to change on AWS server
        methods: ["GET", "POST"]
    }
});



const port = 3000;
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))



app.use(express.static("public"));
app.use("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})


let NOTION_TOKEN = '';
let dbID = ''
let groupName = ''




const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.3
});
const tools = [new SerpAPI()]
const str = "a Person is a Youtuber which makes content around software and coding Give him good Content title, Good Resources links for research on topic: "

let groupId = '';

app.post('/getNotionDetail', (req, res) => {
    if (req.body) {
        //  console.log(req.body)
        NOTION_TOKEN = req.body.NOTION_TOKEN;
        dbID = req.body.dbID;
        groupName = req.body.groupName;
        res.json({ message: 'updated' })
    } else {
        res.status.json({ message: "error " })

    }

})



io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });

    const whatsappClient = new Client({
        puppeteer: {
            headless: true,
        },
        authStrategy: new LocalAuth({
            clientId: 'something',
        })
    });

    const createWhatsappSession = (socket) => {

        whatsappClient.on('qr', qr => {
            qrcode.generate(qr, { small: true });
            socket.emit("qr", {
                qr,
            });

        });

        whatsappClient.on('authenticated', () => {
            //  console.log("authenticated")
        })

        whatsappClient.on('ready', () => {
            console.log('Client is ready!');
            socket.emit("ready", { message: "Client is ready!" });
            whatsappClient.getChats().then((res) => {
                const group = res.find((chat) => chat.name === groupName) // this need to take from user
                console.log(group.id._serialized)
                groupId = group.id._serialized
                socket.emit("groupConnected", (groupId) => {
                    message: groupId
                })
            })

        });
        whatsappClient.initialize();

        whatsappClient.on('message_create', async (msg) => {
            if (msg.fromMe && msg.to === groupId) {
                console.log(msg.body)
                const executor = await initializeAgentExecutorWithOptions(tools, llm, {
                    agentType: "openai-functions",
                })
                const result = await executor.run(`${str} ${msg.body} and makes sure string length does not go beyond 2000 characters`)
                console.log(result)
                const titleRegex = /Title: "(.*?)"/;

                const titleMatch = result.match(titleRegex);

                const title = titleMatch ? titleMatch[1].trim() : "Title not found";
                const notion = new NotionClient({
                    auth: NOTION_TOKEN,
                });
                console.log(NOTION_TOKEN, notion)
                const notionResp = await notion.pages.create({
                    "parent": {
                        "type": "database_id",
                        "database_id": dbID
                    },
                    "properties": {
                        "Title": {
                            "title": [
                                {
                                    "text": {
                                        "content": title
                                    }
                                }
                            ]
                        },

                        "Tags": {
                            "multi_select": [
                                {
                                    "name": "New",
                                    "color": "default"
                                }

                            ]

                        }
                    },
                    "children": [
                        {
                            "object": "block",
                            "heading_1": {
                                "rich_text": [
                                    {
                                        "text": {
                                            "content": "AI Generated Links and Resources"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "object": "block",
                            "paragraph": {
                                "rich_text": [
                                    {
                                        "text": {
                                            "content": result
                                        },
                                        "href": ""
                                    }
                                ],
                                "color": "default"
                            }
                        }
                    ]
                });
                console.log(notionResp);
                socket.emit('notionPage', (notionResp) => {
                    notionResp
                })
                //    whatsappClient.sendMessage(groupId, response.url)
            }

        })

    }


    socket.on("createSession", (data) => {
        createWhatsappSession(socket);
    });

});




server.listen(port, () => {
    console.log("listening on :", port);
})

