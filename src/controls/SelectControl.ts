import { ClassicPreset } from "rete";

export interface Option<T = any> { label: string, value: T }

interface IndexedOption<T = any> extends Option<T> {
  id: number;
}

export type SelectChangeListener<T> = (value: T | undefined) => void;

export class SelectControl<T = any> extends ClassicPreset.Control {

  public readonly options: IndexedOption<T>[];

  public _selectedID?: number;

  private listeners: SelectChangeListener<T>[] = [];

  constructor(options: Option<T>[]) {
    super();
    this.options = [];
    let id = 0;
    for (const option of options) {
      this.options.push({
        id,
        label: option.label,
        value: option.value,
      });
      id++;
    }
    this.selectedID = options.length > 0 ? 0 : undefined;
  }

  addChangeListener(listener: SelectChangeListener<T>): void {
    this.listeners.push(listener);
    listener(this.value);
  }

  set selectedID(selectedID: number | undefined) {
    if(selectedID !== undefined && (selectedID < 0 || selectedID >= this.options.length)) {
      throw new Error('Invalid selectedID ' + selectedID);
    }
    this._selectedID = selectedID;
    this.listeners.forEach(l => l(selectedID === undefined ? undefined : this.options[selectedID].value));
  }

  get selectedID(): number | undefined {
    return this._selectedID;
  }

  set value(value: T | undefined) {
    if (value === undefined) {
      this.selectedID = undefined;
      return;
    }
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];
      if (option.value === value) {
        this.selectedID = i;
        return;
      }
    }
    throw new Error('Select does not contain value ' + value);
  }

  hasValue(value: T): boolean {
    return this.options.find(o => o.value === value) !== undefined;
  }

  get value(): T | undefined {
    if(this._selectedID === undefined) {
      return undefined;
    }
    return this.options[this._selectedID].value;
  }

  getValue(): T | undefined {
    return this.value;
  }
}
