import {
  BookMarked,
  House,
  LibraryBig,
  LogOut,
  SquareCheck,
  UserRound,
} from "lucide-react";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { borrowings } from "../../constants/reservations";

const MyBooks = () => {
  const [activeItem, setActiveItem] = useState("Мои книги");
  const [activeTabItem, setActiveTabItem] = useState("Все");
  const navigate = useNavigate();

  const filteredData = borrowings.filter((item) => {
    if (activeTabItem === "Все") return true;
    if (activeTabItem === "Забронирована")
      return item.status === "active" || item.status === "reserved";
    if (activeTabItem === "Возвращена") return item.status === "completed";
    return true;
  });

  const menuItems = [
    { id: "Главная", icon: House, path: "/profile" },
    { id: "Мои книги", icon: LibraryBig, path: "/profile/my-books" },
    { id: "Профиль", icon: UserRound, path: "/profile/info" },
  ];

  const tabItems = [
    { id: "Все" },
    { id: "Забронирована", icon: BookMarked },
    { id: "Возвращена", icon: SquareCheck },
  ];

  const handleMenuItemClick = (item: { id: string; path: string }) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  //const getInitial = (author: string) => {
  //  return author.charAt(0).toUpperCase();
  //};

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
        <h2 className="font-semibold text-[36px] leading-[120%]">Мои книги</h2>

        <div className="mt-[65px]">
          <ul className="flex gap-8">
            {tabItems.map((item) => (
              <li
                key={item.id}
                className={`tab-item flex gap-2 cursor-pointer leading-[120%] ${activeTabItem === item.id ? "text-[rgba(244,148,37,1)] active" : "text-black"}`}
                onClick={() => setActiveTabItem(item.id)}
              >
                {item.icon && <item.icon />}
                {item.id}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden border rounded-[16px]">
          <table className="max-w-[872px] divide-y divide-[rgba(147,164,151,1)]">
            <thead className="bg-[rgba(214,234,216,1)]">
              <tr>
                <th
                  className="leading-[120%] font-semibold text-[16px] text-center"
                  style={{ color: "rgb(147, 164, 151)" }}
                >
                  ID
                </th>
                <th
                  className="leading-[120%] font-semibold text-[16px] text-left pr-[25px]"
                  style={{ color: "rgb(147, 164, 151)" }}
                >
                  Обложка
                </th>
                <th
                  className="leading-[120%] font-semibold text-[16px] text-left py-4"
                  style={{ color: "rgb(147, 164, 151)" }}
                >
                  Название книги / автор
                </th>
                <th
                  className="leading-[120%] font-semibold text-[16px] text-left pl-[87px]"
                  style={{ color: "rgb(147, 164, 151)" }}
                >
                  Библиотека
                </th>
                <th
                  className="leading-[120%] font-semibold text-[16px] text-left"
                  style={{ color: "rgb(147, 164, 151)" }}
                >
                  Выдача
                </th>
                <th
                  className="leading-[120%] font-semibold text-[16px] text-left"
                  style={{ color: "rgb(147, 164, 151)" }}
                >
                  Возврат
                </th>
                <th
                  className="leading-[120%] font-semibold text-[16px] text-left"
                  style={{ color: "rgb(147, 164, 151)" }}
                >
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${index % 2 === 0 ? "bg-[rgb(255,254,240)]" : "bg-[rgb(240,255,241)]"}`}
                >
                  <td
                    className="leading-[120%] font-semibold text-[16px] text-center px-5"
                    style={{ color: "rgb(147, 164, 151)" }}
                  >
                    {item.id}
                  </td>
                  <td className="pr-[15px] py-4 whitespace-nowrap">
                    <div className="w-20 h-[125px] bg-blue-100 text-blue-700 font-bold">
                      <img
                        src={item.image}
                        alt="Image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="pl-[10px] py-4 text-sm w-1/5 leading-[130%]">
                    <div>{item.bookTitle} /</div>
                    <div>{item.author}</div>
                  </td>
                  <td className="pl-[87px] py-4 text-sm text-gray-500 max-w-xs">
                    <div className="flex items-center gap-1">
                      <span>{item.library}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {item.dateStart}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {item.dateEnd}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      <span className="capitalize">
                        {item.status === "active" ||
                        item.status === "reserved" ? (
                          <BookMarked />
                        ) : (
                          <SquareCheck />
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Нет книг в этом разделе
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
