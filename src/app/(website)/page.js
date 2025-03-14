import { get } from "mongoose";
import ContactSection from "../components/homeComponents/ContactSection";
import HeroSection from "../components/homeComponents/HeroSection";
import MeetInstructor from "../components/homeComponents/MeetInstructor";
import OurCourses from "../components/homeComponents/OurCourses";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Home() {

  const session = await getServerSession(authOptions);

  return (
    <div className="">
      <HeroSection />
      <OurCourses session={session?.user} />
      <MeetInstructor />
      <ContactSection />
    </div>
  );
}
