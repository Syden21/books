import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Paperclip, X } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl?: string | null;
  name?: string;
  size?: number;
  onFileSelect: (file: File | null) => void;
  onRemove?: () => void;
}

const AvatarUpload = ({
  avatarUrl,
  name = "",
  size = 120,
  onFileSelect,
  onRemove,
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (avatarUrl !== preview) {
      setPreview(avatarUrl || null);
    }
  }, [avatarUrl]);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative overflow-hidden bg-[rgba(255,254,240,1)] border rounded-[16px] flex items-center justify-center px-[15px]"
        style={{ width: size, height: size }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Аватар"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-medium text-gray-600">
            {initials || "?"}
          </span>
        )}
      </div>

      <div className="flex gap-[33px]">
        <button
          type="button"
          onClick={handleEditClick}
          className="hover:underline text-[16px] cursor-pointer leading-[120%] flex items-center gap-2"
        >
          <Paperclip size={24} color="rgba(106,163,120,1)" />
          Изменить фото
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="hover:underline text-[16px] cursor-pointer leading-[120%] flex items-center gap-2"
        >
          <X size={24} color="rgba(106,163,120,1)" />
          Удалить фото
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
