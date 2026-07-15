import SearchBookCard from "./SearchBookCard";

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

interface SearchResultsProps {
  books: Book[];
}

const SearchResults = ({books}: SearchResultsProps) => {
  return (
    <div className="flex flex-col gap-10 mt-40">
      <p className="font-semibold text-[36px] leading-[120%]">
        Найдено: {books.length} книг
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <SearchBookCard
            key={book.id}
            name={book.title}
            author={book.author}
            image={book.coverImage || ""}
            alt={book.title}
            description={book.description}
            year={book.year}
            library={book.library?.name || "Библиотека"}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
