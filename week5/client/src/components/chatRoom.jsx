import { useEffect, useRef, useState } from 'react';


export default function ChatRoom( {room, messages, socket, user, setMessages} ) {
    const [chat, setChat] = useState("");
    const [typingUsers, setTypingUsers] = useState("");
    const [localMessages, setLocalMessages] = useState(messages);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setLocalMessages(messages);
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleNewMessage = (msg) => {
            setLocalMessages(prev => [...prev, msg]);
            scrollToBottom();
        };

        const handleTyping = (data) => {
            if (data.username !== user.username) {
                setTypingUsers(data.username);
            }
        };

        const handleStopTyping = () => {
            setTypingUsers("");
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
        };
    }, [user.username, socket]);

    const handleTyping = () => {
        socket.emit("typing", { username: user.username, roomId: room._id });
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { username: user.username, roomId: room._id });
        }, 2000);
    };

    const handleSend = () => {
        if (chat.trim()) {
            socket.emit("sendMessage", { content: chat, roomId: room._id });
            setChat("");
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            socket.emit("stopTyping", { username: user.username, roomId: room._id });
        }
    };

    const getInitials = (username) => {
        return username.charAt(0).toUpperCase();
    };

    const getAvatarColor = (username) => {
        const colors = [
            'bg-blue-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-indigo-500',
            'bg-cyan-500'
        ];
        const index = username.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-800 to-slate-700">
                {localMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 text-center">
                            <span className="text-3xl mb-2 block">💬</span>
                            No messages yet. Start the conversation!
                        </p>
                    </div>
                ) : (
                    localMessages.map((msg) => (
                        <div 
                            key={msg._id} 
                            className={`flex gap-3 ${msg.sender?.username === user.username ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender?.username !== user.username && (
                                <div className={`w-10 h-10 rounded-full ${getAvatarColor(msg.sender?.username)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                    {getInitials(msg.sender?.username)}
                                </div>
                            )}
                            
                            <div className={msg.sender?.username === user.username ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
                                {msg.sender?.username !== user.username && (
                                    <span className="text-xs text-slate-400 mb-1 font-semibold">{msg.sender?.username}</span>
                                )}
                                <div 
                                    className={`px-4 py-3 rounded-2xl max-w-xs lg:max-w-md break-words shadow-lg ${
                                        msg.sender?.username === user.username
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                                            : 'bg-slate-600 text-slate-100 rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.content || msg.text}</p>
                                </div>
                                <span className="text-xs text-slate-500 mt-1">
                                    {formatTime(msg.createdAt)}
                                </span>
                            </div>

                            {msg.sender?.username === user.username && (
                                <div className={`w-10 h-10 rounded-full ${getAvatarColor(user.username)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                    {getInitials(user.username)}
                                </div>
                            )}
                        </div>
                    ))
                )}

                {/* Typing Indicator */}
                {typingUsers && (
                    <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 rounded-full ${getAvatarColor(typingUsers)} flex items-center justify-center text-white font-bold text-sm`}>
                            {getInitials(typingUsers)}
                        </div>
                        <div className="flex items-center gap-1 bg-slate-600 px-4 py-2 rounded-2xl">
                            <span className="text-xs text-slate-300">{typingUsers} is typing</span>
                            <div className="flex gap-1 ml-2">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-slate-700 border-t border-slate-600 p-4">
                <div className="flex gap-3">
                    <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 text-xl">
                        📎
                    </button>
                    
                    <input 
                        className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                        value={chat}
                        onChange={(e) => setChat(e.target.value)}
                        onKeyDown={(e) => {
                            handleTyping();
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type your message here..."
                    />

                    <button 
                        onClick={handleSend}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!chat.trim()}
                    >
                        ✈️
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

