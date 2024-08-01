import { DateInterval } from './DateInterval';

describe('DateInterval', () => {
  describe('fromString', () => {
    test('should parse full interval string correctly', () => {
      const intervalString = 'P1Y2M3DT4H5M6S';
      const interval = DateInterval.fromString(intervalString);
      expect(interval).toBeDefined();
      if (interval) {
        expect(interval.years).toBe(1);
        expect(interval.months).toBe(2);
        expect(interval.days).toBe(3);
        expect(interval.hours).toBe(4);
        expect(interval.minutes).toBe(5);
        expect(interval.seconds).toBe(6);
      }
    });
  
    test('should parse days only interval string correctly', () => {
      const intervalString = 'P5D';
      const interval = DateInterval.fromString(intervalString);
      expect(interval).toBeDefined();
      if (interval) {
        expect(interval.years).toBe(0);
        expect(interval.months).toBe(0);
        expect(interval.days).toBe(5);
        expect(interval.hours).toBe(0);
        expect(interval.minutes).toBe(0);
        expect(interval.seconds).toBe(0);
      }
    });
  
    test('should parse time only interval string correctly', () => {
      const intervalString = 'PT3H15M';
      const interval = DateInterval.fromString(intervalString);
      expect(interval).toBeDefined();
      if (interval) {
        expect(interval.years).toBe(0);
        expect(interval.months).toBe(0);
        expect(interval.days).toBe(0);
        expect(interval.hours).toBe(3);
        expect(interval.minutes).toBe(15);
        expect(interval.seconds).toBe(0);
      }
    });
  
    test('should parse months and years interval string correctly', () => {
      const intervalString = 'P2Y6M';
      const interval = DateInterval.fromString(intervalString);
      expect(interval).toBeDefined();
      if (interval) {
        expect(interval.years).toBe(2);
        expect(interval.months).toBe(6);
        expect(interval.days).toBe(0);
        expect(interval.hours).toBe(0);
        expect(interval.minutes).toBe(0);
        expect(interval.seconds).toBe(0);
      }
    });
  
    test('should parse seconds only interval string correctly', () => {
      const intervalString = 'PT45S';
      const interval = DateInterval.fromString(intervalString);
      expect(interval).toBeDefined();
      if (interval) {
        expect(interval.years).toBe(0);
        expect(interval.months).toBe(0);
        expect(interval.days).toBe(0);
        expect(interval.hours).toBe(0);
        expect(interval.minutes).toBe(0);
        expect(interval.seconds).toBe(45);
      }
    });
  
    test('should parse zeroed interval string correctly', () => {
      const intervalString = 'P0D';
      const interval = DateInterval.fromString(intervalString);
      expect(interval).toBeDefined();
      if (interval) {
        expect(interval.years).toBe(0);
        expect(interval.months).toBe(0);
        expect(interval.days).toBe(0);
        expect(interval.hours).toBe(0);
        expect(interval.minutes).toBe(0);
        expect(interval.seconds).toBe(0);
      }
    });
  });

  describe('toString', () => {
    test('should convert full interval object to correct string', () => {
      const interval = new DateInterval(1, 2, 3, 4, 5, 6);
      expect(interval.toString()).toBe('P1Y2M3DT4H5M6S');
    });
  
    test('should convert days only interval object to correct string', () => {
      const interval = new DateInterval(0, 0, 5, 0, 0, 0);
      expect(interval.toString()).toBe('P5D');
    });
  
    test('should convert time only interval object to correct string', () => {
      const interval = new DateInterval(0, 0, 0, 3, 15, 0);
      expect(interval.toString()).toBe('PT3H15M');
    });
  
    test('should convert months and years interval object to correct string', () => {
      const interval = new DateInterval(2, 6, 0, 0, 0, 0);
      expect(interval.toString()).toBe('P2Y6M');
    });
  
    test('should convert seconds only interval object to correct string', () => {
      const interval = new DateInterval(0, 0, 0, 0, 0, 45);
      expect(interval.toString()).toBe('PT45S');
    });
  
    test('should convert zeroed interval object to correct string', () => {
      const interval = new DateInterval(0, 0, 0, 0, 0, 0);
      expect(interval.toString()).toBe('P0D');
    });
  });

  describe('equals', () => {
    test('should return true for equal intervals', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(1, 2, 3, 4, 5, 6);
  
      expect(interval1.equals(interval2)).toBe(true);
    });
  
    test('should return false for intervals with different years', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(2, 2, 3, 4, 5, 6);
  
      expect(interval1.equals(interval2)).toBe(false);
    });
  
    test('should return false for intervals with different months', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(1, 3, 3, 4, 5, 6);
  
      expect(interval1.equals(interval2)).toBe(false);
    });
  
    test('should return false for intervals with different days', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(1, 2, 4, 4, 5, 6);
  
      expect(interval1.equals(interval2)).toBe(false);
    });
  
    test('should return false for intervals with different hours', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(1, 2, 3, 5, 5, 6);
  
      expect(interval1.equals(interval2)).toBe(false);
    });
  
    test('should return false for intervals with different minutes', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(1, 2, 3, 4, 6, 6);
  
      expect(interval1.equals(interval2)).toBe(false);
    });
  
    test('should return false for intervals with different seconds', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(1, 2, 3, 4, 5, 7);
  
      expect(interval1.equals(interval2)).toBe(false);
    });
  
    test('should return true for intervals with all zero values', () => {
      const interval1 = new DateInterval(0, 0, 0, 0, 0, 0);
      const interval2 = new DateInterval(0, 0, 0, 0, 0, 0);
  
      expect(interval1.equals(interval2)).toBe(true);
    });
  
    test('should return false when comparing an interval with a zeroed interval', () => {
      const interval1 = new DateInterval(1, 2, 3, 4, 5, 6);
      const interval2 = new DateInterval(0, 0, 0, 0, 0, 0);
  
      expect(interval1.equals(interval2)).toBe(false);
    });
  });
});