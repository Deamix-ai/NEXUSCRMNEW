import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

// Global test setup for E2E tests
let app: INestApplication | undefined

beforeAll(async () => {
  // Setup will be done in individual test files
  // This file is for shared setup if needed
})

afterAll(async () => {
  if (app) {
    await app.close()
  }
})

// Custom matchers for API testing
expect.extend({
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const pass = uuidRegex.test(received)
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false
      }
    }
  },

  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const pass = emailRegex.test(received)
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false
      }
    }
  },

  toBeValidPhoneNumber(received: string) {
    // UK phone number validation
    const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/
    const pass = phoneRegex.test(received.replace(/\s/g, ''))
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UK phone number`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid UK phone number`,
        pass: false
      }
    }
  }
})

// Global test utilities
global.createMockLead = () => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Lead',
  description: 'Test lead description',
  status: 'NEW',
  client: {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Test Client',
    email: 'test@example.com',
    phone: '+44 1234 567890'
  },
  source: 'Website',
  value: 5000,
  probability: 0.7,
  expectedCloseDate: new Date('2024-12-31'),
  assignedTo: 'sales@example.com',
  tags: ['bathroom', 'renovation'],
  notes: 'Initial consultation completed',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
})

global.createMockClient = () => ({
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Test Client',
  email: 'test@example.com',
  phone: '+44 1234 567890',
  address: {
    street: '123 Test Street',
    city: 'Test City',
    county: 'Test County',
    postcode: 'TE1 2ST',
    country: 'United Kingdom'
  },
  preferences: {
    contactMethod: 'email',
    newsletterOptIn: true,
    smsOptIn: false
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
})

// Type declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R
      toBeValidEmail(): R
      toBeValidPhoneNumber(): R
    }
  }

  var createMockLead: () => any
  var createMockClient: () => any
}