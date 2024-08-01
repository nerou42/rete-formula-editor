/**
 * This class is intendet to provide similar functionalits to its PHP counterpart
 */
export class DateInterval {
  public readonly years: number;
  public readonly months: number;
  public readonly days: number;
  public readonly hours: number;
  public readonly minutes: number;
  public readonly seconds: number;

  constructor(
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  ) {
    this.years = years;
    this.months = months;
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  /**
   * Parses a PHP DateInterval string into a DateInterval object.
   * @param string - In the format of PHP DateInterval.
   */
  public static fromString(string: string): DateInterval | undefined {
    // Regular expression to match the DateInterval format
    const regex =
      /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

    const match = string.match(regex);

    if (!match) {
      // Return undefined if the format is incorrect
      return undefined;
    }

    // Extract the matched groups and convert to numbers, default to 0 if undefined
    const years = parseInt(match[1] || '0', 10);
    const months = parseInt(match[2] || '0', 10);
    const days = parseInt(match[3] || '0', 10);
    const hours = parseInt(match[4] || '0', 10);
    const minutes = parseInt(match[5] || '0', 10);
    const seconds = parseInt(match[6] || '0', 10);

    return new DateInterval(years, months, days, hours, minutes, seconds);
  }

  /**
   * Converts the DateInterval object to a PHP DateInterval string.
   * @returns The PHP DateInterval string representation.
   */
  toString(): string {
    let result = 'P';

    // Add years, months, and days if they are greater than zero
    if (this.years > 0) result += `${this.years}Y`;
    if (this.months > 0) result += `${this.months}M`;
    if (this.days > 0) result += `${this.days}D`;

    // If time components are present, add 'T' and time components
    if (this.hours > 0 || this.minutes > 0 || this.seconds > 0) {
      result += 'T';
      if (this.hours > 0) result += `${this.hours}H`;
      if (this.minutes > 0) result += `${this.minutes}M`;
      if (this.seconds > 0) result += `${this.seconds}S`;
    }

    // Return the resulting string
    return result === 'P' ? 'P0D' : result;
  }

  /**
   * Compares this DateInterval object with another for equality.
   * @param other - The other DateInterval object to compare against.
   * @returns True if the objects are equal, otherwise false.
   */
  equals(other: DateInterval): boolean {
    return (
      this.years === other.years &&
      this.months === other.months &&
      this.days === other.days &&
      this.hours === other.hours &&
      this.minutes === other.minutes &&
      this.seconds === other.seconds
    );
  }

  public clone(): DateInterval {
    return new DateInterval(
      this.years,
      this.months,
      this.days,
      this.hours,
      this.minutes,
      this.seconds
    );
  }
}
