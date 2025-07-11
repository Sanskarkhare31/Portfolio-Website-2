import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Camera, Edit, Linkedin, Github, Twitter, Mail, Phone, MapPin } from "lucide-react";
import EditProfileModal from "./edit-profile-modal";

interface ProfileSectionProps {
  isAdmin: boolean;
}

export default function ProfileSection({ isAdmin }: ProfileSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: isAdmin ? ["/api/profile/me"] : ["/api/profile"],
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-pulse">
            <div className="w-48 h-48 bg-slate-200 rounded-full mx-auto mb-8"></div>
            <div className="h-12 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="about" className="min-h-screen py-20 hero-gradient particles-bg flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            {/* Profile Photo Container */}
            <div className="relative inline-block mb-12 animate-float">
              <div className="relative">
                <img
                  src={profile?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"}
                  alt="Profile Photo"
                  className="w-64 h-64 rounded-3xl object-cover shadow-2xl mx-auto transition-all duration-500 hover:scale-110 border-4 border-white/30"
                  style={{ zIndex: 10 }}
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10" style={{ zIndex: 5 }}></div>
              </div>

              {/* Edit Photo Button (Admin Mode) */}
              {isAdmin && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="absolute inset-0 bg-black bg-opacity-50 text-white rounded-3xl flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                >
                  <Camera className="h-12 w-12" />
                </button>
              )}

              {/* Decorative Element */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 hero-gradient rounded-2xl flex items-center justify-center animate-pulse-glow">
                <span className="text-white text-4xl">✨</span>
              </div>
            </div>

            {/* Name and Title */}
            <div className="mb-12">
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-slide-up text-gradient">
                {profile?.name || "John Developer"}
              </h2>
              <p className="text-2xl text-yellow-300 max-w-4xl mx-auto leading-relaxed animate-slide-up font-medium">
                {profile?.title || "Full Stack Developer & UI/UX Designer passionate about creating beautiful, functional web experiences"}
              </p>

              {/* Edit Profile Button (Admin Mode) */}
              {isAdmin && (
                <Button
                  onClick={() => setShowEditModal(true)}
                  className="mt-8 glass-effect hover:scale-110 text-white px-8 py-4 rounded-2xl font-bold transition-all transform shadow-2xl button-modern border-white/20"
                  variant="outline"
                >
                  <Edit className="h-5 w-5 mr-3" />
                  Edit Profile
                </Button>
              )}
            </div>



            {/* Social Links */}
            <div className="flex justify-center space-x-8 mb-16">
              <a href="#" className="glass-effect p-4 rounded-2xl text-white hover:scale-125 transition-all hover:shadow-2xl card-hover">
                <Linkedin className="h-8 w-8" />
              </a>
              <a href="#" className="glass-effect p-4 rounded-2xl text-white hover:scale-125 transition-all hover:shadow-2xl card-hover">
                <Github className="h-8 w-8" />
              </a>
              <a href="#" className="glass-effect p-4 rounded-2xl text-white hover:scale-125 transition-all hover:shadow-2xl card-hover">
                <Twitter className="h-8 w-8" />
              </a>
              <a href="#" className="glass-effect p-4 rounded-2xl text-white hover:scale-125 transition-all hover:shadow-2xl card-hover">
                <Mail className="h-8 w-8" />
              </a>
            </div>

            {/* Skills & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              <div className="glass-effect p-8 rounded-3xl card-hover">
                <h3 className="text-2xl font-bold text-white mb-4">Experience</h3>
                <div className="text-4xl font-bold text-gradient mb-2">5+</div>
                <div className="text-white/80">Years of Excellence</div>
              </div>
              
              <div className="glass-effect p-8 rounded-3xl card-hover">
                <h3 className="text-2xl font-bold text-white mb-4">Projects</h3>
                <div className="text-4xl font-bold text-gradient mb-2">50+</div>
                <div className="text-white/80">Successfully Delivered</div>
              </div>
              
              <div className="glass-effect p-8 rounded-3xl card-hover md:col-span-2 lg:col-span-1">
                <h3 className="text-2xl font-bold text-white mb-4">Satisfaction</h3>
                <div className="text-4xl font-bold text-gradient mb-2">100%</div>
                <div className="text-white/80">Client Happiness</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
