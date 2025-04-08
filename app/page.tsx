import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] cyber-grid">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#2a2a2a] bg-background/80 backdrop-blur-md z-10">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6 text-primary animate-pulse" />
          <span className="gradient-text">COLLABSYNC</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
            Explore
          </Link>
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium hover:text-primary transition-colors">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-neon-pink/5 to-neon-cyan/10"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    <span className="gradient-text">Collaborate</span> on code projects seamlessly
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Create projects, find collaborators, and build amazing software together. COLLABSYNC makes team
                    development simple and efficient.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1 bg-primary hover:bg-primary/80 glow animate-pulse-glow">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary/50 hover:border-primary/80 hover:bg-primary/10 transition-all"
                    >
                      Explore Projects
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] sm:h-[450px] sm:w-[450px]">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-neon-pink via-neon-blue to-neon-cyan rounded-full blur-3xl opacity-20"></div>
                  <div className="relative h-full w-full bg-[#121212] rounded-xl border border-[#2a2a2a] shadow-lg overflow-hidden neon-border">
                    <div className="p-4 border-b border-[#2a2a2a]">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-neon-pink"></div>
                        <div className="h-3 w-3 rounded-full bg-neon-yellow"></div>
                        <div className="h-3 w-3 rounded-full bg-neon-green"></div>
                        <div className="ml-2 text-sm font-medium">Project: E-Commerce Platform</div>
                      </div>
                    </div>
                    <div className="p-4 text-sm font-mono text-gray-300 bg-[#0a0a0a] h-full overflow-hidden">
                      <div className="text-neon-green">// Collaborative code editing</div>
                      <div className="mt-2">
                        <span className="text-neon-pink">function</span>{" "}
                        <span className="text-neon-blue">handleCheckout</span>() {"{"}
                      </div>
                      <div className="ml-4">
                        <span className="text-neon-pink">const</span> cart ={" "}
                        <span className="text-neon-blue">getCartItems</span>();
                      </div>
                      <div className="ml-4">
                        <span className="text-neon-pink">if</span> (!cart.length) {"{"}
                      </div>
                      <div className="ml-8">
                        <span className="text-neon-blue">showNotification</span>(
                        <span className="text-neon-green">"Your cart is empty"</span>);
                      </div>
                      <div className="ml-8">
                        <span className="text-neon-pink">return</span>;
                      </div>
                      <div className="ml-4">{"}"}</div>
                      <div className="ml-4 mt-2">
                        <span className="text-neon-green">// Process payment</span>
                      </div>
                      <div className="ml-4">
                        <span className="text-neon-pink">const</span> success ={" "}
                        <span className="text-neon-blue">await processPayment</span>(cart);
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#0c0c0c] relative">
          <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  Why Choose COLLABSYNC?
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to make collaboration seamless for developers of all skill levels.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border border-[#2a2a2a] rounded-lg p-6 bg-[#121212] hover:border-primary/50 transition-colors">
                <div className="p-3 rounded-full bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">Project Management</h3>
                <p className="text-center text-gray-400">
                  Create, organize, and track your projects with powerful management tools.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-[#2a2a2a] rounded-lg p-6 bg-[#121212] hover:border-secondary/50 transition-colors">
                <div className="p-3 rounded-full bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-secondary">Team Collaboration</h3>
                <p className="text-center text-gray-400">
                  Find collaborators with the skills you need and work together efficiently.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-[#2a2a2a] rounded-lg p-6 bg-[#121212] hover:border-accent/50 transition-colors">
                <div className="p-3 rounded-full bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-accent">Real-time Updates</h3>
                <p className="text-center text-gray-400">
                  See changes as they happen with real-time updates and notifications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t border-[#2a2a2a] px-4 md:px-6 bg-background/80 backdrop-blur-md">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} COLLABSYNC. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:text-primary transition-colors">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

