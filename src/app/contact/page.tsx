import PageAnimation from "../components/PageAnimation";

export default function Contact() {
  return (
    <PageAnimation>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-xl md:text-3xl font-bold text-center">
          Contact Me
        </h1>
        <p className="text-lg md:text-xl text-center mt-4 px-4 sm:px-0">
          This is the Contact page. Add your contact information here.
        </p>
      </div>
    </PageAnimation>
  );
}
