import plural from "plural-ru";

interface SearchBookCardProps {
  author: string;
  year: number;
  description: string;
  image: string;
  alt: string;
  library: number;
}

const SearchBookCard = ({
  author,
  year,
  description,
  image,
  alt,
  library,
}: SearchBookCardProps) => {
  return (
    <div className="bg-[rgba(255,254,240,1)] box-border rounded-4xl border px-8 py-8 w-101.25 h-103.5 max-w-full flex flex-col">
      <div className="flex gap-9.5">
        <img src={image} alt={alt} className="w-25 h-35 object-cover" />
        <div>
          <h2 className="font-semibold text-[18px] leading-[120%] mb-4">
            JavaScript для детей
          </h2>
          <div className="flex flex-col gap-2 mb-13.5">
            <div className="flex gap-4 items-center">
              <p className="text-[rgba(147,164,151,1)] text-[14px] leading-[120%] self-start">
                Автор:{" "}
              </p>
              <h2 className="text-[14px] leading-[120%]">{author}</h2>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-[rgba(147,164,151,1)] text-[14px] leading-[120%]">
                Год:{" "}
              </p>
              <h2 className="text-[14px] leading-[120%]">{year}</h2>
            </div>
            <div className="flex gap-1 flex-col">
              <p className="text-[rgba(147,164,151,1)] text-[14px] leading-[120%]">
                Описание:{" "}
              </p>
              <p className="text-[14px] leading-[120%]">{description}</p>
            </div>
            <p className="text-[rgba(147,164,151,1)] text-[14px] leading-[120%]">
              Доступна в {plural(library, "%d библиотеке", "%d библиотеках")}
            </p>
          </div>
        </div>
      </div>
      <button
        className="font-semibold w-89.25 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed"
        disabled={library === 0}
      >
        Забронировать
      </button>
    </div>
  );
};

export default SearchBookCard;
