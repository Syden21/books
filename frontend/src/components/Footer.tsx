import vk from "../assets/social-vk.svg";
import youtube from "../assets/social-youtube.svg";
import odnoklassniki from "../assets/social-odnoklassniki.svg";
import tg from "../assets/social-telegram.svg";

const Footer = () => {
  return (
    <div className="flex justify-center bg-[rgba(240,255,241,1)] pt-10 border box-border rounded-[32px_32px_0_0]">
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-[36px] leading-[120%] mb-10.5">ЛОГО</h2>
        <div className="flex gap-6 mb-24.5">
          <a
            href=""
            className="bg-[rgba(106,163,120,1)] p-[12.5px] box-border border rounded-[35px] hover:bg-[rgba(255,195,62,1)]"
          >
            <img src={vk} alt="VK" className="w-11.25 h-11.25" />
          </a>
          <a
            href=""
            className="bg-[rgba(106,163,120,1)] p-[12.5px] box-border border rounded-[35px] hover:bg-[rgba(255,195,62,1)]"
          >
            <img src={tg} alt="TG" className="w-11.25 h-11.25" />
          </a>
          <a
            href=""
            className="bg-[rgba(106,163,120,1)] p-[12.5px] box-border border rounded-[35px] hover:bg-[rgba(255,195,62,1)]"
          >
            <img src={youtube} alt="YouTube" className="w-11.25 h-11.25" />
          </a>
          <a
            href=""
            className="bg-[rgba(106,163,120,1)] p-[12.5px] box-border border rounded-[35px] hover:bg-[rgba(255,195,62,1)]"
          >
            <img
              src={odnoklassniki}
              alt="Odnoklassniki"
              className="w-11.25 h-11.25"
            />
          </a>
        </div>
        <p className="font-light text-[12px] leading-[120%] mb-10">
          Политика обработки персональных данных
        </p>
      </div>
    </div>
  );
};

export default Footer;
