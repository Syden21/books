import { useState } from "react";
import BookCard from "./BookCard";
import books from "../constants/books";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % books.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + books.length) % books.length,
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-300 gap-8 mb-20"
        style={{ transform: `translateX(-${currentSlide * 66.67}%)` }}
      >
        {books.map((book) => (
          <div key={book.id}>
            <BookCard
              author={book.author}
              image={book.image}
              alt={book.alt}
              description={book.description}
              year={book.year}
              library={book.library}
            />
          </div>
        ))}
      </div>

      <div className="absolute right-0 bottom-0 flex gap-2.5 mb-4 mr-4">
        <button
          onClick={prevSlide}
          className="flex items-center justify-center w-10 h-10 box-border border rounded-[20px] shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] hover:shadow-none cursor-pointer"
        >
          <ArrowBigLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="flex items-center justify-center w-10 h-10 box-border border rounded-[20px] shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] hover:shadow-none cursor-pointer"
        >
          <ArrowBigRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Slider;
