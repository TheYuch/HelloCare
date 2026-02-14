'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserMetadata } from "@/lib/firestore";
import { OnboardingFormData } from "./types";
import { StepWrapper } from "./components/StepWrapper";
import { Step0 } from "./components/Step0";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";

export default function Onboarding() {
  const { loading, isOnboarded } = useUserMetadata();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isOnboarded) {
      router.replace("/");
    }
  }, [loading, isOnboarded, router]);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: "",
    lastName: "",
    language: "US English",
    phone: "",
  });

  const handleFinishOnboarding = () => {
    router.push("/auth")
  }

  const canGoBack = step > 1;
  const handleGoBack = () => setStep((s) => Math.max(0, s - 1));

  const stepProps = { formData, setFormData };

  if (loading || isOnboarded) return null;

  return <StepWrapper canGoBack={canGoBack} onGoBack={handleGoBack}>
    {step === 0 && <Step0 onContinue={() => setStep(1)} {...stepProps} />}
    {step === 1 && <Step1 onContinue={() => setStep(2)} {...stepProps} />}
    {step === 2 && <Step2 onContinue={() => setStep(3)} {...stepProps} />}
    {step === 3 && <Step3 onContinue={() => setStep(4)} {...stepProps} />}
    {step === 4 && <Step4 onContinue={handleFinishOnboarding} {...stepProps} />}
  </StepWrapper>
}
