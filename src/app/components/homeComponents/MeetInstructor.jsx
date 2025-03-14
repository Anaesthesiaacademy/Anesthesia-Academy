import Image from "next/image";
import { GoDotFill } from "react-icons/go";

export default function MeetInstructor() {
  const data = [
    {
      id: 1,
      title: "Educational Background",
      advantages: [
        "Doctorate of Anaesthesia, Intensive Care, and Pain Management",
        "Master of Anaesthesia, Intensive Care, and Pain Management",
        "European Diploma of Anaesthesia and Intensive Care (EDAIC)",
      ],
    },
    {
      id: 2,
      title: "Areas of Expertise",
      advantages: [
        "Anesthesiology",
        "Intensive Care Medicine",
        "Pain Management",
        "Medical Education",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16" id="about">
      <h3 className="md:text-2xl text-xl font-semibold mb-3 text-slate-900">
        Meet Your Instructor
      </h3>

      <div className="flex gap-8 mt-10 p-6 shadow-xl rounded-md flex-col md:flex-row">
        <div>
          <Image
            src="/prof.jpg"
            alt="prof"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>

        <div className="flex-1">
          <h4 className="md:text-3xl text-xl text-slate-700 font-bold mb-5">
            Prof. Abdelrhman Alshawadfy
          </h4>
          <div className="flex flex-col gap-4 pb-4 border-b">
            <div className="flex flex-col gap-2">
              <h6 className="text-xl font-bold text-[#4A90E2]">
                Current Position
              </h6>
              <p>
                Assistant Professor of Anaesthesia, Intensive Care, and Pain
                Management Faculty of Medicine, Suez Canal University
              </p>
            </div>
            {data.map((item) => (
              <div className="flex flex-col gap-2" key={item.id}>
                <h6 className="text-xl font-bold text-[#4A90E2]">
                  {item.title}
                </h6>
                {item.advantages.map((adv) => (
                  <p className="flex items-center gap-2" key={adv}>
                    <GoDotFill className="text-[#4A90E2] text-xs" /> {adv}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="flex items-center gap-2">
              Doctorate of Anaesthesia, Intensive Care, and Pain ManagementWith
              extensive experience in both clinical practice and medical
              education, Prof. Alshawadfy brings a wealth of knowledge and
              practical expertise to the Anaesthesia Academy. His commitment to
              excellence in medical education and patient care has made him a
              distinguished figure in the field of anaesthesiology and intensive
              care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
