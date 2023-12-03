import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import io from "socket.io-client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let socket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });


export default function IntegrateWhatsapp() {

    const [qrCode, setQrCode] = useState("");
    const [disable, setDisable] = useState(false);
    socket.on("qr", (data) => {
        const { qr } = data;
        console.log("QR RECEIVED", qr);
        setQrCode(qr)
    });

    socket.on("ready", () => {
        toast.success("All Set, Try Sending Message!", {
            position: toast.POSITION.TOP_CENTER,
            draggable: false
        });
    })

    const handleSubmit = () => {
        setDisable(true)
        socket.emit("createSession", () => {
            toast.loading("All Set, Getting QRCODE!", {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            });
        }
        )

    }


    return (

        <div class="lg:col-span-2">
            <h1 className="text-4xl font-bold">Integrate Whatsapp <span className="text-lg font-normal"> (Scan the QR code)</span> </h1>
            <div className="grid gap-4 gap-y-2 text-xl mt-5  md:flex flex-col">
                {!qrCode ? (
                    <div class="animate-pulse rounded-sm bg-slate-300 h-72 w-80"></div>
                ) : (
                    <QRCode value={qrCode} className="" />
                )}
                <div className="md:col-span-5 text-left">
                    <div className="inline-flex items-start">
                        {!disable ? (
                            <button
                                onClick={handleSubmit}
                                className="bg-red-500  text-white font-bold py-2 px-4 mt-5 rounded">Click to get QRCode</button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="bg-red-500  disabled:bg-red-200 text-white font-bold py-2 px-4 mt-5 animate- rounded" disabled>
                                Click to get QRCode
                            </button>
                        )}


                        <ToastContainer />
                    </div>
                </div>

            </div>
        </div>
    )
}