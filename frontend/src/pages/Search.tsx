import Header from "../components/Header";
import SearchComponent from "../components/SearchComponent";
import books from "../assets/books2.svg";
import Footer from "../components/Footer";
import SearchResults from "../components/search-book/SearchResults";

const Search = () => {
  return (
    <>
      <div className="px-80 mb-50">
        <Header />
        <SearchComponent icon={books} />
        <SearchResults />
      </div>
      <Footer />
    </>
  );
};

export default Search;
