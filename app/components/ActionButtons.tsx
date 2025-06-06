'use client';

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ActionButtons() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleManageApiKeys = () => {
    if (session) {
      router.push("/dashboards");
    } else {
      signIn("google", { callbackUrl: "/dashboards" });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Button
        size="lg"
        className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto"
        onClick={handleManageApiKeys}
      >
        Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => {
          const element = document.getElementById('how-it-works');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Learn More
      </Button>
    </div>
  );
}
