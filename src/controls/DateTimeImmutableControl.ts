import { FormulaControl } from './FormulaControl';

export class DateTimeImmutableControl extends FormulaControl<Date> {
  override getSource(value: Date): string {
    return "'" + formatDateToString(value) + "'";
  }

  isValid(value: Date): boolean {
    return true;
  }

  setFromSource(source: string): void {
    const date = stringToDate(source);
    if(date === undefined) {
      throw new Error(source + ' is no valid dateTime');
    }
    this.value = date;;
  }

  protected override getDefaultValue(): Date {
    return new Date();
  }
}

export function stringToDate(source: string): Date | undefined {
  const dateRegex =
      /^(?<y>\d{4})-(?<m>\d{2})(?:-(?<d>\d{2}))?(?:[T\s](?<hh>\d{2}):(?<mm>\d{2})(?::(?<ss>\d{2}))?(?:[+-](?<tz>\d{2}:\d{2}))?(?:(?:\.(?<u>\d{2,4}))?[Z])?)?$/i;
    const match = source.match(dateRegex);

    if (!match || !match.groups) {
      return undefined;
    }
    return new Date(source);

    // const { y, m, d, hh, mm, ss, u } = match.groups;

    
    // const year = parseInt(y, 10);
    // const month = parseInt(m, 10) - 1; // JavaScript months are 0-11
    // const day = d ? parseInt(d, 10) : 1; // Default to 1 if day is not provided
    // const hours = hh ? parseInt(hh, 10) : 0;
    // const minutes = mm ? parseInt(mm, 10) : 0;
    // const seconds = ss ? parseInt(ss, 10) : 0;
    // const milliseconds = u ? parseInt(u.padEnd(3, '0'), 10) : 0; // Pad to ensure milliseconds
    
    // // console.log(hours);
    // // console.log(minutes);
    // // console.log(seconds);
    // // console.log(milliseconds);

    // // const date = new Date(
    // //   Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
    // // );
    // // console.log(date.getHours());
    // return new Date(
    //   year, month, day, hours, minutes, seconds, milliseconds
    // );
}

export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
