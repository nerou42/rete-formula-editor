import { ClassicPreset } from 'rete';

export abstract class FormulaControl<T> extends ClassicPreset.Control {
  private _value: T;
  private changeListeners: ((newValue: T) => void)[] = [];

  constructor(initialValue?: T) {
    super();
    if (initialValue !== undefined) {
      this._value = initialValue;
    } else {
      this._value = this.getDefaultValue();
    }
  }

  abstract isValid(value: T): boolean;

  protected abstract getSource(value: T): string;

  getStringSource(): string {
    return this.getSource(this._value);
  }

  protected abstract getDefaultValue(): T;

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    if (!this.isValid(value)) {
      throw new Error('Value ' + value + ' is not valid');
    }
    this._value = value;
    for (const changeListener of this.changeListeners) {
      changeListener(value);
    }
  }

  addChangeListener(listener: (newValue: T) => void): void {
    this.changeListeners.push(listener);
  }

  getValue(): any {
    return this.value;
  }
}
