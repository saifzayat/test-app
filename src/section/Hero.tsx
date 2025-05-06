import saifElZayat from "@/assets/saifElZayat.png";
import Image from "next/image";
export const Hero = () => {
  return (
    <div id="hero" className=" text-center items-center py-10 ">
      <h1 className="from-white font-serif text-3xl">
        Hi, I&apos;m Saif EL-ZayaT
      </h1>

      <p>Welcome to my portfolio website!</p>
      <div className="flex justify-center py-5">
        <Image src={saifElZayat} width={250} alt="my photo " />
      </div>
    </div>
  );
};
