"use client"; // لازم تضيف دي عشان Next.js يتعامل مع الخطأ في الـ client side

import { useEffect } from "react";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-bold text-red-500">Oops!</h2>
      <p className="my-4 text-gray-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Something went wrong. Please try again later.
      </button>
    </div>
  );
}
