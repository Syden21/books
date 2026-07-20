import Header from "../components/Header";
import SearchComponent from "../components/SearchComponent";
import Slider from "../components/Slider";
import Footer from "../components/Footer";
import SearchResults from "../components/search-book/SearchResults";

import map from "../assets/images/map.png";
import stackOfBooks from "../assets/stack-of-books-1.svg";
import booksImage from "../assets/stack-of-books-1.svg";
import { useState } from "react";
import { bookAPI } from "../services/api";

const Home = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (params: {
    title?: string;
    author?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    setError("");
    setIsSearching(true);
    try {
      const apiParams: any = {};
      if (params.title) apiParams.title = params.title;
      if (params.author) apiParams.author = params.author;
      if (params.startDate) apiParams.startDate = params.startDate;
      if (params.endDate) apiParams.endDate = params.endDate;

      const response = await bookAPI.search(apiParams);
      setBooks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setIsSearching(false);
    setBooks([]);
    setError("");
  };

  return (
    <>
      <div className="px-80">
        <Header onLogoClick={handleResetSearch} />
        <SearchComponent icon={booksImage} onSearch={handleSearch} />

        {isSearching && (
          <div className="mt-10">
            {loading && <div className="text-center">Загрузка...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {!loading && !error && books.length === 0 && (
              <div className="text-center mt-40 mb-50.25">
                <div className="flex flex-col gap-10">
                  <h2 className="text-[36px] font-semibold leading-[120%]">
                    По вашему запросу ничего не найдено
                  </h2>
                  <div className="w-[624px] self-center">
                    <p className="leading-[150%]">
                      К сожалению, по указанным данным книга не найдена.
                      Проверьте правильность написания или попробуйте изменить
                      параметры поиска (автор, название, дата).
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!loading && !error && books.length > 0 && (
              <SearchResults books={books} />
            )}
          </div>
        )}

        {!isSearching && (
          <>
            <div className="flex flex-col gap-10 mt-40">
              <p className="font-semibold text-[36px]">Выбор редкции</p>
              <div>
                <Slider />
              </div>
            </div>
          </>
        )}
      </div>

      {!isSearching && (
        <div className="flex gap-35.5 bg-[rgba(240,255,241,1) box-border border rounded-4xl w-full pl-80 pt-30 pr-71.25">
          <div className="flex flex-col gap-6">
            <h2 className="font-semibold text-4xl leading-[120%]">О нас</h2>
            <p className="flex flex-col gap-4 text-[16px] leading-[150%]">
              Наш сервис — это единый портал, соединяющий все крупнейшие и малые
              библиотеки Москвы. Здесь работают лучшие библиотекари, краеведы и
              историки города, бережно собирающие и описывающие книжные
              сокровища столицы. Через наш агрегатор вы сможете быстро найти
              любую книгу — от редких дореволюционных изданий до новинок
              современной литературы.
              <span>
                Достаточно ввести название или автора и система покажет, в каких
                библиотеках есть нужный экземпляр. Вы можете выбрать удобный
                филиал, забронировать книгу онлайн и забрать её в назначенное
                время.
              </span>
              <span>
                Сервис охватывает все округа Москвы, так что любимые книги
                всегда окажутся рядом.
              </span>
            </p>
          </div>
          <img src={stackOfBooks} alt="StackOfBooks" />
        </div>
      )}

      {!isSearching && (
        <div className="px-80">
          <div className="flex flex-col gap-10 mt-40">
            <p className="font-semibold text-[36px]">Новые поступления</p>
            <div>
              <Slider />
            </div>
          </div>
          <div className="flex flex-col gap-10 mt-40 mb-50">
            <p className="font-semibold text-[36px] leading-[120%]">
              Библиотеки Москвы
            </p>
            <img src={map} alt="Map of Moscow" />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Home;
