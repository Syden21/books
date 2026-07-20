import React from "react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = "md",
  className = "",
}) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
    xxl: "w-30 h-30 text-7xl",
  };

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-emerald-500",
  ];
  const colorIndex = name.length % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center 
        text-white font-medium select-none px-[24px] py-[10px]
        ${src ? "rgba(255,254,240,1)" : bgColor}
        ${className}
      `}
      style={
        src ? { backgroundImage: `url(${src})`, backgroundSize: "cover" } : {}
      }
    >
      {!src && initials}
    </div>
  );
};

export default Avatar;
