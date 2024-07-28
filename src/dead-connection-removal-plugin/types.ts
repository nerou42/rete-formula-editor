import { ClassicPreset, GetSchemes } from "rete";

export type Node = ClassicPreset.Node & {
  addIOChangedListener(listener: IOChangedListener): void;
  removeIOChangedListener(listener: IOChangedListener): void;
}

export type Connection = ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>;

export type Scheme = GetSchemes<Node, Connection>;

export type InputAddedEvent = {
  type: 'inputAdded';
  input: string | number | symbol;
}

export type InputRemovedEvent = {
  type: 'inputRemoved';
  input: string | number | symbol;
}

export type OutputAddedEvent = {
  type: 'outputAdded';
  output: string | number | symbol;
}

export type OutputRemovedEvent = {
  type: 'outputRemoved';
  output: string | number | symbol;
}

export type ControlAddedEvent = {
  type: 'controlAdded';
  control: string | number | symbol;
}

export type ControlRemovedEvent = {
  type: 'controlRemoved';
  control: string | number | symbol;
}

export type IOChangedEvent = InputAddedEvent | InputRemovedEvent | OutputAddedEvent | OutputRemovedEvent | ControlAddedEvent | ControlRemovedEvent;

export type IOChangedListener = (event: IOChangedEvent) => void | Promise<void>;