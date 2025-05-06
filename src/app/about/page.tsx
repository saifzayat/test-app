import Image from "next/image";
import PageAnimation from "../components/PageAnimation";

export default function About() {
  const data = [
    { label: "Phone", value: "+201112277897", href: "tel:+201112277897" },
    { label: "Experience", value: "1+ Year" },
    {
      label: "WhatsApp",
      value: "+201112277897",
      href: "https://wa.me/201112277897",
    },
    { label: "Degree", value: "Bachelor" },
    {
      label: "Email",
      value: "saifzayat@gmail.com",
      href: "mailto:saifzayat@gmail.com",
    },
    { label: "Freelance", value: "Available" },
    {
      label: "Hobbies",
      value: ["Coding", "Reading", "Gaming", "Swimming"].join(", "),
    },
    { label: "Address", value: "Menia ElQmh, Sharkia, Egypt" },
  ];

  return (
    <PageAnimation>
      <div className="flex flex-col p-10 lg:pb-0 justify-center gap-4">
        <h1 className="text-4xl gold-text lg:text-left md:text-left text-center">
          About Me
        </h1>
        <div className="flex flex-wrap lg:flex-nowrap gap-8 items-center">
          {/* Left Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/saifElZayat.png"
              alt="me"
              layout="responsive"
              width={400}
              height={400}
              priority
              className="border-2 border-amber-500"
              style={{
                borderColor: "transparent",
                borderImage:
                  "linear-gradient(90deg, #f6c14c, #fceabb, #b2892f)",
                borderImageSlice: 1,
                objectFit: "cover",
              }}
            />
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl gold-text">Front-End Developer</h2>
            <p className="font-serif font-light py-4">
              I’m a React developer with a passion for creating dynamic and
              responsive web applications. Here are some details about me:
            </p>
            <ul className="md:grid md:grid-cols-2 gap-4 md:px-4 px-0 font-sans font-normal text-l sm:flex sm:flex-col sm:gap-4">
              {data.map((item, index) => (
                <li key={index}>
                  <strong>{item.label}: </strong>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f6c14c] underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageAnimation>
  );
}
