import { useEffect, useState } from "react";
import AvatarUpload from "./components/AvatarUpload";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import Menu from "./components/Menu";
import SupportChatButton from "./components/SupportChat";

const ProfileInfo = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.profile();
        const data = response.data;
        setUser(data);
        setName(data.name || "");
        setContactPhone(data.contactPhone || "");
        setEmail(data.email || "");
        setAvatarUrl(data.avatarUrl || null); // если есть поле avatarUrl
      } catch {
        toast.error("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileSelect = (file: File | null) => {
    setAvatarFile(file);
    if (!file && avatarUrl) {
      setAvatarUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("contactPhone", contactPhone);
      if (password) {
        formData.append("password", password);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await authAPI.updateProfile(formData);
      toast.success("Профиль обновлён");
      const updatedUser = response.data;
      setUser(updatedUser);
      setAvatarUrl(updatedUser.avatarUrl || null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка обновления");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Загрузка...
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-20">
        <Menu />

        <div className="pt-10 flex flex-col gap-[65px] mb-[35px]">
          <h2 className="font-semibold text-[36px] leading-[120%]">
            Личная информация
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label
                className="text-[16px] leading-[120%] font-semibold"
                htmlFor="name"
              >
                ФИО
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-[435px] bg-[rgba(255,254,240,1)] border rounded-[16px] py-4 px-6 text-[16px] leading-[120%]"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[16px] leading-[120%] font-semibold"
                htmlFor="phone"
              >
                Телефон
              </label>
              <input
                id="phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                type="text"
                className="w-[435px] bg-[rgba(255,254,240,1)] border rounded-[16px] py-4 px-6 text-[16px] leading-[120%]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[16px] leading-[120%] font-semibold"
                htmlFor="email"
              >
                Почта
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="w-[435px] bg-[rgba(255,254,240,1)] border rounded-[16px] py-4 px-6 text-[16px] leading-[120%]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[16px] leading-[120%] font-semibold"
                htmlFor="password"
              >
                Пароль
              </label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-[435px] bg-[rgba(255,254,240,1)] border rounded-[16px] py-4 px-6 text-[16px] leading-[120%]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[16px] leading-[120%] font-semibold"
                htmlFor="avatar"
              >
                Аватар
              </label>
              <AvatarUpload
                name={name}
                avatarUrl={avatarUrl}
                size={120}
                onFileSelect={handleFileSelect}
                onRemove={() => {
                  setAvatarUrl(null);
                  setAvatarFile(null);
                }}
              />
            </div>
            <button
              type="submit"
              className="self-start font-semibold w-74 px-6 py-4 box-border border shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[rgba(255,195,62,1)] cursor-pointer self-center rounded-2xl hover:shadow-none active:shadow-none active:bg-[rgba(244,148,37,1)] disabled:shadow-none disabled:bg-[rgba(152,164,155,1)] disabled:text-[rgba(105,120,108,1)] disabled:cursor-not-allowed"
            >
              Сохранить изменения
            </button>
          </form>
        </div>
      </div>
      <SupportChatButton />
    </>
  );
};

export default ProfileInfo;
