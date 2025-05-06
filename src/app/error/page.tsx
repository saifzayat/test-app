interface ErrorProps {
  error: { message: string };
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Something went wrong. Please try again later.
      </p>
      <p className="mt-2 text-sm text-gray-500">Error: {error.message}</p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go Back Home
      </button>
    </div>
  );
}
