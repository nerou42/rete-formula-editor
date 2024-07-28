import { NodeEditor, NodeId, Root, Scope } from "rete";
import { IOChangedEvent, IOChangedListener, Scheme } from "./types";

/**
 * This plugin handles the deletion of dead connections which can occour after removing inputs/outputs or nodes
 */
export class DeadConnectionRemovalPlugin<S extends Scheme> extends Scope<never, [Root<S>]> {

  constructor() {
    super('DeadConnectionRemovalPlugin');
  }

  override setParent(scope: Scope<Root<S>>): void {
    super.setParent(scope);
    const editor = this.parentScope<NodeEditor<S>>(NodeEditor);
    const listeners: Record<NodeId, IOChangedListener> = {};
    this.addPipe(async (signal) => {
      switch (signal.type) {
        case 'nodecreated':
          const listener: IOChangedListener = async (event: IOChangedEvent) => {
            switch (event.type) {
              case 'inputRemoved':
                const deadConnections = editor.getConnections().filter(c => c.target === signal.data.id && c.targetInput === event.input);
                for (const deadConnection of deadConnections) {
                  await editor.removeConnection(deadConnection.id);
                }
                break;
              case 'outputRemoved':
                const deadConnections1 = editor.getConnections().filter(c => c.source === signal.data.id && c.sourceOutput === event.output);
                for (const deadConnection of deadConnections1) {
                  await editor.removeConnection(deadConnection.id);
                }
                break;
            }
          }
          signal.data.addIOChangedListener(listener);
          listeners[signal.data.id] = listener;
          break;
        case 'noderemoved':
          signal.data.removeIOChangedListener(listeners[signal.data.id]);
          const deadConnections = editor.getConnections().filter(c => c.source === signal.data.id || c.target === signal.data.id);
          for (const deadConnection of deadConnections) {
            await editor.removeConnection(deadConnection.id);
          }
          break;
      }
      return signal;
    });
  }
}
