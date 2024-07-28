import { FormulaControl } from "./FormulaControl";

export class StringControl extends FormulaControl<string> {
  override getSource(value: string): string {
    return '\'' + value + '\'';
  }

  protected override getDefaultValue(): string {
    return '';
  }
}
