import books from "../../constants/books";
import SearchBookCard from "./SearchBookCard";

const SearchResults = () => {
  return (
    <div className="flex flex-col gap-10 mt-40">
      <p className="font-semibold text-[36px] leading-[120%]">
        Найдено: 6 книг
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <SearchBookCard
            author={book.author}
            image={book.image}
            alt={book.alt}
            description={book.description}
            year={book.year}
            library={book.numberOfLibraries}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
