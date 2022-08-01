export const log = (params: any = {}): MethodDecorator => {
  return (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>): any => {
    const originalMethod = descriptor.value;

    descriptor.value = (...args: Array<any>) => {
      console.log(`Entering ${String(key)} method`);
      const result = originalMethod.apply(this);
      console.log(`Leaving ${String(key)} method`);

      return result;
    }

    return descriptor;
  }

}
