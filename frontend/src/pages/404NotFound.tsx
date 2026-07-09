import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="font-extrabold text-[36px] leading-[130%] tracking-[6%] -mb-17.5">
          Ошибка
        </div>

        <h1 className="text-[rgba(35,104,91,1)] text-[300px] font-extrabold leading-91.5 tracking-[6%] text-stroke-3">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Упс, кажется что-то пошло не так
        </h2>

        <Link
          to="/"
          className="inline-block px-8 py-3 bg-[rgba(255,195,62,1)] text-gray-800 font-medium rounded-xl border shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 active:shadow-none active:translate-y-1 transition-all duration-200"
        >
          На главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
