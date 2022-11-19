import * as React from 'react';
import { Form, Space } from 'antd';
import { adapterItemConfig, adapterConfig } from './parse';

/**
 * union: {
 *   target: '',
 *   event: '',
 *   callback(targetValue, form){
 *
 *   }
 * }
 */
function AnerForm(formConfig: FormType) {
  const [_form] = Form.useForm();
  const { data, ...restField } = formConfig;
  const formProperty = restField;
  let form = _form;
  if (!formProperty.form) {
    formProperty.form = form;
  } else {
    form = formProperty.form;
  }
  const [__id__] = React.useState('bind custom callback');
  const formContext = {
    getForm() {
      return form;
    },
  };

  let { fields, directUnions, flatFormNames, flatChilds } = adapterConfig(data);
  const formWatcher: { [propName: string]: any } = {};

  for (let ii = 0; ii < directUnions.length; ii++) {
    const [eventName, name] = directUnions[ii];
    if (flatFormNames.indexOf(name) > -1) {
      formWatcher[name] = Form.useWatch(name, form);
    }
  }

  function renderMemos(allfields: any[]) {
    return allfields.map((field, ii) => {
      if (field.type === 'direct-union-callback') {
        const { name, directUnionCallback } = field;
        if (flatFormNames.indexOf(field.name) > -1) {
          const theMemo = React.useMemo(() => {
            let jsx =
              directUnionCallback.call(formContext, formWatcher[name]) || null;
            if (jsx && !jsx.key) {
              jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
            }
            return jsx;
          }, [formWatcher[field.name]]);
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
          }, [__id__]);
          return {
            type: 'direct-union-callback',
            memo: stockMemo,
          };
        }
      } else {
        if (Array.isArray(field.inputElement)) {
          field.inputElement = renderMemos(field.inputElement);
        }
      }
      return field;
    });
  }

  fields = renderMemos(fields);

  return (
    <Form {...formProperty}>
      {fields.map((field) => {
        if (field.type === 'direct-union-callback') {
          return field.memo;
        } else if (React.isValidElement(field)) {
          return field;
        } else {
          const { key, inputElement, ...restField } = field;
          if (Array.isArray(inputElement)) {
            return (
              <Space key={key} {...restField}>
                {inputElement.map((sub) => {
                  if (sub.type === 'direct-union-callback') {
                    return sub.memo;
                  } else if (React.isValidElement(sub)) {
                    return sub;
                  } else {
                    const { key, inputElement, ...restField } = sub;
                    return (
                      <Form.Item {...restField} key={key}>
                        {inputElement}
                      </Form.Item>
                    );
                  }
                })}
              </Space>
            );
          } else {
            return (
              <Form.Item {...restField} key={key}>
                {inputElement}
              </Form.Item>
            );
          }
        }
      })}
    </Form>
  );
}

// 为了方便
export { Form } from 'antd';

export function union(name: string, callback: any) {
  let evt = '';
  return {
    type: 'direct-union-callback',
    name,
    event: evt,
    directUnionCallback: callback,
  };
}

export function formItem(itemConfig: ItemType) {
  const res = adapterItemConfig(itemConfig, [itemConfig]);
  const { key, inputElement, ...restField } = res.current;
  if (Array.isArray(inputElement)) {
    return (
      <Space key={key} {...restField}>
        {inputElement.map((sub) => {
          if (sub.type === 'direct-union-callback') {
            return sub.memo;
          } else if (React.isValidElement(sub)) {
            return sub;
          } else {
            const { key, inputElement, ...restField } = sub;
            return (
              <Form.Item {...restField} key={key}>
                {inputElement}
              </Form.Item>
            );
          }
        })}
      </Space>
    );
  }
  return (
    <Form.Item {...restField} key={key}>
      {inputElement}
    </Form.Item>
  );
}

export function formList(listConfig: ListType) {
  const formListConfig: ListType = { ...listConfig };
  return {
    render(callback: any) {
      return (
        <Form.List {...formListConfig}>
          {(fields, { add, remove, move }, { errors }) => {
            return callback.apply(this, [
              fields,
              { add, remove, move },
              { errors },
            ]);
          }}
        </Form.List>
      );
    },
  };
}

export default AnerForm;
