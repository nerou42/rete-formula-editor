import { DateInterval } from './DateInterval';
import { FormulaControl } from './FormulaControl';

export class DateIntervalControl extends FormulaControl<DateInterval> {
  override getSource(value: DateInterval): string {
    return "'" + value.toString() + "'";
  }

  isValid(value: DateInterval): boolean {
    return true;
  }

  setFromSource(source: string): void {
    const dateInterval = DateInterval.fromString(source);
    if(dateInterval === undefined) {
      throw new Error(source + ' is no valid format for DateInterval');
    }
    this.value = dateInterval;
  }

  protected override getDefaultValue(): DateInterval {
    return new DateInterval(0, 0, 0, 0, 0, 0);
  }
}
