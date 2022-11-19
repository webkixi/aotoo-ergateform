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
import 'antd/dist/antd.css';
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

  let { type, ...restField } = inputConfig;
  type = type && type.toLowerCase();
  switch (type) {
    case 'button':
      return <Button {...restField} />;
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

    default:
      return null;
  }
}

const InputUnitElement: React.FC<InputType> = (props) => {
  const form = Form.useFormInstance();
  let { unionEvnets, selfUnion, ...restField } = props;
  const eventHandle = function (callback: any) {
    return function () {
      const args: any = arguments;
      callback.apply(this, [
        ...args,
        {
          getForm() {
            return form;
          },
        },
      ]);
    };
  };
  if (unionEvnets && unionEvnets.length) {
    unionEvnets.forEach((evt: string) => {
      restField[evt] = eventHandle(restField[evt]);
    });
  }
  return generateInput(restField);
};

export default InputUnitElement;
