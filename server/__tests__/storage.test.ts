import { MemStorage } from '../storage';

describe('MemStorage', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  describe('User Management', () => {
    test('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const user = await storage.createUser(userData);
      expect(user).toHaveProperty('id');
      expect(user.username).toBe('testuser');
      expect(user.password).toBe('password123');
    });

    test('should retrieve user by id', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const createdUser = await storage.createUser(userData);
      const retrievedUser = await storage.getUser(createdUser.id);
      
      expect(retrievedUser).toEqual(createdUser);
    });

    test('should retrieve user by username', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const createdUser = await storage.createUser(userData);
      const retrievedUser = await storage.getUserByUsername('testuser');
      
      expect(retrievedUser).toEqual(createdUser);
    });

    test('should return undefined for non-existent user', async () => {
      const user = await storage.getUser(999);
      expect(user).toBeUndefined();
    });
  });

  describe('Contact Submission Management', () => {
    test('should create a new contact submission', async () => {
      const submissionData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        service: 'software-development',
        message: 'I need help with my project'
      };

      const submission = await storage.createContactSubmission(submissionData);
      expect(submission).toHaveProperty('id');
      expect(submission.firstName).toBe('John');
      expect(submission.lastName).toBe('Doe');
      expect(submission.email).toBe('john.doe@example.com');
      expect(submission.service).toBe('software-development');
      expect(submission.message).toBe('I need help with my project');
      expect(submission.status).toBe('pending');
      expect(submission.createdAt).toBeInstanceOf(Date);
    });

    test('should retrieve all contact submissions', async () => {
      const submission1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        service: 'software-development',
        message: 'First message'
      };

      const submission2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        service: 'ui-ux-design',
        message: 'Second message'
      };

      await storage.createContactSubmission(submission1);
      await storage.createContactSubmission(submission2);

      const submissions = await storage.getContactSubmissions();
      expect(submissions).toHaveLength(2);
      expect(submissions[0].firstName).toBe('John');
      expect(submissions[1].firstName).toBe('Jane');
    });

    test('should retrieve specific contact submission', async () => {
      const submissionData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        service: 'software-development',
        message: 'I need help with my project'
      };

      const createdSubmission = await storage.createContactSubmission(submissionData);
      const retrievedSubmission = await storage.getContactSubmission(createdSubmission.id);
      
      expect(retrievedSubmission).toEqual(createdSubmission);
    });

    test('should update contact submission status', async () => {
      const submissionData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        service: 'software-development',
        message: 'I need help with my project'
      };

      const createdSubmission = await storage.createContactSubmission(submissionData);
      const updatedSubmission = await storage.updateContactSubmissionStatus(createdSubmission.id, 'contacted');
      
      expect(updatedSubmission?.status).toBe('contacted');
    });

    test('should return undefined for non-existent submission', async () => {
      const submission = await storage.getContactSubmission(999);
      expect(submission).toBeUndefined();
    });

    test('should return undefined when updating non-existent submission', async () => {
      const result = await storage.updateContactSubmissionStatus(999, 'contacted');
      expect(result).toBeUndefined();
    });
  });
});