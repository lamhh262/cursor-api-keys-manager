import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Layout } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center py-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
            asChild
          >
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Learn
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
            asChild
          >
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Layout className="w-4 h-4" />
              Examples
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
            asChild
          >
            <a
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Go to nextjs.org →
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
