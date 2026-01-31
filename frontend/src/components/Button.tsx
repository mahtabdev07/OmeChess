"use client";

import React from "react";

const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="bg-[#81B64C] text-2xl max-w-md mx-auto font-bold cursor-pointer py-3 sm:py-4 px-4 sm:px-5 rounded-lg shadow-[#4b933b] shadow-[0_4px_0_#333]/60 w-full active:scale-[99%] transition duration-100 hover:bg-[#8bc552]"
    >
      {children}
    </button>
  );
};

export default Button;
