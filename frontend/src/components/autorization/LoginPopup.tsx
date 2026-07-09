import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FormField from "../FormField";
import { X } from "lucide-react";
import RegisterPopup from "./RegisterPopup";

interface PopupProps {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
}

const LoginPopup = ({ isOpen, setIsOpen }: PopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleRegister = () => {
    resetForm();
    setIsRegisterOpen(true);
  };

  const handleBackToLogin = () => {
    setIsRegisterOpen(false);
    setIsOpen(true);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleBlur = (field: "username" | "password") => {
    if (field === "username") {
      if (!username.trim()) {
        setUsernameError("Необходимо указать ФИО");
      } else {
        setUsernameError("");
      }
    } else {
      if (!password.trim()) {
        setPasswordError("Необходимо указать пароль");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!username.trim()) {
      setUsernameError("Необходимо указать ФИО");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Необходимо указать пароль");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
          <div ref={popupRef} className="relative z-10">
            <div className="bg-[rgba(246,255,247,1)] rounded-4xl box-border p-6 w-210.5">
              <div className="flex justify-end mb-4">
                <X size={24} className="cursor-pointer" onClick={handleClose} />
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-4xl leading-[120%] mb-10">
                  Вход
                </p>

                <form
                  className="flex flex-col items-start px-27.5"
                  onSubmit={handleSubmit}
                >
                  <FormField
                    id="username"
                    label="ФИО"
                    value={username}
                    error={usernameError}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (e.target.value.trim()) setUsernameError("");
                    }}
                    onBlur={() => handleBlur("username")}
                    placeholder="Иванов Иван Иванович"
                    type="text"
                  />

                  <FormField
                    id="password"
                    label="Пароль"
                    value={password}
                    error={passwordError}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (e.target.value.trim()) setPasswordError("");
                    }}
                    onBlur={() => handleBlur("password")}
                    placeholder="Введите пароль"
                    type="password"
                  />

                  <button className="self-center w-74 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed">
                    Войти
                  </button>
                </form>

                <p className="my-16.25 text-[16px] font-semibold leading-[120%]">
                  Нет аккаунта?{" "}
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => handleRegister()}
                  >
                    Зарегистрироваться
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <RegisterPopup
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onBackToLogin={handleBackToLogin}
      />
    </>
  );
};

export default LoginPopup;
