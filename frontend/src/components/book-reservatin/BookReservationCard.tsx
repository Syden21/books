interface BookReservationCardProps {
  image?: string;
  title?: string;
  author?: string;
  publicationYear?: string;
  description?: string;
  alt?: string;
}

const BookReservationCard = ({
  image,
  title,
  author,
  publicationYear,
  description,
  alt,
}: BookReservationCardProps) => {
  return (
    <div className="flex gap-21.75 p-8 border box-border rounded-4xl bg-[rgba(255,254,240,1)] max-w-210.75">
      <img src={image} alt={alt} className="w-45 h-63.25" />
      <div className="flex flex-col gap-6">
        <h2>{title}</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <h4 className="text-[rgba(147,164,151,1)] text-[16px] leading-[120%]">
              Автор:
            </h4>
            <h2 className="leading-[120%]">{author}</h2>
          </div>
          <div className="flex gap-4">
            <h4 className="text-[rgba(147,164,151,1)] text-[16px] leading-[120%]">
              Год:
            </h4>
            <h2 className="leading-[120%]">{publicationYear}</h2>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-[rgba(147,164,151,1)] text-[16px] leading-[120%]">
              Описание:
            </h4>
            <h2 className="leading-[150%]">{description}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReservationCard;
