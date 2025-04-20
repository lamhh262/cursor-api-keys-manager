'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, Star, GitPullRequest, BarChart3, Clock, Tag, ArrowRight, Check, Menu } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "./components/AuthButton"
import { ActionButtons } from "./components/ActionButtons"
import { Footer } from "./components/Footer"
import { useState } from "react"

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDashboardClick = () => {
    if (session) {
      router.push('/dashboards');
    } else {
      router.push('/auth/signin?callbackUrl=/dashboards');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">GitHub Analyzer</span>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium transition-colors hover:text-foreground/80">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-foreground/80">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-foreground/80">
                Pricing
              </Link>
              <Link href="/dashboards" className="text-sm font-medium transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleDashboardClick}
              >
                Dashboard
              </Button>
              <AuthButton />
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-4">
                <Link href="#features" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  How It Works
                </Link>
                <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  Pricing
                </Link>
                <Link href="/dashboards" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 pt-4">
                  <ThemeToggle />
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </Button>
                  <AuthButton />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Unlock the Power of GitHub Repositories
                </h1>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Get valuable insights, summaries, and analytics for any open source GitHub repository in seconds.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row mt-8">
                <ActionButtons />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Powerful Features</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Everything you need to understand GitHub repositories at a glance
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Repository Analytics</h3>
                  <p className="text-center text-muted-foreground">
                    Get comprehensive analytics on stars, forks, and engagement over time.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <GitPullRequest className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">PR Insights</h3>
                  <p className="text-center text-muted-foreground">
                    Track important pull requests and understand their impact on the project.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Tag className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Version Updates</h3>
                  <p className="text-center text-muted-foreground">
                    Stay informed about new releases and version changes.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Star className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Star Tracking</h3>
                  <p className="text-center text-muted-foreground">
                    Monitor star growth and identify trending repositories.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Activity Timeline</h3>
                  <p className="text-center text-muted-foreground">
                    Visualize repository activity over time with detailed timelines.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Github className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Cool Facts</h3>
                  <p className="text-center text-muted-foreground">
                    Discover interesting facts and statistics about any repository.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">Get started in just three simple steps</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Sign Up</h3>
                  <p className="text-center text-muted-foreground">
                    Create your free account in seconds, no credit card required.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Enter Repository URL</h3>
                  <p className="text-center text-muted-foreground">Paste any GitHub repository URL to start analyzing.</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Get Insights</h3>
                  <p className="text-center text-muted-foreground">
                    Instantly receive comprehensive analytics and insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Start for free, upgrade when you need more
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {/* Free Tier */}
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $0
                  <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>5 repositories</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Daily updates</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
                  </Link>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm relative">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">For individuals and small teams</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $19
                  <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>25 repositories</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Hourly updates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Email reports</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Start 14-Day Trial</Button>
                  </Link>
                </div>
              </div>

              {/* Enterprise Tier */}
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-muted-foreground">For organizations and large teams</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $49
                  <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Unlimited repositories</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Premium analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Real-time updates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Custom reports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>API access</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/contact">
                    <Button className="w-full" variant="outline">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of developers who are already using GitHub Analyzer
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                    Sign Up for Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
