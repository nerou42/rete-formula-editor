import { Operator, Type, TypeType } from 'formula-ts-helper';
import { TypeInterface } from 'rete-advanced-sockets-plugin';

export class WrapperType implements TypeInterface {
  public readonly type: Type;
  private readonly allowCast: boolean;

  constructor(type: Type, allowCast: boolean = true) {
    this.type = type;
    this.allowCast = allowCast;
  }

  assignableBy(socketType: WrapperType): boolean {
    if(!(socketType instanceof WrapperType)) {
      return false;
    }
    if (this.type.assignableBy(socketType.type)) {
      return true;
    }
    return this.allowCast && canCastTo(socketType.type, this.type);
  }
}
function canCastTo(source: Type, target: Type): boolean {
  for (const typeCast of source.getCompatibleOperands(Operator.TYPE_CAST)) {
    if (typeCast instanceof TypeType)
      if (target.assignableBy(typeCast.getType())) {
        return true;
      }
  }
  return false;
}
