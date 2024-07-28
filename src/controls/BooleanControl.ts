import { FormulaControl } from "./FormulaControl";

export class BooleanControl extends FormulaControl<boolean> {

  override getSource(value: boolean): string {
    return value ? 'true' : 'false';
  }

  setFromSource(source: string): void {
    if (source === 'true') {
      this.value = true;
    } else if (source === 'false') {
      this.value = false;
    } else {
      throw new Error('Invalid boolean constant ' + source);
    }
  }

  protected override getDefaultValue(): boolean {
    return false;
  }
}
