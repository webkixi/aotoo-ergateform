import * as React from 'react';

export default function renderMemos(allfields: any[], params: any) {
  const { flatFormNames, formWatcher, formContext, status } = params;
  return allfields.map((field, ii) => {
    if (field.type === 'direct-union-callback') {
      const { name, directUnionCallback, event } = field;
      if (flatFormNames.indexOf(field.name) > -1) {
        const theMemo = React.useMemo(() => {
          if (formWatcher[field.name] !== undefined) {
            let jsx =
              directUnionCallback.call(formContext, formWatcher[name]) || null;
            if (jsx && !jsx.key) {
              jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
            }
            return jsx;
          }
        }, [formWatcher[field.name]]);
        return {
          type: 'direct-union-callback',
          memo: theMemo,
        };
      } else if (name.indexOf('state.') === 0 || status.hasOwnProperty(name)) {
        const _name = name.replace(/state\./gi, '');
        const theMemo = React.useMemo(() => {
          if (status[_name] !== undefined) {
            let jsx =
              directUnionCallback.call(formContext, status[_name]) || null;
            if (jsx && !jsx.key) {
              jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
            }
            return jsx;
          }
        }, [status[_name]]);
        return {
          type: 'direct-union-callback',
          memo: theMemo,
        };
      } else {
        const stockMemo = React.useMemo(() => {
          let jsx =
            directUnionCallback.call(formContext, formWatcher[name]) || null;
          if (jsx && !jsx.key) {
            jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
          }
          return jsx;
        }, []);
        return {
          type: 'direct-union-callback',
          memo: stockMemo,
        };
      }
    } else {
      if (Array.isArray(field.inputElement)) {
        field.inputElement = renderMemos(field.inputElement, {
          flatFormNames,
          formWatcher,
          formContext,
          status,
        });
      }
    }
    return field;
  });
}
