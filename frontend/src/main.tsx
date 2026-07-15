import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Search from "./pages/Search.tsx";
import NotFound from "./pages/404NotFound.tsx";
import BookReservation from "./pages/BookReservation.tsx";
import ConfirmReservation from "./pages/ConfirmReservation.tsx";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/search-book",
    element: <Search />,
  },
  {
    path: "/book-reservation",
    element: <BookReservation />,
  },
  {
    path: "/confirm-reservation",
    element: <ConfirmReservation />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    <RouterProvider router={router} />
  </StrictMode>,
);
