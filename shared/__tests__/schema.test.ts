import { describe, test, expect } from '@jest/globals';
import { insertUserSchema, insertContactSubmissionSchema } from '../schema';

describe('Schema Validation', () => {
  describe('insertUserSchema', () => {
    test('should validate valid user data', () => {
      const validUser = {
        username: 'testuser',
        password: 'password123'
      };

      const result = insertUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    test('should reject invalid user data', () => {
      const invalidUser = {
        username: '', // Empty username
        password: 'pass' // Too short password
      };

      const result = insertUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('should reject missing fields', () => {
      const incompleteUser = {
        username: 'testuser'
        // Missing password
      };

      const result = insertUserSchema.safeParse(incompleteUser);
      expect(result.success).toBe(false);
    });
  });

  describe('insertContactSubmissionSchema', () => {
    test('should validate valid contact submission', () => {
      const validSubmission = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        service: 'software-development',
        message: 'I need help with my project'
      };

      const result = insertContactSubmissionSchema.safeParse(validSubmission);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validSubmission);
      }
    });

    test('should reject invalid email format', () => {
      const invalidSubmission = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        service: 'software-development',
        message: 'Test message'
      };

      const result = insertContactSubmissionSchema.safeParse(invalidSubmission);
      expect(result.success).toBe(false);
    });

    test('should reject empty required fields', () => {
      const invalidSubmission = {
        firstName: '',
        lastName: '',
        email: 'john.doe@example.com',
        service: 'software-development',
        message: ''
      };

      const result = insertContactSubmissionSchema.safeParse(invalidSubmission);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const incompleteSubmission = {
        firstName: 'John',
        email: 'john.doe@example.com'
        // Missing other required fields
      };

      const result = insertContactSubmissionSchema.safeParse(incompleteSubmission);
      expect(result.success).toBe(false);
    });
  });
});