import DataCards from "./DataCards";

export default async function AdminAnalyticsSection() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getAdminAnalytics`, { cache: "no-store" });
    console.log("test");
    if (!response.ok) throw new Error("Failed to fetch analytics data");
    const { tabsData } = await response.json();

    
    return (
      <div className="mt-10 grid grid-cols-4 gap-8">
        {tabsData.map((tab) => (
          <DataCards key={tab.id} data={tab} />
        ))}
      </div>
    );
  } catch (error) {
    console.log(error.message || "Something went wrong");
    return <p className="text-red-500">Failed to load analytics data.</p>;
  }
}
