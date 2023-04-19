import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";


/**
 *
 * @description 校验是否一致
 * @example password 和 password_confirmed(必须以_confirmed结尾)
 * @export
 * @class IsConfirmed
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint()
export class IsConfirmed implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text === args.object[`${args.property}_confirmed`];
  }

  /** 默认错误文案 */
  defaultMessage(args: ValidationArguments) {
    return "二次确认不一致";
  }
}