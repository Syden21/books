import { House, LibraryBig, LogOut, UserRound } from "lucide-react";
import Avatar from "./Avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [activeItem, setActiveItem] = useState("Главная");
  const navigate = useNavigate();

  const menuItems = [
    { id: "Главная", icon: House, path: "/profile" },
    { id: "Мои книги", icon: LibraryBig, path: "/profile/my-books" },
    { id: "Профиль", icon: UserRound, path: "/profile/info" },
  ];

  const handleMenuItemClick = (item: { id: string; path: string }) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  return (
    <div className="flex gap-20">
      <div className="ml-[319px] bg-[rgba(214,234,216,1)] box-border rounded-[32px] border w-[329px] h-[914px]">
        <div className="px-[75px] pt-10 flex flex-col items-center gap-4 mb-10">
          <Avatar name="Иванов Иван Иванович" size="xxl" />
          <p className="font-semibold text-[16px] leading-[120%]">
            Привет, Иван
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

      <div className="pt-10 flex flex-col gap-[65px]">
        <h2 className="font-semibold text-[36px] leading-[120%]">
          Добро пожаловать в личный кабинет!
        </h2>

        <div className="box-border border rounded-[32px] bg-[rgba(240,255,241,1)] pt-8 max-w-[515px] flex flex-col gap-10">
          <div className="flex flex-col gap-4 pl-8">
            <h3 className="leading-[120%]">
              Вы забронировали{" "}
              <span className="text-[22px] font-semibold">12</span> книг
            </h3>
            <h3 className="leading-[120%]">
              Сейчас у вас <span className="text-[22px] font-semibold">3</span>{" "}
              активных бронирования
            </h3>
          </div>

          <div className="flex gap-8 px-[45px] pb-8">
            <button className="font-semibold px-6 w-full py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed">
              Перейти к броням
            </button>
            <button className="font-semibold box-border w-full border border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(106,163,120,1)] gap-2.5 px-6 py-4 cursor-pointer hover:shadow-none active:shadow-none active:bg-[rgba(35,104,91,1)] disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed disabled:shadow-none">
              Найти книгу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
