import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';

const app = express();

beforeAll(async () => {
  await registerRoutes(app);
});

describe('API Routes', () => {
  describe('POST /api/contact', () => {
    test('should create a new contact submission', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        service: 'software-development',
        message: 'I need help with my project'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Contact submission received successfully');
      expect(response.body).toHaveProperty('id');
    });

    test('should validate required fields', async () => {
      const invalidData = {
        firstName: 'John',
        // Missing required fields
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });

    test('should validate email format', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        service: 'software-development',
        message: 'Test message'
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/contact/submissions', () => {
    test('should return all contact submissions', async () => {
      const response = await request(app)
        .get('/api/contact/submissions')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/contact/submissions/:id', () => {
    test('should return a specific contact submission', async () => {
      // First create a submission
      const contactData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        service: 'ui-ux-design',
        message: 'Design consultation needed'
      };

      const createResponse = await request(app)
        .post('/api/contact')
        .send(contactData);

      const submissionId = createResponse.body.id;

      // Then retrieve it
      const response = await request(app)
        .get(`/api/contact/submissions/${submissionId}`)
        .expect(200);

      expect(response.body).toHaveProperty('firstName', 'Jane');
      expect(response.body).toHaveProperty('lastName', 'Smith');
      expect(response.body).toHaveProperty('email', 'jane.smith@example.com');
    });

    test('should return 404 for non-existent submission', async () => {
      await request(app)
        .get('/api/contact/submissions/999999')
        .expect(404);
    });
  });

  describe('PUT /api/contact/submissions/:id/status', () => {
    test('should update submission status', async () => {
      // First create a submission
      const contactData = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        service: 'cloud',
        message: 'Cloud migration help needed'
      };

      const createResponse = await request(app)
        .post('/api/contact')
        .send(contactData);

      const submissionId = createResponse.body.id;

      // Then update its status
      const response = await request(app)
        .put(`/api/contact/submissions/${submissionId}/status`)
        .send({ status: 'contacted' })
        .expect(200);

      expect(response.body).toHaveProperty('status', 'contacted');
    });

    test('should return 404 for non-existent submission', async () => {
      await request(app)
        .put('/api/contact/submissions/999999/status')
        .send({ status: 'contacted' })
        .expect(404);
    });
  });
});