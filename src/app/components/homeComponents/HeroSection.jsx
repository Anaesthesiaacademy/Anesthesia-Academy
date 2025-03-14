import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-sky-600 min-h-screen text-white md:pt-16 pt-[70px] px-4 pb-5">
      <div className="flex max-w-7xl mx-auto h-full flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col justify-center">
          {/* Animated Heading */}
          <h1 className="md:text-5xl text-3xl font-bold mb-4 mt-8 opacity-0 translate-y-10 animate-fadeUp">
            Anaesthesia Academy
          </h1>

          {/* Animated Description */}
          <p className="mb-4 md:text-2xl text-lg leading-loose opacity-0 translate-y-10 animate-fadeUp delay-200">
            Your Gateway to Excellence in Anaesthesia Education Led by Prof.
            Abdelrhman Alshawadfy Assistant Professor of Anaesthesia, Intensive
            Care, and Pain Management Faculty of Medicine, Suez Canal University
          </p>

          {/* Animated Button */}
          <div className="mt-8 opacity-0 translate-y-10 animate-fadeUp delay-400">
            <a
              href="#courses"
              className="bg-[#2196f3] inline-block hover:-translate-y-2 transition-all hover:shadow-xl text-lg hover:bg-blue-600 text-white py-3 px-4 rounded"
            >
              Explore Courses
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end items-center animate-fadeUp">
          <Image
            src="/prof.jpg"
            alt="prof"
            width={400}
            height={600}
            className="object-cover rounded-2xl mt-8 hover:-translate-y-2 transition-all hover:shadow-xl hover:scale-[1.03]"
          />
        </div>
      </div>
    </section>
  );
}
