import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FormField from "../FormField";
import { X } from "lucide-react";
import RegisterPopup from "./RegisterPopup";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";

interface PopupProps {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  onLoginSuccess?: (user: any) => void;
}

const LoginPopup = ({ isOpen, setIsOpen, onLoginSuccess }: PopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setLoading(false);
  };

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email обязателен";
    if (!emailRegex.test(email)) return "Введите корректный email";
    return "";
  };

  const handleBlur = (field: "email" | "password") => {
    if (field === "email") {
      const error = validateEmail(email);
      setEmailError(error);
    } else {
      if (!password.trim()) {
        setPasswordError("Необходимо указать пароль");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    const emailErrorMsg = validateEmail(email);
    if (emailErrorMsg) {
      setEmailError(emailErrorMsg);
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Необходимо указать пароль");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { user } = response.data;

      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Добро пожаловать, ${user.name}!`);
      resetForm();
      setIsOpen(false);
      
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401) {
        setPasswordError('Неверный email или пароль');
        toast.error('Неверный email или пароль');
      } else if (error.response?.status === 404) {
        setEmailError('Пользователь не найден');
        toast.error('Пользователь не найден');
      } else {
        toast.error('Ошибка входа. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
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
                  noValidate
                >
                  <FormField
                    id="email"
                    label="Email"
                    value={email}
                    error={emailError}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (e.target.value.trim()) setEmailError("");
                    }}
                    onBlur={() => handleBlur("email")}
                    placeholder="ivanov@mail.ru"
                    type="email"
                    disabled={loading}
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
                    disabled={loading}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="self-center w-74 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed"
                  >
                    {loading ? "Вход..." : "Войти"}
                  </button>
                </form>

                <p className="my-16.25 text-[16px] font-semibold leading-[120%]">
                  Нет аккаунта?{" "}
                  <span
                    className="cursor-pointer hover:underline text-blue-600"
                    onClick={handleRegister}
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
        onSuccess={() => {
          setIsRegisterOpen(false);
          setIsOpen(true);
          toast.info('Теперь войдите с новыми данными');
        }}
      />
    </>
  );
};

export default LoginPopup;