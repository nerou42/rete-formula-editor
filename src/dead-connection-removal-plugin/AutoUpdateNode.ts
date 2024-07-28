import { ClassicPreset } from "rete";
import { Control, Socket } from "rete/_types/presets/classic";
import { IOChangedEvent, IOChangedListener } from "./types";

export class AutoUpdateNode<Inputs extends {
  [key in string]?: Socket;
} = {
    [key in string]?: Socket;
  }, Outputs extends {
    [key in string]?: Socket;
  } = {
    [key in string]?: Socket;
  }, Controls extends {
    [key in string]?: Control;
  } = {
    [key in string]?: Control;
  }> extends ClassicPreset.Node<Inputs, Outputs, Controls> {

  private ioChangedListeners: IOChangedListener[] = [];

  addIOChangedListener(listener: IOChangedListener): void {
    this.ioChangedListeners.push(listener);
  }

  removeIOChangedListener(listener: IOChangedListener): void {
    this.ioChangedListeners = this.ioChangedListeners.filter(l => l !== listener);
  }

  private triggerEvent(event: IOChangedEvent): void {
    this.ioChangedListeners.forEach(l => l(event));
  }

  override addInput<K extends keyof Inputs>(key: K, input: ClassicPreset.Input<Exclude<Inputs[K], undefined>>): void {
    super.addInput(key, input);
    this.triggerEvent({type: 'inputAdded', input: key});
  }

  override removeInput(key: keyof Inputs): void {
    super.removeInput(key);
    this.triggerEvent({type: 'inputRemoved', input: key});
  }

  override addControl<K extends keyof Controls>(key: K, control: Controls[K]): void {
    super.addControl(key, control);
    this.triggerEvent({type: 'controlAdded', control: key});
  }

  override removeControl(key: keyof Controls): void {
    super.removeControl(key);
    this.triggerEvent({type: 'controlRemoved', control: key});
  }

  override addOutput<K extends keyof Outputs>(key: K, output: ClassicPreset.Output<Exclude<Outputs[K], undefined>>): void {
    super.addOutput(key, output);
    this.triggerEvent({type: 'outputAdded', output: key});
  }

  override removeOutput(key: keyof Outputs): void {
    super.removeOutput(key);
    this.triggerEvent({type: 'outputRemoved', output: key});
  }
}