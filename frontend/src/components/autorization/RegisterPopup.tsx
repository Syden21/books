import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FormField from "../FormField";
import { X } from "lucide-react";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";

interface RegisterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
  onSuccess?: () => void;
}

const RegisterPopup = ({
  isOpen,
  onClose,
  onBackToLogin,
  onSuccess,
}: RegisterPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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

  const handleBlur = (
    field: "fullName" | "email" | "password" | "confirmPassword",
  ) => {
    if (field === "fullName") {
      if (!fullName.trim()) {
        setFullNameError("Необходимо указать ФИО");
      } else {
        setFullNameError("");
      }
    } else if (field === "email") {
      const error = validateEmail(email);
      setEmailError(error);
    } else if (field === "password") {
      if (!password.trim()) {
        setPasswordError("Необходимо указать пароль");
      } else if (password.length < 6) {
        setPasswordError("Пароль должен содержать минимум 6 символов");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError("Необходимо указать ФИО");
      hasError = true;
    } else {
      setFullNameError("");
    }

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
    } else if (password.length < 6) {
      setPasswordError("Пароль должен содержать минимум 6 символов");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await authAPI.register({
        email,
        password,
        name: fullName,
      });

      toast.success("Регистрация успешна! Теперь войдите в систему.");
      resetForm();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes("email already exists")) {
          setEmailError("Пользователь с таким email уже существует");
        } else {
          toast.error(error.response?.data?.message || "Ошибка регистрации");
        }
      } else if (error.response?.status === 409) {
        setEmailError("Пользователь с таким email уже существует");
      } else {
        toast.error("Ошибка регистрации. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div ref={popupRef} className="relative z-10">
        <div className="bg-[rgba(246,255,247,1)] rounded-4xl box-border p-6 w-210.5 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-end mb-4">
            <X
              size={24}
              className="cursor-pointer hover:text-gray-600"
              onClick={handleClose}
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="font-semibold text-4xl leading-[120%] mb-10">
              Регистрация
            </p>

            <form
              className="flex flex-col items-start px-27.5 w-full"
              onSubmit={handleSubmit}
              noValidate
            >
              <FormField
                id="fullName"
                label="ФИО"
                value={fullName}
                error={fullNameError}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (e.target.value.trim()) setFullNameError("");
                }}
                onBlur={() => handleBlur("fullName")}
                placeholder="Иванов Иван Иванович"
                type="text"
                disabled={loading}
              />

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
                placeholder="ivanov@mail.com"
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
                placeholder="Введите пароль (минимум 6 символов)"
                type="password"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="self-center w-74 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed"
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>

            <p className="my-16.25 text-[16px] font-semibold leading-[120%]">
              У меня уже есть аккаунт!{" "}
              <span
                className="cursor-pointer hover:underline text-blue-600"
                onClick={() => {
                  resetForm();
                  onBackToLogin();
                }}
              >
                Войти
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RegisterPopup;
