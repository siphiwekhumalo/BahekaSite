import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { sendContactFormNotification } from "./email";
import { z } from "zod";
import { registerAwsRoutes } from "./routes-aws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body using the schema
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Create the contact submission
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification
      const recipientEmail = process.env.BAHEKA_EMAIL || "contact@bahekatech.com";
      const emailSent = await sendContactFormNotification(submission, recipientEmail);
      
      if (!emailSent) {
        console.warn("Failed to send email notification for contact form submission");
      }
      
      console.log("New contact submission received:", {
        id: submission.id,
        email: submission.email,
        service: submission.service,
        name: `${submission.firstName} ${submission.lastName}`,
        emailSent
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

  // Register AWS routes for optional Lambda/S3 integration
  registerAwsRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
