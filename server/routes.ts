import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body using the schema
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Create the contact submission
      const submission = await storage.createContactSubmission(validatedData);
      
      // In a real application, you might want to send an email notification here
      // For now, we'll just log it
      console.log("New contact submission received:", {
        id: submission.id,
        email: submission.email,
        service: submission.service,
        name: `${submission.firstName} ${submission.lastName}`
      });
      
      res.json({ 
        message: "Contact submission received successfully",
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error processing contact submission:", error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact/submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get a specific contact submission
  app.get("/api/contact/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          message: "Invalid submission ID" 
        });
      }

      const submission = await storage.getContactSubmission(id);
      if (!submission) {
        return res.status(404).json({ 
          message: "Contact submission not found" 
        });
      }

      res.json(submission);
    } catch (error) {
      console.error("Error fetching contact submission:", error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Update contact submission status
  app.patch("/api/contact/submissions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          message: "Invalid submission ID" 
        });
      }

      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ 
          message: "Status is required and must be a string" 
        });
      }

      const updatedSubmission = await storage.updateContactSubmissionStatus(id, status);
      if (!updatedSubmission) {
        return res.status(404).json({ 
          message: "Contact submission not found" 
        });
      }

      res.json(updatedSubmission);
    } catch (error) {
      console.error("Error updating contact submission status:", error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
