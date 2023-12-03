import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function NotionSetup() {
    const navigate = useNavigate();

    return (

        <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold">Notion Setup</h1>
            <div className="grid gap-4 gap-y-4 text-xl mt-8 md:grid-cols-2">
                <div className="flex gap-2">
                    <p> How to --{`>`}</p>
                    <a
                        href="https://youtu.be/qTfv8ds3aqc"
                        target="_blank"
                        className="text-purple-950 visited:text-purple-600 ...">
                        Link
                    </a>
                </div>
                <div className="flex gap-2">
                    <p> Notion Template --{`>`}</p>
                    <a

                        href="https://political-pencil-5b5.notion.site/d4b4bdd4e4234a4fbdaf3352c2fd180d?v=582a57e3c61b40eea5c4dc6cd4ee5563&pvs=4"
                        target="_blank"
                        className="text-purple-950 visited:text-purple-600 ...">
                        Click me
                    </a>
                </div>

                <div className="inline-flex items-end">
                    <button
                        onClick={() => navigate("/notionintegration")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-32  rounded" >
                        Done
                    </button>
                </div>
            </div>

        </div>
    )
}