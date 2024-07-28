import { FormulaControl } from "./FormulaControl";

export class IntegerControl extends FormulaControl<number> {
  override getSource(value: number): string {
    return value + '';
  }

  setFromSource(source: string): void {
    const numeric = parseInt(source);
    if (!Number.isNaN(numeric)) {
      this.value = numeric;
    } else {
      throw new Error('Invalid float ' + source);
    }
  }

  protected override getDefaultValue(): number {
    return 0;
  }
}
