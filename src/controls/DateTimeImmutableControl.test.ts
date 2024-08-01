import { formatDateToString, stringToDate } from "./DateTimeImmutableControl";

describe('DateTimeImmutableControl', () => {
  const tests = [
    {
      testString: '2024-07-31T14:20',
      expectedDate: new Date('2024-07-31T14:20')
    }, {
      testString: '2024-07-31T14:20',
      expectedDate: new Date('2024-07-31T14:20')
    }, {
      testString: '2024-07-31T14:20:30',
      expectedDate: new Date('2024-07-31T14:20:30')
    }, {
      testString: '2024-07-31T14:20:30+02:00',
      expectedDate: new Date('2024-07-31T14:20:30+02:00')
    }, {
      testString: '2024-07-31T14:20:30-04:00',
      expectedDate: new Date('2024-07-31T14:20:30-04:00')
    }, {
      testString: '2024-07-31T14:20:30Z',
      expectedDate: new Date('2024-07-31T14:20:30Z')
    }, {
      testString: '2024-07-31T14:20:30.123Z',
      expectedDate: new Date('2024-07-31T14:20:30.123Z')
    }, {
      testString: '2024-07-31 14:20:30',
      expectedDate: new Date('2024-07-31 14:20:30')
    }
  ];
  for (const test of tests) {
    it('should work with this format ' + test.testString, () => {

      expect(stringToDate(test.testString)?.getTime()).toBe(test.expectedDate.getTime());
    })
    // console.log(formatDateToString(test.expectedDate));
    // console.log(formatDateToString(stringToDate(test.testString)!));
  }
});