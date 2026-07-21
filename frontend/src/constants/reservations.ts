import bulgakov from "../assets/images/bulgakov.png";
import dostoevskiy from "../assets/images/dostoevskiy.png";
import tolstoy from "../assets/images/tolstoy.png";
import gogol from "../assets/images/gogol.png";
import pushkin from "../assets/images/pushkin.png";

interface Borrowing {
  id: number;
  bookTitle: string;
  author: string;
  library: string;
  dateStart: string;
  dateEnd: string;
  status: "reserved" | "active" | "completed" | "cancelled";
  image: string;
}

export const borrowings: Borrowing[] = [
  {
    id: 1,
    bookTitle: "Мастер и Маргарита",
    author: "М.А. Булгаков",
    library: "Центральная городская библиотека им. Н.А. Некрасова",
    dateStart: "10.08.2025",
    dateEnd: "25.08.2025",
    status: "active",
    image: bulgakov,
  },
  {
    id: 2,
    bookTitle: "Братья Карамазовы",
    author: "Ф.М. Достоевский",
    library: "Центральная городская библиотека им. Н.А. Некрасова",
    dateStart: "15.04.2025",
    dateEnd: "30.04.2025",
    status: "active",
    image: dostoevskiy,
  },
  {
    id: 3,
    bookTitle: "Путь жизни",
    author: "Л.Н. Толстой",
    library: "Библиотека-читальня им. И.С. Тургенева",
    dateStart: "05.09.2024",
    dateEnd: "28.09.2024",
    status: "completed",
    image: tolstoy,
  },
  {
    id: 4,
    bookTitle: "Мертвые души",
    author: "Н.В. Гоголь",
    library: "Библиотека-читальня им. И.С. Тургенева",
    dateStart: "12.03.2024",
    dateEnd: "02.04.2024",
    status: "completed",
    image: gogol,
  },
  {
    id: 5,
    bookTitle: "Евгений Онегин",
    author: "А.С. Пушкин",
    library: "Центральная городская библиотека им. Н.А. Некрасова",
    dateStart: "22.10.2023",
    dateEnd: "05.11.2023",
    status: "completed",
    image: pushkin,
  },
];
