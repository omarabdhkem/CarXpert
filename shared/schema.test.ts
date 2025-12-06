import { describe, it, expect } from 'vitest'
import { insertUserSchema, insertCarSchema } from '@shared/schema'

describe('Schema Validation', () => {
  describe('User Schema', () => {
    it('should validate a valid user', () => {
      const validUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }
      
      const result = insertUserSchema.safeParse(validUser)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      }
      
      const result = insertUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      }
      
      const result = insertUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })
  })

  describe('Car Schema', () => {
    it('should validate a valid car', () => {
      const validCar = {
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 25000,
      }
      
      const result = insertCarSchema.safeParse(validCar)
      expect(result.success).toBe(true)
    })

    it('should handle optional fields', () => {
      const carWithOptionals = {
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        price: 22000,
        color: 'Blue',
        mileage: 10000,
      }
      
      const result = insertCarSchema.safeParse(carWithOptionals)
      expect(result.success).toBe(true)
    })
  })
})
