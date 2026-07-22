import SupportChatButton from "./components/SupportChat";
import Menu from "./components/Menu";

const UserProfile = () => {
  return (
    <>
      <div className="flex gap-20">
        <Menu />

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
                Сейчас у вас{" "}
                <span className="text-[22px] font-semibold">3</span> активных
                бронирования
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
      <SupportChatButton />
    </>
  );
};

export default UserProfile;
