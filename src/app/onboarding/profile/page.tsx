import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ProfileForm } from "./profile-form";

export default async function OnboardingProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <OnboardingShell activeStep="PROFILE">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Tell us about yourself, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-slate-500">
          A few quick questions so we can calibrate your placement test and training plan.
        </p>

        <div className="mt-8">
          <ProfileForm />
        </div>
      </div>
    </OnboardingShell>
  );
}
