import { House, LibraryBig, LogOut, UserRound } from "lucide-react";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/api";

const Menu = () => {
  const [activeItem, setActiveItem] = useState("Мои книги");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "Главная", icon: House, path: "/profile" },
    { id: "Мои книги", icon: LibraryBig, path: "/profile/my-books" },
    { id: "Профиль", icon: UserRound, path: "/profile/info" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.profile();
        setUser(response.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/profile") setActiveItem("Главная");
    else if (path === "/profile/my-books") setActiveItem("Мои книги");
    else if (path === "/profile/info") setActiveItem("Профиль");
  }, [location]);

  const handleMenuItemClick = (item: { id: string; path: string }) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  return (
    <div className="ml-[319px] bg-[rgba(214,234,216,1)] box-border rounded-[32px] border w-[329px] h-[914px]">
      <div className="px-[75px] pt-10 flex flex-col items-center gap-4 mb-10">
        <Avatar name={user?.name || "Пользователь"} size="xxl" />
        <p className="font-semibold text-[16px] leading-[120%]">
          Привет, {user?.name || "Пользователь"}
        </p>
      </div>
      <div className="pl-8">
        <ul className="flex flex-col gap-8">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`flex gap-4 cursor-pointer ${activeItem === item.id ? "text-[rgba(244,148,37,1)]" : "text-black"}`}
              onClick={() => handleMenuItemClick(item)}
            >
              <item.icon />
              {item.id}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[387px] flex pl-8">
        <button className="flex gap-4 items-center cursor-pointer">
          <LogOut size={24} />
          Выйти
        </button>
      </div>
      <span className="font-bold text-[36px] leading-[120%] flex justify-center mt-[50px]">
        ЛОГО
      </span>
    </div>
  );
};

export default Menu;
