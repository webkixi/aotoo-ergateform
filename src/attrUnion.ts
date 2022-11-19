export default function (current: ItemType, union: any) {
  function inputUnion(unionItem: {
    name: string;
    event: string;
    callback: any;
  }) {
    const { event, callback } = unionItem;
    const currentInput = current['$input'] as any;
    const oldEvent = currentInput[event];
    currentInput[event] = function () {
      const args: any = arguments;
      const util = args[args.length - 1];
      const context = {
        ...this,
        getForm: util.getForm,
      };
      if (typeof oldEvent === 'function') {
        oldEvent.apply(context, [...args]);
      }
      if (typeof callback === 'function') {
        callback.apply(context, [...args]);
      }
    };
    const tempAry = currentInput['unionEvnets'] || [];
    if (!tempAry.includes(event)) {
      tempAry.push(event);
    }
    currentInput['unionEvnets'] = tempAry;
    current['$input'] = currentInput;
  }

  if (union) {
    if (Array.isArray(union)) {
      union.forEach((unionItem) => inputUnion(unionItem));
    } else {
      inputUnion(union);
    }
  }

  return current;
}
