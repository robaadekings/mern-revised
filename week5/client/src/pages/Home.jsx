import {useEffect, useState} from 'react';
import {getRooms, createRoom, getMessages, socket} from '../services/api';
import ChatRoom from "../components/ChatRoom";


export default function Home( {user} ) {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        fetchRooms();
        socket.connect();

        socket.on('userJoined', (data) => {
            console.log(data.user.username + ' joined');
        });

        socket.on('userOffline', (username) => {
            console.log(username + ' went offline');
        });

        return () => socket.disconnect();
    }, []);
    
    const fetchRooms = async () => {
        try {
            const res = await getRooms();
            setRooms(res.data.rooms);
        } catch (err) {
            console.error('Failed to fetch rooms:', err);
        }
    };

    const handleJoinRoom = async (room) => {
        socket.emit('joinRoom', {  username: user.username, roomId: room._id });
        setCurrentRoom(room);
        try {
            const res = await getMessages(room._id);
            setMessages(res.data.messages);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const handleCreateRoom = async () => {
        if (newRoomName.trim()) {
            try {
                const res = await createRoom(newRoomName);
                setRooms([...rooms, res.data.room]);
                setNewRoomName('');
                setShowCreateRoom(false);
            } catch (err) {
                console.error('Failed to create room:', err);
            }
        }
    };

    return(
        <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Sidebar */}
            <aside className="w-80 bg-slate-800 text-white p-5 shadow-2xl flex flex-col border-r border-slate-700">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-lg text-white text-xl font-bold">
                  💬
                </div>
                <div>
                  <h1 className="text-xl font-bold">ChatHub</h1>
                  <p className="text-xs text-slate-400">Logged in as {user.username}</p>
                </div>
              </div>

              <div className="mb-4">
                {!showCreateRoom ? (
                  <button 
                    onClick={() => setShowCreateRoom(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  >
                    ➕ Create Room
                  </button>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder="Room name..."
                      className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                    />
                    <button 
                      onClick={handleCreateRoom}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => setShowCreateRoom(false)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Chat Rooms ({rooms.length})</h2>
              </div>

              <ul className="space-y-2 flex-1 overflow-y-auto">
                {rooms.length === 0 ? (
                  <li className="text-slate-400 text-sm text-center py-4">No rooms yet. Create one!</li>
                ) : (
                  rooms.map((room) => (
                    <li key={room._id}> 
                      <button 
                        onClick={() => handleJoinRoom(room)} 
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all transform ${
                          currentRoom?._id === room._id 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg scale-105' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        <div className="font-semibold text-sm">{room.name}</div>
                        <div className="text-xs text-slate-300 mt-1">ID: {room._id.slice(-6)}</div>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <button className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all mt-4">
                🚪 Logout
              </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-6">
                {currentRoom ? (
                    <>
                      <div className="mb-4 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
                        <h1 className="text-2xl font-bold text-white">{currentRoom.name}</h1>
                        <p className="text-slate-400 text-sm">Room ID: {currentRoom._id}</p>
                      </div>
                      <ChatRoom 
                        room={currentRoom} 
                        messages={messages} 
                        socket={socket} 
                        user={user}
                        setMessages={setMessages}
                      />
                    </>
                ): (
                     <div className="flex-1 flex items-center justify-center">
                       <div className="text-center">
                         <div className="text-6xl mx-auto mb-4">💬</div>
                         <h2 className="text-2xl font-bold text-slate-300 mb-2">Welcome to ChatHub</h2>
                         <p className="text-slate-400">Select a room from the sidebar or create a new one to get started!</p>
                       </div>
                     </div>
                )}

            </main>

        </div>
    )
}