import { BookMarked, SquareCheck } from "lucide-react";
import { useEffect, useState } from "react";
import SupportChatButton from "./components/SupportChat";
import Menu from "./components/Menu";
import { rentalAPI } from "../../services/api";

const MyBooks = () => {
  const [activeTabItem, setActiveTabItem] = useState("Все");
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await rentalAPI.getMyRentals();
        setRentals(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки бронирований");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const filteredData = rentals.filter((item) => {
    if (activeTabItem === "Все") return true;
    if (activeTabItem === "Забронирована")
      return item.status === "active" || item.status === "reserved";
    if (activeTabItem === "Возвращена") return item.status === "completed";
    return true;
  });

  const tabItems = [
    { id: "Все" },
    { id: "Забронирована", icon: BookMarked },
    { id: "Возвращена", icon: SquareCheck },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Загрузка...
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-20">
        <Menu />

        <div className="pt-10 flex flex-col gap-[65px] mb-[35px]">
          <h2 className="font-semibold text-[36px] leading-[120%]">
            Мои книги
          </h2>

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
                    className="leading-[120%] font-semibold text-[16px] text-center px-5"
                    style={{ color: "rgb(147, 164, 151)" }}
                  >
                    ID
                  </th>
                  <th
                    className="leading-[120%] font-semibold text-[16px] text-left pr-[15px] py-4"
                    style={{ color: "rgb(147, 164, 151)" }}
                  >
                    Обложка
                  </th>
                  <th
                    className="leading-[120%] font-semibold text-[16px] text-left pl-[10px] py-4"
                    style={{ color: "rgb(147, 164, 151)" }}
                  >
                    Название книги / автор
                  </th>
                  <th
                    className="leading-[120%] font-semibold text-[16px] text-left pl-[87px] py-4"
                    style={{ color: "rgb(147, 164, 151)" }}
                  >
                    Библиотека
                  </th>
                  <th
                    className="leading-[120%] font-semibold text-[16px] text-left px-6 py-4"
                    style={{ color: "rgb(147, 164, 151)" }}
                  >
                    Выдача
                  </th>
                  <th
                    className="leading-[120%] font-semibold text-[16px] text-left px-6 py-4"
                    style={{ color: "rgb(147, 164, 151)" }}
                  >
                    Возврат
                  </th>
                  <th
                    className="leading-[120%] font-semibold text-[16px] text-left px-6 py-4"
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
                          alt="Обложка"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="pl-[10px] py-4 text-sm w-1/5 leading-[130%]">
                      <div>{item.bookTitle || "Книга"} /</div>
                      <div>{item.author || "Автор"}</div>
                    </td>
                    <td className="pl-[87px] py-4 text-sm text-gray-500 max-w-xs">
                      <div className="flex items-center gap-1">
                        <span>{item.library || "Библиотека"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {new Date(item.dateStart).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {new Date(item.dateEnd).toLocaleDateString()}
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
        <SupportChatButton />
      </div>
    </>
  );
};

export default MyBooks;
