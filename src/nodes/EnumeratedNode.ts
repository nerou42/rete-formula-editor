import { MixedType, Type } from 'formula-ts-helper';
import { ClassicPreset } from 'rete';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';
import { WrapperType } from '../WrapperType';

export abstract class EnumeratedNode extends FormulaNode {

  private readonly outputSocket: AdvancedSocket<WrapperType>;

  protected argumentInputs: ClassicPreset.Input<AdvancedSocket<WrapperType>>[] = [];

  protected argumentTypes: WrapperType[] = [];

  constructor(name: string) {
    super(name);
    this.addNextInput();
    this.outputSocket = new AdvancedSocket<WrapperType>(this.getType());
    const output = new ClassicPreset.Output(this.outputSocket);
    this.addOutput('output', output);
  }

  private addNextInput(): void {
    const inputIndex = this.argumentInputs.length;
    const socket = new AdvancedSocket<WrapperType>(new WrapperType(new MixedType()));
    socket.addListener('onConnectionChanged', (e) => {
      console.log(e, inputIndex, this.argumentInputs.length - 1);
      if (inputIndex === this.argumentInputs.length - 1 && e.oldConnection === null) { // last got connected
        this.addNextInput();
      }
      if (inputIndex === this.argumentInputs.length - 2 && e.newConnection === null) { // second last got disconnected
        this.removeLastUnconnectedInputs();
      }
      if (e.newConnection !== null) {
        this.argumentTypes[inputIndex] = e.newConnection.otherSocket.type;
      }
      this.outputSocket.type = this.getType();
    });
    const input = new ClassicPreset.Input(socket);
    this.addInput(this.argumentInputs.length + '', input);
    this.argumentInputs.push(input);
  }

  protected abstract getType(): WrapperType;

  private removeLastUnconnectedInputs(): void {
    let id = this.argumentInputs.length - 1;
    while(id > 0) {
      const input = this.inputs[id + ''];
      const inputBefore = this.inputs[id - 1 + ''];
      if(!input?.socket.connectionInfo || !inputBefore?.socket.connectionInfo) {
        return;
      }
      this.removeInput(id + '');
      this.argumentInputs.pop();
      this.argumentTypes.pop();
      id--;
    }
  }
}
