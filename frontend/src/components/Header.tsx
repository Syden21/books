import { useState } from "react";
import LoginPopup from "./autorization/LoginPopup";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mt-10">
      <button
        className="font-semibold w-46.5 box-border border border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(106,163,120,1)] gap-2.5 px-6 py-4 cursor-pointer hover:shadow-none active:shadow-none active:bg-[rgba(35,104,91,1)] disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed disabled:shadow-none"
        onClick={() => setIsOpen(true)}
      >
        Вход
      </button>
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
