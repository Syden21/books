import { useState } from "react";
import { BookCheck } from "lucide-react";
import BookReservationCard from "../components/book-reservatin/BookReservationCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface BookReservationProps {
  image?: string;
  title?: string;
  author?: string;
  publicationYear?: string;
  description?: string;
  alt?: string;
  library?: [];
}

//${selectedVariant === library.id ? "bg-[rgba(255,254,240,1)] shadow-none" : "shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(240,255,241,1)]"}

const BookReservation = ({
  image,
  title,
  author,
  publicationYear,
  description,
  alt,
  //library,
}: BookReservationProps) => {
  //const [selectedVariant, setSelectedVariant] = useState(null);
  const [inputDate, setInputDate] = useState("");

  return (
    <>
      <div className="px-80">
        <Header />
        <h2 className="mt-30 mb-16 text-center font-semibold text-[36px] leading-[120%]">
          Бронирование книги {title}
        </h2>
        <div className="flex justify-center mb-30">
          <BookReservationCard
            image={image}
            title={title}
            author={author}
            publicationYear={publicationYear}
            description={description}
            alt={alt}
          />
        </div>
        <div className="flex flex-col gap-10 mb-30">
          <h2 className="font-semibold text-[36px] leading-[120%]">
            Выберите библиотеку
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              //onClick={() => setSelectedVariant(library.id)}
              className={`w-101.25 flex gap-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(240,255,241,1)] hover:shadow-none cursor-pointer selected disabled:bg-[rgba(152,164,155,1)] disabled:cursor-not-allowed pt-4 pl-6 pr-4 pb-5  box-border border rounded-4xl`}
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold leading-[120%] text-pretty">
                  Библиотека № 151 имени Е.И. Чарушина
                </h2>
                <h3 className="leading-[120%] text-[rgba(105,120,108,1)]">
                  Трубниковский пер., д. 17
                </h3>
              </div>
              <div className="flex gap-2">
                <BookCheck size={24} />
                <h5>0/4</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 mb-40">
          <h2 className="font-semibold text-[36px] leading-[120%]">
            Выберите период бронирования
          </h2>
          <div className="flex justify-between gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold leading-[120%]">Выдача книги</h4>
              <input
                value={inputDate}
                id="distribDate"
                type="date"
                className="w-156 font-normal text-[rgba(147,164,151,1)] box-border border rounded-2xl bg-[rgba(255,254,240,1)] px-6 py-4 focus:text-[rgb(0,0,0)]"
                onChange={(e) => setInputDate(e.target.value)}
                placeholder="Выберите дату"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold leading-[120%]">Возврат книги</h4>
              <input
                value={inputDate}
                id="distribDate"
                type="date"
                className="w-156 font-normal text-[rgba(147,164,151,1)] box-border border rounded-2xl bg-[rgba(255,254,240,1)] px-6 py-4 focus:text-[rgb(0,0,0)]"
                onChange={(e) => setInputDate(e.target.value)}
                placeholder="Выберите дату"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-50">
          <button className="font-semibold w-101.5 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer self-center rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed">
            Подтвердить бронирование
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookReservation;
