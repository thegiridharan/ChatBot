"use client"
import { useState } from 'react';
import axios from "axios";

export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    //Function to handle sending messages
    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try { 
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { message: input });

            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "assistant", content: response.data.reply }
            ]);
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='grid grid-flow-row grid-rows-5 h-[600px] w-[500px] mx-auto p-4 border rounded-lg shadow-lg'>
            <div className='overflow-y-auto border-b p-2 row-span-4'>
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 my-1 rounded-md ${msg.role === "user" ? "bg-blue-500 text-white text-right" : "bg-gray-200 text-black text-left"}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex items-center mt-2 row-span-1">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 p-2 border rounded-lg shadow-lg"
                    placeholder="Ask anything"
                />
                <button onClick={sendMessage} className="ml-2 p-2 px-[20px] bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700">
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    )
}