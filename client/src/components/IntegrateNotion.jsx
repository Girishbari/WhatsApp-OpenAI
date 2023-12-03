import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


export default function IntegrateNotion() {
    const navigate = useNavigate();
    const endPoint = `http://localhost:3000/getNotionDetail`;
    const dataRef = useRef({
        dbID: "",
        NOTION_TOKEN: "",
        groupName: ""
    })

    const handleSubmit = async () => {
        if (dataRef.current.dbID == '' || dataRef.current.NOTION_TOKEN == '' || dataRef.current.groupName == '') {
            toast.warning("All Field are Neccessary !", {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            });
        } else {
            console.log(dataRef)
            axios.post(`${endPoint}`, {
                dbID: dataRef.current.dbID,
                NOTION_TOKEN: dataRef.current.NOTION_TOKEN,
                groupName: dataRef.current.groupName
            }).then((res) => {
                console.log(res)
                setTimeout(() => {
                    navigate("/whatsappintegration")
                }, 2000)
                toast.success("Data Updated !", {
                    position: toast.POSITION.TOP_CENTER,
                    draggable: false
                });

            })


        }
    }


    return (

        <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold">Notion DB and Integration</h1>

            <div className="grid gap-4 gap-y-2 text-xl mt-5  md:grid-cols-5">
                <div className="md:col-span-5">

                    <label >Database ID</label>
                    <input type="text"
                        onChange={(e) => dataRef.current.dbID = e.target.value}
                        defaultValue={dataRef.current.dbID}
                        name="full_name" id="full_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                </div>
                <div className="md:col-span-5">
                    <label >Notion Token</label>
                    <input type="text"
                        onChange={(e) => dataRef.current.NOTION_TOKEN = e.target.value}
                        defaultValue={dataRef.current.NOTION_TOKEN}
                        name="full_name" id="full_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                </div>
                <div className="md:col-span-5">
                    <label >WhatsApp Group name <span className="text-lg font-light"> (make one where you generally send your notes)</span> </label>
                    <input type="text"
                        onChange={(e) => dataRef.current.groupName = e.target.value}
                        name="full_name" id="full_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" defaultValue={dataRef.current.groupName} />
                </div>

                <div className="md:col-span-5 text-left">
                    <div className="inline-flex items-start">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-16 rounded">Submit</button>
                        <ToastContainer />
                    </div>
                </div>

            </div>
        </div>
    )
}