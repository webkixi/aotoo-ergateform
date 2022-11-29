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
  Space,
} from 'antd';
const TextArea = Input.TextArea;
const Search = Input.Search;
const Group = Input.Group;
const Password = Input.Password;
const TimeRangePicker = TimePicker.RangePicker;
const DateRangePicker = DatePicker.RangePicker;

function generateInput(inputConfig: InputType) {
  if (React.isValidElement(inputConfig)) {
    return inputConfig;
  }

  let { type, buttonType, ...restField } = inputConfig;
  type = type && type.toLowerCase();
  switch (type) {
    case 'button':
      return <Button {...restField} type={buttonType} />;
      break;
    case 'text':
      return <Input {...restField} />;
      break;
    case 'textarea':
      return <TextArea {...restField} />;
      break;
    case 'search':
      return <Search {...restField} />;
      break;
    case 'password':
      return <Password {...restField} />;
      break;

    case 'cascader':
      return <Cascader {...restField} />;
      break;
    case 'select':
      return <Select {...restField} />;
      break;
    case 'autocomplete':
      return <AutoComplete {...restField} />;
      break;
    case 'inputnumber':
      return <InputNumber {...restField} />;
      break;

    case 'rate':
      return <Rate {...restField} />;
      break;
    case 'slider':
      return <Slider {...restField} />;
      break;
    case 'switch':
      return <Switch {...restField} />;
      break;
    case 'timepicker':
      return <TimePicker {...restField} />;
      break;

    case 'timerange':
      return <TimeRangePicker {...restField} />;
      break;

    case 'treeselect':
      return <TreeSelect {...restField} />;
      break;
    case 'datepicker':
      return <DatePicker {...restField} />;
      break;
    case 'daterange':
      return <DateRangePicker {...restField} />;
      break;
    // CheckboxGroup
    case 'checkbox':
      return <Checkbox {...restField} />;
      break;

    case 'checkboxgroup':
      return <Checkbox.Group {...restField} />;
      break;

    case 'radio':
      return <Radio {...restField} />;
      break;

    case 'radiogroup':
      return <Radio.Group {...restField} />;
      break;

    default:
      return null;
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
    if (unionEvnets?.includes(evt)) {
      restField[evt] = eventHandle(restField[evt]);
    } else {
      const oldCallback = restField[evt];
      restField[evt] = function () {
        const args: any = arguments;
        const context = {
          ...this,
          ...util,
        };
        oldCallback.apply(context, [...args]);
      };
    }
  });

  return generateInput(restField);
};

export default InputUnitElement;
