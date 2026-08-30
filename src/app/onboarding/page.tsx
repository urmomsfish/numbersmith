import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function OnboardingIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  switch (user.onboardingStep) {
    case "PLACEMENT":
      redirect("/placement-test");
    case "RESULTS":
      redirect("/placement-test/results");
    case "COMPETITIONS":
      redirect("/onboarding/competitions");
    case "PLAN":
      redirect("/onboarding/plan");
    case "DONE":
      redirect("/dashboard");
    default:
      redirect("/onboarding/profile");
  }
}
