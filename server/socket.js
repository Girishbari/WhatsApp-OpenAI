const { Client, LocalAuth } = require('whatsapp-web.js');
const { Client: NotionClient } = require("@notionhq/client")
const { initializeAgentExecutorWithOptions } = require("langchain/agents")
const { tools, llm } = require("./langchain/langchain")
const qrcode = require('qrcode-terminal');
// const {  groupName } = require("./router/routes");

const str = "a Person is a Youtuber which makes content around software and coding Give him good Content title, Good Resources links for research on topic: "

let groupId = '';



module.exports = (io) => {
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

            whatsappClient.on('ready', () => {
                console.log('Client is ready!');
                socket.emit("ready", { message: "Client is ready!" });
                whatsappClient.getChats().then((res) => {
                    const group = res.find((chat) => chat.name === 'Notes') // this need to take from user
                    console.log("groupdetails " + group)
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
                }

            })

        }
        socket.on("createSession", (data) => {
            createWhatsappSession(socket);
        });

    });

}