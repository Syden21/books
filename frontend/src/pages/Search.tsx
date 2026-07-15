import Header from "../components/Header";
import SearchComponent from "../components/SearchComponent";
import Footer from "../components/Footer";
import SearchResults from "../components/search-book/SearchResults";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { bookAPI } from "../services/api";

import booksImage from "../assets/books2.svg";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const params: any = {};
        const title = searchParams.get("title");
        const author = searchParams.get("author");
        if (title) params.title = title;
        if (author) params.author = author;

        const response = await bookAPI.search(params);
        setBooks(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };
  });

  return (
    <>
      <div className="px-80 mb-50">
        <Header />
        <SearchComponent icon={booksImage} />
        {loading && (
          <div className="text-center text-gray-500 mt-4">Загрузка...</div>
        )}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        {!loading && !error && <SearchResults books={books} />}
      </div>
      <Footer />
    </>
  );
};

export default Search;
