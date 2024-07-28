import { FormulaControl } from "./FormulaControl";

export class FloatControl extends FormulaControl<number> {
  override getSource(value: number): string {
    if(!(value + '').includes('.')) {
      return value + '.0';
    } else {
      return value + '';
    }
  }

  setFromSource(source: string): void {
    const numeric = parseFloat(source);
    if (!Number.isNaN(numeric)) {
      this.value = numeric;
    } else {
      throw new Error('Invalid float ' + source);
    }
  }
  protected override getDefaultValue(): number {
    return 0.0;
  }
}
