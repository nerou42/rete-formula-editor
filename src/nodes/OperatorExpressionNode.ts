import { ClassicPreset } from 'rete';
import { CompoundType, MixedType, Operator, OperatorHelper, OperatorType, Type } from 'formula-ts-helper';
import { Option, SelectControl } from '../controls/SelectControl';
import { optionalStringValidator, stringValidator } from '../types';
import { InvalidNodeError } from '../invalidNodeError';
import { FormulaNode } from './FormulaNode';
import { OnConnectionChangedEvent } from 'rete-advanced-sockets-plugin';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';
import { WrapperType } from '../WrapperType';

export class OperatorExpressionNode extends FormulaNode {

  private _operator: Operator;

  private typeA: Type | null = null;
  private typeB: Type | null = null;
  private outputSocket: AdvancedSocket<WrapperType>;

  constructor(operator?: Operator) {
    super('OperatorExpression');
    this._operator = operator ?? Operator.EQUALS;
    const socketA = new AdvancedSocket<WrapperType>(new WrapperType(new MixedType()));
    const inputA = new ClassicPreset.Input(socketA, 'A');
    this.outputSocket = new AdvancedSocket(new WrapperType(new MixedType()));
    const output = new ClassicPreset.Output(this.outputSocket);
    this.addOutput('output', output);
    this.addInput('a', inputA);
    socketA.addListener('onConnectionChanged', (e) => this.connectionChanged(e));
    this.setAvailableOperators(OperatorHelper.getAllOperators());
  }

  connectionChanged(e: OnConnectionChangedEvent<WrapperType>) {
    if (e.newConnection === null) {
      this.removeInputB();
      return;
    }
    this.typeA = e.newConnection.otherSocket.type.type;
    this.setAvailableOperators(this.typeA.getImplementedOperators());
  }

  setAvailableOperators(operators: Operator[]): void {
    const options: Option<Operator>[] = [];
    for (const operator of operators) {
      options.push({
        label: new OperatorHelper(operator).toString(null, null),
        value: operator,
      });
    }
    let lastValue: Operator = operators[0];
    if (this.hasControl('operator')) {
      const control = this.controls['operator'];
      lastValue = (control as SelectControl<Operator>).value ?? lastValue;
      this.removeControl('operator');
    }
    const newControl = new SelectControl(options);
    if (newControl.hasValue(lastValue)) {
      newControl.value = lastValue;
    }
    newControl.addChangeListener(newOperator => this.operator = newOperator ?? this.operator);
    this.addControl('operator', newControl);
  }

  private updateOutput(): void {
    let resultType = this.typeA?.getOperatorResultType(this.operator, this.typeB) ?? new MixedType();
    this.outputSocket.type = new WrapperType(resultType);
  }

  set operator(operator: Operator) {
    this._operator = operator;
    if (new OperatorHelper(operator).getOperatorType() !== OperatorType.InfixOperator) {
      this.updateInputB([]);
    } else { // infix
      this.updateInputB(this.typeA?.getCompatibleOperands(operator) ?? []);
    }
    this.updateOutput();
  }

  get operator(): Operator {
    return this._operator;
  }

  private removeInputB(): void {
    if (this.hasInput('b')) {
      this.removeInput('b');
    }
    this.typeB = null;
  }

  private updateInputB(compatibleTypes: Type[]): void {
    if(compatibleTypes.length === 0) {
      this.removeInputB();
      return;
    }
    const compounType = CompoundType.buildFromTypes(compatibleTypes);
    if (this.inputs['b']?.socket) {
      this.inputs['b'].socket.type = new WrapperType(compounType);
      this.typeB = this.inputs['b'].socket.connectionInfo?.otherSocket.type.type ?? null;
      this.updateOutput();
      return;
    }
    this.removeInputB();
    const socket = new AdvancedSocket(new WrapperType(compounType));
    socket.addListener('onConnectionChanged', (e: OnConnectionChangedEvent<WrapperType>) => {
      if (e.newConnection === null) {
        this.typeB = null;
        return;
      }
      this.typeB = e.newConnection.otherSocket.type.type;
      this.updateOutput();
    });
    const input = new ClassicPreset.Input(socket, 'B');
    this.addInput('b', input);
  }

  override data(inputs: Record<string, any>): { output: string } {
    const validated = this.validateInputs(inputs, { a: stringValidator, b: optionalStringValidator });
    if (
      this.operator === undefined
      || (new OperatorHelper(this.operator).getOperatorType() === OperatorType.InfixOperator && inputs['b'] === undefined)
    ) {
      throw new InvalidNodeError('Incomplete formula', this.id);
    }
    return {
      output: '(' + new OperatorHelper(this.operator!).toString(validated.a ?? null, validated.b ?? null) + ')',
    };
  }
}
