const eventsString = ['blur', 'focus'];
function isEventProperty(attribut: string) {
  const res = attribut.indexOf('on') === 0 ? true : false;
  return res ? res : eventsString.includes(attribut);
}

function inputUnion(
  current: any,
  unionItem: {
    target: string;
    event: string;
    callback: any;
  }
) {
  const { target, event, callback } = unionItem;
  const currentInput = current['$input'] as InputType;
  if (target && target === current.name) {
    if (!currentInput[event]) {
      const tempAry = currentInput['unionEvnets'] || [];
      currentInput[event] = function () {
        const args: any = arguments;
        if (args[0] !== undefined) {
          callback.apply(this, [...args]);
        }
      };
      if (tempAry.indexOf(event) === -1) {
        tempAry.push(event);
      }
      currentInput['unionEvnets'] = tempAry;
      current['$input'] = currentInput;
    }
  }

  Object.keys(currentInput).forEach((ky) => {
    if (isEventProperty(ky)) {
      const oldEvent = currentInput[ky];
      currentInput[ky] = function () {
        const args: any = arguments;
        const util = args[args.length - 1];
        const context = {
          ...this,
          getForm: util.getForm,
        };
        if (typeof oldEvent === 'function') {
          oldEvent.apply(context, [...args]);
        }
      };
    }
  });
  current['$input'] = currentInput;
}

export default function (current: ItemType, union: any = {}) {
  if (Array.isArray(union)) {
    union.forEach((unionItem) => inputUnion(current, unionItem));
  } else {
    inputUnion(current, union);
  }

  return current;
}
