interface BookCardProps {
  author: string;
  year: number;
  description: string;
  image: string;
  alt: string;
  library: string;
}

const BookCard = ({
  author,
  year,
  description,
  image,
  alt,
  library,
}: BookCardProps) => {
  return (
    <div className="bg-[rgba(255,254,240,1)] box-border rounded-4xl border px-8 py-8 w-128.75 h-121.5 max-w-full flex flex-col justify-between">
      <div className="flex gap-9.5">
        <img src={image} alt={alt} className="w-35 h-48.5 object-cover" />
        <div>
          <h2 className="font-semibold text-[18px] leading-[120%] mb-4">
            JavaScript для детей
          </h2>
          <div className="flex flex-col gap-2 mb-13.5">
            <div className="flex gap-4 items-center">
              <p className="text-[rgba(147,164,151,1)] text-[16px] leading-[120%] self-start">
                Автор:{" "}
              </p>
              <h2 className="text-[16px] leading-[120%]">{author}</h2>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-[rgba(147,164,151,1)] text-[16px] leading-[120%]">
                Год:{" "}
              </p>
              <h2 className="text-[16px] leading-[120%]">{year}</h2>
            </div>
            <div className="flex gap-1 flex-col">
              <p className="text-[rgba(147,164,151,1)] text-[16px] leading-[120%]">
                Описание:{" "}
              </p>
              <p className="text-[16px] leading-[120%]">{description}</p>
            </div>
            <div className="flex gap-1 flex-col">
              <p className="text-[rgba(147,164,151,1)] text-[16px] leading-[120%]">
                Библиотека:{" "}
              </p>
              <p className="text-[16px] leading-[120%]">{library}</p>
            </div>
          </div>
        </div>
      </div>
      <button className="font-semibold w-112.75 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed">
        Забронировать
      </button>
    </div>
  );
};

export default BookCard;
