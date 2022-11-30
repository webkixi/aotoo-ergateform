import * as React from 'react';
export default function useSelectOprate() {
  const data: any = React.useRef([]);
  function setAction(id: string, func: any) {
    const target = data.current.filter((item: OptionsType) => item.id === id);
    if (!target.length) {
      data.current = [...data.current, { id, action: func }];
    }
  }

  function setOptions(id: string, option: OptionsType[]) {
    const target: SelectActionType[] = data.current.filter(
      (item: OptionsType) => item.id === id
    );
    if (target.length) {
      const action = target[0].action;
      action(option);
    }
  }

  return [
    {
      setAction,
      setOptions,
    },
  ];
}
