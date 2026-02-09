import { describe, it, expect } from 'vitest'
import { generateId, clamp, deepClone } from './utilities'

describe('utilities', () => {
  describe('generateId', () => {
    it('should generate a unique ID with fid- prefix', () => {
      const id = generateId()
      expect(id).toMatch(/^fid-[a-z0-9]{7}$/)
    })

    it('should generate different IDs each time', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('deepClone', () => {
    it('should clone primitives', () => {
      expect(deepClone(null)).toBe(null)
      expect(deepClone('test')).toBe('test')
      expect(deepClone(123)).toBe(123)
      expect(deepClone(true)).toBe(true)
    })

    it('should clone arrays', () => {
      const arr = [1, 2, 3]
      const cloned = deepClone(arr)
      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)
    })

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 } }
      const cloned = deepClone(obj)
      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
    })

    it('should clone dates', () => {
      const date = new Date('2024-01-01')
      const cloned = deepClone(date)
      expect(cloned).toEqual(date)
      expect(cloned).not.toBe(date)
    })
  })
})
