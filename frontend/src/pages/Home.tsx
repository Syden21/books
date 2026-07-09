import Header from "../components/Header";
import SearchComponent from "../components/SearchComponent";
import Slider from "../components/Slider";
import Footer from "../components/Footer";

import map from "../assets/images/map.png";
import stackOfBooks from "../assets/stack-of-books-1.svg";
import books from "../assets/stack-of-books-1.svg";
//import bgImage from "../assets/amorphous-shape-3.svg";

const Home = () => {
  return (
    <>
      <div className="px-80">
        <Header />
        <SearchComponent icon={books} />
        <div className="flex flex-col gap-10 mt-40">
          <p className="font-semibold text-[36px]">Выбор редкции</p>
          <div>
            <Slider />
          </div>
        </div>
      </div>
      <div className="flex gap-35.5 bg-[rgba(240,255,241,1) box-border border rounded-4xl w-full pl-80 pt-30 pr-71.25">
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-4xl leading-[120%]">О нас</h2>
          <p className="flex flex-col gap-4 text-[16px] leading-[150%]">
            Наш сервис — это единый портал, соединяющий все крупнейшие и малые
            библиотеки Москвы. Здесь работают лучшие библиотекари, краеведы и
            историки города, бережно собирающие и описывающие книжные сокровища
            столицы. Через наш агрегатор вы сможете быстро найти любую книгу —
            от редких дореволюционных изданий до новинок современной литературы.
            <span>
              Достаточно ввести название или автора и система покажет, в каких
              библиотеках есть нужный экземпляр. Вы можете выбрать удобный
              филиал, забронировать книгу онлайн и забрать её в назначенное
              время.
            </span>
            <span>
              Сервис охватывает все округа Москвы, так что любимые книги всегда
              окажутся рядом.
            </span>
          </p>
        </div>
        <img src={stackOfBooks} alt="StackOfBooks" />
      </div>
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
      <Footer />
    </>
  );
};

export default Home;
