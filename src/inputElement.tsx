import * as React from 'react';
import {
  Button,
  Form,
  Input,
  Cascader,
  Select,
  AutoComplete,
  InputNumber,
  Radio,
  Checkbox,
  Rate,
  Slider,
  Switch,
  TimePicker,
  TreeSelect,
  DatePicker,
  Transfer,
  Upload,
  Space,
} from 'antd';
const TextArea = Input.TextArea;
const Search = Input.Search;
const Group = Input.Group;
const Password = Input.Password;
const TimeRangePicker = TimePicker.RangePicker;
const DateRangePicker = DatePicker.RangePicker;

const compoents: {[propName: string]: any;} = {
  button: Button,
  text: Input,
  textarea: TextArea,
  search: Search,
  password: Password,
  cascader: Cascader,
  select: Select,
  autocomplete: AutoComplete,
  inputnumber: InputNumber,
  number: InputNumber,
  rate: Rate,
  slider: Slider,
  switch: Switch,
  timepicker: TimePicker,
  timerange: TimeRangePicker,
  datepicker: DatePicker,
  daterange: DateRangePicker,
  treeselect: TreeSelect,
  checkbox: Checkbox,
  checkboxgroup: Checkbox.Group,
  radio: Radio,
  radiogroup: Radio.Group,
  transfer: Transfer,
  upload: Upload,
};

function inputComponent(Component: any, type: string, params: any) {
  if (type === 'button') {
    const { buttonType, ...restField } = params;
    return <Button {...restField} type={buttonType} />;
  }

  if (type === 'upload') {
    const { fieldName, ...restField } = params;
    return <Upload {...restField} name={fieldName} />;
  }

  if (type === 'checkboxgroup' || type === 'radiogroup') {
    const { direction, options, ...restField } = params;
    const ChildComponent = type === 'checkboxgroup' ? Checkbox : Radio;
    if (direction) {
      const opts = options.map(
        (
          item: { label: string; value: string | number; children?: any },
          ii: number
        ) => {
          return (
            <ChildComponent
              key={`${type}-${item.value}-${ii}`}
              value={item.value}
            >
              {item.label}
              {item.children}
            </ChildComponent>
          );
        }
      );
      return (
        <Component {...restField}>
          <Space direction={direction}>{opts}</Space>
        </Component>
      );
    }
    return <Component {...restField} />;
  }

  return <Component {...params} />;
}

function generateInput(inputConfig: InputType) {
  if (React.isValidElement(inputConfig)) {
    return inputConfig;
  }
  const { type, ...restField } = inputConfig;
  if (type) {
    return inputComponent(compoents[type], type, restField);
  } else {
    console.warn('需要指定组件type');
    return null
  }
}

const eventsString = ['blur', 'focus'];
function isEventProperty(attribut: string) {
  const res = attribut.indexOf('on') === 0 ? true : false;
  return res ? res : eventsString.includes(attribut);
}

const InputUnitElement: React.FC<InputType> = (props) => {
  const form = Form.useFormInstance();
  const eventAttributs: string[] = [];
  let { unionEvnets, selfUnion, operate, ...restField } = props;
  const [opts, setOpts] = React.useState<OptionsType[]>(
    restField.options || []
  );

  Object.keys(restField).forEach((ky: string) => {
    if (isEventProperty(ky)) {
      eventAttributs.push(ky);
    }
  });

  const util: any = {
    getForm() {
      return {
        ...form,
        setOptions(id: string, options: OptionsType[]) {
          operate.selectOp.setOptions(id, options);
        },
      };
    },
  };

  if (restField.type === 'select' || restField.type === 'cascader') {
    operate.selectOp.setAction(restField.id, setOpts);
    restField.options = opts;
  }

  const eventHandle = function (callback: any) {
    return function () {
      const args: any = arguments;
      callback.apply(this, [...args, util]);
    };
  };

  eventAttributs.forEach((evt: string) => {
    restField[evt] = eventHandle(restField[evt]);
  });

  return generateInput(restField);
};

export default InputUnitElement;
