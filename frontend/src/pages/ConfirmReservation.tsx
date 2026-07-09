import books from "../assets/books.svg";
import map from "../assets/images/map.png";

import { BookOpen, CalendarDays, MapPin } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ConfirmReservation = () => {
  return (
    <>
      <div className="px-80 mb-50">
        <Header />

        <div className="flex flex-col gap-16 mt-26.75">
          <h2 className="font-semibold text-[36px] leading-[120%] text-center">
            Бронирование успешно оформлено!
          </h2>

          <div className="flex gap-34.75">
            <img src={books} alt="Books" />

            <div className="flex flex-col gap-6">
              <h2 className="leading-[120%]">
                Книга будет ожидать вас в выбранной библиотеке.
              </h2>

              <div className="flex flex-col w-156 gap-8 box-border border bg-[rgba(214,234,216,1)] rounded-4xl pt-8 pl-8 pb-13.25 pr-23.25">
                <div className="flex gap-6">
                  <BookOpen size={24} color="rgb(106,163,120)" />
                  <p className="leading-[120%]">
                    <span className="font-semibold">Javascript для детей</span>{" "}
                    <span> / Ник Морган</span>
                  </p>
                </div>
                <div className="flex gap-6">
                  <MapPin size={24} color="rgb(106,163,120)" />
                  <p className="leading-[120%]">
                    <span className="font-semibold">
                      Библиотека им. Некрасова
                    </span>{" "}
                    <span> / ул. Бауманская, д. 58/25</span>
                  </p>
                </div>
                <div className="flex gap-6">
                  <CalendarDays size={24} color="rgb(106,163,120)" />
                  <p className="leading-[120%]">
                    <span>Дата получения: </span>
                    <span className="font-semibold">12.09.2025</span>
                    <span> / </span>
                    <span>Дата возврата: </span>
                    <span className="font-semibold">26.09.2025</span>
                  </p>
                </div>
              </div>

              <h2 className="leading-[120%] mb-4">
                Пожалуйста, заберите книгу в указанный срок. Если вы не успеете,
                бронь автоматически снимется
              </h2>

              <div className="flex gap-8 items-center">
                <button className="font-semibold w-full px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed">
                  Найти другую книгу
                </button>
                <button className="font-semibold w-full box-border border border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(106,163,120,1)] gap-2.5 px-6 py-4 cursor-pointer hover:shadow-none active:shadow-none active:bg-[rgba(35,104,91,1)] disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed disabled:shadow-none">
                  Мои бронирования
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 mt-40">
            <h2 className="font-semibold text-[36px] leading-[120%]">
              Библиотека на карте
            </h2>

            <img src={map} alt="Map" className="relative" />
            <MapPin
              size={40}
              className="absolute top-278 left-274"
              fill="rgb(244,148,37)"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ConfirmReservation;
