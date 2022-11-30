import * as React from 'react';
import { Form, Space } from 'antd';
import { adapterItemConfig, adapterConfig } from './parse';
import { WrapInputElement } from './wrapElement';
import renderMemos from './renderMemos';
import useSelectOprate from './useSelectOprate';
import 'antd/dist/reset.css';

/**
 * ErgateForm
 * antd 表单配置化，模块化的封装
 * https://www.github.com/webkixi/aotoo-ergateform
 */
function ErgateForm(formConfig: FormType) {
  const [_form] = Form.useForm();
  const [selectOp] = useSelectOprate();
  const { data, state, ...restField } = formConfig;
  const formProperty = restField;
  const form: any = formProperty.form || _form;
  const [status, setStatus] = React.useState(state || {});

  const setMystate = (params: {}) => {
    const newState = { ...status, ...params };
    setStatus(newState);
  };

  const realyData =
    typeof data === 'function' ? data(status, setMystate) : data;

  form.operate = { selectOp };
  if (!formProperty.form) {
    formProperty.form = form;
  }

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

  const { fields, directUnions, flatFormNames, flatChilds } = adapterConfig(
    realyData,
    form.operate
  );

  const formWatcher: { [propName: string]: any } = {};
  for (let ii = 0; ii < directUnions.length; ii++) {
    const [eventName, name] = directUnions[ii];
    if (flatFormNames.indexOf(name) > -1) {
      formWatcher[name] = Form.useWatch(name, form);
    }
  }

  const fieldsData = renderMemos(fields, {
    flatFormNames,
    formWatcher,
    formContext,
    status,
  });

  return (
    <Form {...formProperty}>
      {fieldsData.map((field) =>
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
  const res = adapterItemConfig({ ...props }, [{ ...props }], form.operate);
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
