"use client";
import { useState, useEffect } from "react";
import Hero from "./hero/page";
import Error from "./error/page"; // Import the Error component

export default function Home() {
  const [showStart, setShowStart] = useState(true);
  const [hasError, setHasError] = useState(false); // State to track errors

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setShowStart(false);
      }, 5000);

      return () => clearTimeout(timer); // Cleanup the timer
    } catch (error) {
      console.error("Error occurred:", error); // Log the error for debugging
      setHasError(true); // Set error state if something goes wrong
    }
  }, []);

  if (hasError) {
    return <Error error={{ message: "An unexpected error occurred." }} />;
  }

  return (
    <>
      <Hero />
    </>
  );
}
