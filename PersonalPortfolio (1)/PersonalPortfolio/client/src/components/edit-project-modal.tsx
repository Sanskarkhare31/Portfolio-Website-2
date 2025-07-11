import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface EditProjectModalProps {
  project: any;
  onClose: () => void;
}

export default function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    technologies: project?.technologies?.join(", ") || "",
    projectUrl: project?.projectUrl || "",
    githubUrl: project?.githubUrl || "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PUT" : "POST";
      
      const response = await apiRequest(method, url, formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: `Project ${project ? "updated" : "created"} successfully`,
      });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: `Failed to ${project ? "update" : "create"} project`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <Label htmlFor="projectUrl">Project URL</Label>
            <Input
              id="projectUrl"
              name="projectUrl"
              value={formData.projectUrl}
              onChange={handleChange}
              placeholder="https://your-project.com"
            />
          </div>

          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <Label>Project Image</Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              className="mt-2"
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending ? "Saving..." : project ? "Update Project" : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
