export const log = (params: any = {}): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): any => {
    const originalMethod = descriptor.value;

    descriptor.value = (...args: Array<any>) => {
      const result = originalMethod.apply(this);

      return result;
    };

    return descriptor;
  };
};
