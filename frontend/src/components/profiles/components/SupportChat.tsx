import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Search,
  EllipsisVertical,
  Paperclip,
  Smile,
  SendHorizonal,
} from "lucide-react";
import { createSocket, authAPI, supportAPI } from "../../../services/api";

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
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

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
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !user || loading) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setMessages([]);
        setSupportRequestId(null);
      }
      return;
    }

    const initializeChat = async () => {
      try {
        const response = await supportAPI.createRequest({
          text: "Здравствуйте! У меня вопрос.",
        });
        const requestData = response.data;
        const chatId = requestData.id;
        setSupportRequestId(chatId);

        const token = localStorage.getItem("access_token");
        if (token && isMountedRef.current) {
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
        }
      } catch (error) {
        console.error("Ошибка создания обращения:", error);
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setMessages([]);
      setSupportRequestId(null);
    };
  }, [isOpen, user, loading]);

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

  const handleClose = () => {
    setIsOpen(false);
  };

  //if (loading || !user) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "bg-black/50 opacity-100"
            : "bg-black/0 opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-[rgba(255,195,62,1)] text-black text-center p-4 rounded-full border cursor-pointer shadow-[2px_2px_0_0] hover:shadow-none transition-all duration-300 hover:scale-110 w-[60px] h-[60px] active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={24} />}
      </button>

      <div
        className={`fixed bottom-24 right-8 z-50 mb-2 h-[650px] w-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 ease-out ${
          isOpen
            ? "translate-y-0 opacity-100 transition-all duration-1000 ease-out"
            : "translate-y-full opacity-0 pointer-events-none transition-all duration-1000 ease-out"
        }`}
        style={{ transformOrigin: "bottom center" }}
      >
        <div className="bg-[rgba(214,234,216,1)] p-4 border-b">
          <div className="flex justify-between px-4 items-center">
            <h4 className="font-bold text-[16px] leading-[120%]">LOGO</h4>
            <h2 className="font-semibold text-[16px] leading-[120%]">
              Техподдержка
            </h2>
            <div className="flex gap-[11px] items-center">
              <Search size={20} color="rgba(106,163,120,1)" />
              <EllipsisVertical size={20} color="rgba(106,163,120,1)" />
            </div>
          </div>
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
          <div className="flex items-center w-full">
            <Paperclip size={20} color="rgba(106,163,120,1)" className="mr-4" />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Сообщение..."
              className="w-full"
            />
            <div className="flex gap-3 pr-4">
              <Smile size={24} color="rgba(106,163,120,1)" />
              <SendHorizonal
                size={24}
                color="black"
                fill="rgba(106,163,120,1)"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SupportChatButton;
