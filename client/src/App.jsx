import { useEffect, useState } from 'react'
import "./App.css"
import { NotionSetup, IntegrateNotion, IntegrateWhatsapp } from "./components/index"
import { Routes, Route } from "react-router-dom"


function App() {



  return (
    <div>
      <h2 className="font-semibold text-4xl text-center mt-10">Connect <span className='text-green-600'>

        WhatsApp</span>  with <span className='text-green-900'>NOTION</span>  <span className='font-normal text-xl text-gray-800'>POWERED BY OPENAI</span></h2>

      <div className="min-h-screen flex items-center justify-center">

        <div className="container max-w-screen-xl  mx-auto">

          <div className=''>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 h-[500px] ">
              <div className="grid gap-4 gap-y-10  text-lg grid-cols-1 lg:grid-cols-3">
                <div className='flex flex-col gap-5'>
                  <div className="text-gray-600">
                    <p className="font-medium text-lg"> 1. Notion Setup</p>
                    <p>Add the template into Your Notion workspace</p>
                  </div>
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">2. Notion DB and Integration</p>
                    <p>  <a href="https://www.youtube.com/watch?v=fBAt-0n3gQA" className="text-purple-600 visited:text-purple-950 ...">
                      LINK
                    </a> (Click on LINK for more details)</p>
                  </div>
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">3. Integrate WhatsApp</p>
                    <p> Connect WhatsApp </p>
                  </div>
                </div>

                <Routes>
                  <Route path="/" element={<NotionSetup />} />
                  <Route path="/notionintegration" element={<IntegrateNotion />} />
                  <Route path="/whatsappintegration" element={<IntegrateWhatsapp />} />
                </Routes>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default App
