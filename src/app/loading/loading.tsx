"use client";
import { useEffect, useState } from "react";
import img from "../../../public/favicon.png";
import Hacker from "../components/Hacker";
import Image from "next/image";

export default function Loading({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  return show ? (
    <div className="flex items-center justify-center h-screen bg-[#000]">
      <div className="animate-pulse flex flex-col items-center">
        <Image
          src={img}
          alt="Loading Logo"
          width={100}
          height={100}
          style={{ objectFit: "contain" }}
        />
        <Hacker />
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}
