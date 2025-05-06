import Image from "next/image";
import Me from "../../assets/logoNoBG.png";

import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import PageAnimation from "../components/PageAnimation";

const socials = [
  {
    name: "Facebook",
    icon: <FaFacebook />,
    href: "https://www.facebook.com/saif.zayat",
  },
  {
    name: "TikTok",
    icon: <FaTiktok />,
    href: "https://www.tiktok.com/@saifzayat5",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/saif-zayat-998583266/",
  },
  {
    name: "GitHub",
    icon: <FaGithub />,
    href: "https://github.com/saifzayat",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    href: "https://www.instagram.com/saif.zayat/",
  },
];
export default function Hero() {
  return (
    <PageAnimation>
      {/* Background Image */}
      <div
        className="absolute bg-contain inset-0 bg-right blur-md"
        style={{
          backgroundImage: `url(${Me.src})`,
          backgroundRepeat: "no-repeat", // Prevent the image from repeating
          filter: "blur(10px)",
        }}
      ></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-center lg:items-start p-10 gap-10 md:items-center md:h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] ">
        <h1 className="lg:text-4xl sm:text-2xl gold-text">
          Saif Shireef El-Zayat <br />
          I&#39;m React Developer
        </h1>
        <div className="flex gap-6 items-center">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[#f6c14c] text-3xl hover:text-[#b2892f] hover:scale-110 transition-all duration-300 cursor-pointer`}
              title={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </PageAnimation>
  );
}
