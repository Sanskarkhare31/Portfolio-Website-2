import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ProfileSection from "@/components/profile-section";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">Portfolio - Admin</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
              <a href="#projects" className="text-slate-600 hover:text-slate-900 transition-colors">Projects</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, {user?.firstName || "Admin"}</span>
              <Button asChild variant="outline">
                <a href="/api/logout">Logout</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <ProfileSection isAdmin={true} />

      {/* Projects Section */}
      <ProjectsSection isAdmin={true} />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2024 Portfolio. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
