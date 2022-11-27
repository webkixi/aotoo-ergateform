import * as React from 'react';
import { Form, Space } from 'antd';
import { adapterItemConfig, adapterConfig } from './parse';
import { WrapInputElement } from './wrapElement';
import 'antd/dist/reset.css';

function useSelectOprate() {
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

/**
 * ErgateForm
 * antd 表单配置化，模块化的封装
 * https://www.github.com/webkixi/aotoo-ergateform
 */
function ErgateForm(formConfig: FormType) {
  const [_form] = Form.useForm();
  const [selectOp] = useSelectOprate();
  const { data, ...restField } = formConfig;
  const formProperty = restField;
  const form: any = formProperty.form || _form;
  form.selectOp = selectOp;
  if (!formProperty.form) {
    formProperty.form = form;
  }
  const [__id__] = React.useState('bind custom callback');
  const formContext = {
    getForm() {
      return {
        ...form,
        setOptions(id: string, options: OptionsType[]) {
          selectOp.setOptions(id, options);
        },
      };
    },
  };

  let { fields, directUnions, flatFormNames } = adapterConfig(data, selectOp);
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
      {fields.map((field) =>
        field.type == 'direct-union-callback' ? (
          field.memo
        ) : React.isValidElement(field) ? (
          field
        ) : (
          <WrapInputElement {...field} />
        )
      )}
    </Form>
  );
}

// 为了方便，不用单独引用antd
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

const FormItem: React.FC<ItemType> = (props) => {
  const form: any = Form.useFormInstance();
  const selectOp = form.selectOp;
  const res = adapterItemConfig({ ...props }, [{ ...props }], selectOp);
  return <WrapInputElement {...res.current} />;
};

export function formItem(itemConfig: ItemType) {
  return <FormItem {...itemConfig} />;
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

export default ErgateForm;
