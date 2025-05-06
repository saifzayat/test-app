"use client";
import Typewriter from "typewriter-effect";

export const Hacker = () => {
  return (
    <div className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip">
      <div className="container">
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide ">
              Hi Friend
            </h1>
            <h2 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide ">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter.typeString("welcome to my sit").start();
                }}
              />
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
