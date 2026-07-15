import { useEffect, useState } from "react";
import LoginPopup from "./autorization/LoginPopup";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
  };

  return (
    <div className="flex justify-between items-center mt-10">
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[rgba(106,163,120,1)] flex items-center justify-center text-white font-bold">
              {user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <span>Здесь могла быть ваша картинка</span>
              )}
            </div>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        ) : (
          <button
            className="font-semibold w-46.5 box-border border border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(106,163,120,1)] gap-2.5 px-6 py-4 cursor-pointer hover:shadow-none active:shadow-none active:bg-[rgba(35,104,91,1)] disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed disabled:shadow-none"
            onClick={() => setIsOpen(true)}
          >
            Вход
          </button>
        )}
      </div>

      <p className="font-bold text-4xl leading-[120%] text-left cursor-pointer">
        ЛОГО
      </p>
      <ul className="flex gap-8 cursor-pointer font-semibold text-[16px] leading-[120%] text-left">
        <li>Библиотеки</li>
        <li>О нас</li>
        <li>Контакты</li>
      </ul>

      <LoginPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Header;
