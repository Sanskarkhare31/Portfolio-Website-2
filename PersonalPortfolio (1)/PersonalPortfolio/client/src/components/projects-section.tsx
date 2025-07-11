import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react";
import EditProjectModal from "./edit-project-modal";

interface ProjectsSectionProps {
  isAdmin: boolean;
}

export default function ProjectsSection({ isAdmin }: ProjectsSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowEditModal(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-200 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="projects" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 particles-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in text-gradient">Featured Projects</h2>
            <div className="w-32 h-2 hero-gradient mx-auto rounded-full animate-scale-in"></div>
            <p className="text-xl text-white/80 mt-6 max-w-3xl mx-auto leading-relaxed">
              Discover my latest creations that blend innovation with exceptional user experience
            </p>

            {/* Add New Project Button (Admin Mode) */}
            {isAdmin && (
              <Button
                onClick={handleAddProject}
                className="mt-8 glass-effect hover:scale-110 text-white px-8 py-4 rounded-2xl font-bold transition-all transform shadow-2xl button-modern border-white/20"
              >
                <Plus className="h-5 w-5 mr-3" />
                Add New Project
              </Button>
            )}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project: any) => (
              <div
                key={project.id}
                className="group glass-effect rounded-3xl overflow-hidden card-hover relative"
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Edit Project Overlay (Admin Mode) */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex space-x-4">
                      <Button
                        size="sm"
                        onClick={() => handleEditProject(project)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          // TODO: Implement delete functionality
                          console.log("Delete project", project.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <a
                      href={project.projectUrl}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Project
                    </a>
                    <a
                      href={project.githubUrl}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Project Modal */}
      {showEditModal && (
        <EditProjectModal
          project={selectedProject}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
