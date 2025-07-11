import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProfileSchema, insertProjectSchema, users } from "@shared/schema";
import { db } from "./db";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Static file serving for uploads
  app.use('/uploads', express.static(uploadDir));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.get('/api/profile', async (req, res) => {
    try {
      // Get the most recent profile (for public view)
      const userList = await db.select().from(users).limit(1);
      if (userList.length === 0) {
        return res.json({
          id: 1,
          name: "John Developer",
          title: "Full Stack Developer & UI/UX Designer passionate about creating beautiful, functional web experiences",
          profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
        });
      }
      
      const profile = await storage.getProfile(userList[0].id);
      if (profile) {
        res.json(profile);
      } else {
        res.json({
          id: 1,
          name: "John Developer",
          title: "Full Stack Developer & UI/UX Designer passionate about creating beautiful, functional web experiences",
          email: "sanskarkhare3103@gmail.com",
          phone: "+91 8171365023",
          location: "Noida Sector 60, India",
          profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.get('/api/profile/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertProfileSchema.parse({
        ...req.body,
        userId
      });
      const profile = await storage.upsertProfile(profileData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
      }
    }
  });

  // Profile photo upload
  app.post('/api/profile/photo', isAuthenticated, upload.single('photo'), async (req: any, res) => {
    try {
      console.log("Photo upload request received");
      console.log("File:", req.file);
      console.log("Body:", req.body);
      
      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const imageUrl = `/uploads/${req.file.filename}`;
      
      console.log("Updating profile with image URL:", imageUrl);
      
      const profile = await storage.getProfile(userId);
      if (profile) {
        const updatedProfile = await storage.upsertProfile({
          ...profile,
          profileImageUrl: imageUrl
        });
        console.log("Profile updated:", updatedProfile);
      } else {
        const newProfile = await storage.upsertProfile({
          userId,
          name: req.user.claims.first_name || "User",
          title: "Developer",
          profileImageUrl: imageUrl
        });
        console.log("New profile created:", newProfile);
      }

      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // Project routes
  app.get('/api/projects', async (req, res) => {
    try {
      // For public view, get all active projects
      // For now, return sample projects
      const sampleProjects = [
        {
          id: 1,
          title: "E-commerce Dashboard",
          description: "Modern e-commerce admin dashboard with real-time analytics, inventory management, and customer insights.",
          technologies: ["React", "Node.js", "MongoDB"],
          imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          projectUrl: "#",
          githubUrl: "#"
        },
        {
          id: 2,
          title: "Fitness Tracking App",
          description: "Cross-platform mobile app for workout tracking, nutrition logging, and progress visualization.",
          technologies: ["React Native", "Firebase", "Redux"],
          imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          projectUrl: "#",
          githubUrl: "#"
        },
        {
          id: 3,
          title: "Analytics Platform",
          description: "Real-time analytics platform with interactive charts, custom reports, and data export capabilities.",
          technologies: ["Vue.js", "Python", "D3.js"],
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          projectUrl: "#",
          githubUrl: "#"
        },
        {
          id: 4,
          title: "Social Hub",
          description: "Modern social media platform with real-time messaging, content sharing, and community features.",
          technologies: ["React", "Socket.io", "PostgreSQL"],
          imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          projectUrl: "#",
          githubUrl: "#"
        },
        {
          id: 5,
          title: "TaskFlow Pro",
          description: "Collaborative task management platform with kanban boards, time tracking, and team analytics.",
          technologies: ["Angular", "Express.js", "MySQL"],
          imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          projectUrl: "#",
          githubUrl: "#"
        },
        {
          id: 6,
          title: "Creative Portfolio",
          description: "Responsive portfolio website with smooth animations, dark mode, and optimized performance.",
          technologies: ["HTML/CSS", "JavaScript", "GSAP"],
          imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          projectUrl: "#",
          githubUrl: "#"
        }
      ];
      res.json(sampleProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId,
        technologies: req.body.technologies ? req.body.technologies.split(',').map((t: string) => t.trim()) : [],
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
      });
      
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Failed to create project" });
      }
    }
  });

  app.put('/api/projects/:id', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const existingProject = await storage.getProject(projectId);
      if (!existingProject || existingProject.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      const updateData = {
        ...req.body,
        technologies: req.body.technologies ? req.body.technologies.split(',').map((t: string) => t.trim()) : existingProject.technologies,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : existingProject.imageUrl
      };

      const project = await storage.updateProject(projectId, updateData);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const existingProject = await storage.getProject(projectId);
      if (!existingProject || existingProject.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      // Log the contact form submission (in production, you'd save to database or send email)
      console.log("Contact form submission:", {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      });
      
      // Simulate sending email/notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
