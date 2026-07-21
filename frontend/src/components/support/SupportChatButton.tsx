import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { createSocket, authAPI, supportAPI } from "../../services/api";

interface Message {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  readAt: string | null;
}

const SupportChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [supportRequestId, setSupportRequestId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.profile();
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isOpen || !user || loading) return;

    let isMounted = true;

    const initializeChat = async () => {
      try {
        const response = await supportAPI.createRequest({
          text: "Здравствуйте! У меня вопрос.",
        });
        const requestData = response.data;
        const chatId = requestData.id;
        setSupportRequestId(chatId);

        const token = localStorage.getItem("access_token");
        if (token && isMounted) {
          const newSocket = createSocket(user.id, token);
          setSocket(newSocket);

          newSocket.on("connect", () => {
            newSocket.emit("subscribeToChat", { chatId });
          });

          newSocket.on("newMessage", (message: Message) => {
            setMessages((prev) => [...prev, message]);
          });

          newSocket.on("chatHistory", (history: Message[]) => {
            setMessages(history);
          });

          return () => {
            newSocket.disconnect();
          };
        }
      } catch (error) {
        console.error("Ошибка создания обращения:", error);
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setMessages([]);
      setSupportRequestId(null);
    };
  }, [isOpen, user, loading]);

  // Автоскролл
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !supportRequestId) return;

    try {
      await supportAPI.sendMessage(supportRequestId, { text: newMessage });
      setNewMessage("");
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-[rgba(255,195,62,1)] text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          <div className="bg-[rgba(214,234,216,1)] p-4 border-b">
            <h3 className="font-semibold text-lg">Чат техподдержки</h3>
            <p className="text-sm text-gray-600">
              Мы ответим в ближайшее время
            </p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                Напишите свой вопрос
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.author.id === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      msg.author.id === user.id
                        ? "bg-[rgba(255,195,62,1)] text-black"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {msg.author.name}
                    </div>
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 border-t flex gap-2 bg-gray-50"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[rgba(255,195,62,1)]"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-[rgba(255,195,62,1)] p-2 rounded-full hover:bg-[rgba(244,148,37,1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SupportChatButton;
