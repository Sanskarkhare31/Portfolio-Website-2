import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      setFormData({ name: '', email: '', message: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 hero-gradient particles-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-cyan-300 mb-6 animate-fade-in">Let's Work Together</h2>
          <div className="w-32 h-2 bg-cyan-300/70 mx-auto rounded-full animate-scale-in"></div>
          <p className="text-xl text-cyan-100 mt-6 max-w-3xl mx-auto leading-relaxed font-medium">
            Ready to transform your vision into reality? Let's create something extraordinary together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="glass-effect p-10 rounded-3xl card-hover">
            <h3 className="text-3xl font-bold text-orange-300 mb-8">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-center group">
                <div className="w-14 h-14 bg-orange-500/80 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <Mail className="text-white h-6 w-6" />
                </div>
                <span className="text-orange-200 text-lg font-medium">sanskarkhare3103@gmail.com</span>
              </div>
              <div className="flex items-center group">
                <div className="w-14 h-14 bg-orange-500/80 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <Phone className="text-white h-6 w-6" />
                </div>
                <span className="text-orange-200 text-lg font-medium">+91 8171365023</span>
              </div>
              <div className="flex items-center group">
                <div className="w-14 h-14 bg-orange-500/80 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <MapPin className="text-white h-6 w-6" />
                </div>
                <span className="text-orange-200 text-lg font-medium">Noida Sector 60, India</span>
              </div>
            </div>
          </div>

          <div className="glass-effect p-10 rounded-3xl card-hover">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-lg font-medium mb-3 text-green-300">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white/20 border-green-300/30 text-gray-900 placeholder:text-gray-600 focus:border-green-400 focus:bg-white/30 h-12 text-lg backdrop-blur-sm font-medium"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium mb-3 text-green-300">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/20 border-green-300/30 text-gray-900 placeholder:text-gray-600 focus:border-green-400 focus:bg-white/30 h-12 text-lg backdrop-blur-sm font-medium"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-lg font-medium mb-3 text-green-300">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-white/20 border-green-300/30 text-gray-900 placeholder:text-gray-600 focus:border-green-400 focus:bg-white/30 text-lg backdrop-blur-sm font-medium"
                  placeholder="Tell me about your project..."
                />
              </div>
              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full hero-gradient hover:scale-105 text-white px-8 py-4 rounded-2xl font-bold transition-all transform shadow-2xl button-modern h-14 text-lg flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
