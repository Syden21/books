import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
  coverImage?: string;
  isAvailable: boolean;
  availableCopies: number;
  totalCopies: number;
  libraryId: number;
  library?: {
    id: number;
    name: string;
    address: string;
  };
}

interface SearchComponentProps {
  icon: string;
}

const SearchComponent = ({ icon }: SearchComponentProps) => {
  const [inputDate, setInputDate] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (title.trim()) params.append("title", title.trim());
    if (author.trim()) params.append("author", author.trim());
    if (inputDate) params.append("startDate", inputDate);
    navigate(`/search-book?${params.toString()}`);
    setLoading(false);
  };

  return (
    <div className="mt-30 flex flex-col gap-8.5">
      <div className="flex gap-8.5">
        <div className="w-183 px-8 pt-8 my-8 pb-14 gap-10 flex flex-col bg-[rgba(214,234,216,1)] box-border border rounded-4xl font-semibold text-[16px] leading-[120%]">
          <div className="flex flex-col gap-2">
            <label>Название</label>
            <input
              id="name"
              type="text"
              placeholder="Например, Евгений Онегин"
              className="font-normal text-[rgba(147,164,151,1)] box-border border rounded-2xl bg-[rgba(255,254,240,1)] px-6 py-4 focus:text-[rgb(0,0,0)]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Автор</label>
            <input
              id="author"
              type="text"
              placeholder="Например, Пушкин А.С."
              className="font-normal text-[rgba(147,164,151,1)] box-border border rounded-2xl bg-[rgba(255,254,240,1)] px-6 py-4 focus:text-[rgb(0,0,0)]"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <label>Выдача книги</label>
              <input
                value={inputDate}
                id="distribDate"
                type="date"
                className="w-77.5 font-normal text-[rgba(147,164,151,1)] box-border border rounded-2xl bg-[rgba(255,254,240,1)] px-6 py-4 focus:text-[rgb(0,0,0)]"
                onChange={(e) => setInputDate(e.target.value)}
                placeholder="Выберите дату"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Возврат книги</label>
              <input
                id="returnDate"
                type="date"
                className="w-77.5 font-normal text-[rgba(147,164,151,1)] box-border border rounded-2xl bg-[rgba(255,254,240,1)] px-6 py-4 focus:text-[rgb(0,0,0)]"
              />
            </div>
          </div>
          <button
            className="font-semibold w-74 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer self-center rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed"
            onClick={handleSearch}
            disabled={loading}
          >
            Найти книгу
          </button>
        </div>
        <img src={icon} alt="Books" className="w-128.5 h-137" />
      </div>
    </div>
  );
};

export default SearchComponent;
