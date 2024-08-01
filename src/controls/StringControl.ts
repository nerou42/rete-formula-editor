import { FormulaControl } from "./FormulaControl";

export class StringControl extends FormulaControl<string> {
  override getSource(value: string): string {
    return '\'' + value + '\'';
  }

  isValid(value: string): boolean {
    return true;
  }

  protected override getDefaultValue(): string {
    return '';
  }

  setFromSource(source: string): void {
    this.value = source;
  }
}
