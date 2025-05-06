import Typewriter from "typewriter-effect";

export default function Hacker() {
  return (
    <>
      <h1 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide gold-text">
        Hi Friend
      </h1>
      <h2 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide gold-text">
        <Typewriter
          onInit={(typewriter) => {
            typewriter.typeString("Welcome to my website").start();
          }}
        />
      </h2>
    </>
  );
}
