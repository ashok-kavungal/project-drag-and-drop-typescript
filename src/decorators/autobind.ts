//autobind logic
export function autobind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const bindedfn = method.bind(this);
        return bindedfn;
      }
    };
    return adjDescriptor;
  }  