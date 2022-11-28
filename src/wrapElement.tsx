import * as React from 'react';
import { Form, Space } from 'antd';

const WrapFormItem: React.FC<any> = (props) => {
  const {
    align,
    direction,
    size,
    split,
    wrap,
    block,
    compact,
    children,
    ...restField
  } = props;
  const isSpace =
    align || direction || size || split || wrap || block || compact;
  const spaceProps = {
    align,
    direction,
    size,
    split,
    wrap,
    block,
  };
  if (isSpace) {
    if (compact) {
      return (
        <Form.Item {...restField}>
          <Space.Compact {...spaceProps}>{children}</Space.Compact>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item {...restField}>
          <Space {...spaceProps}>{children}</Space>
        </Form.Item>
      );
    }
  }
  return <Form.Item {...restField}>{props.children}</Form.Item>;
}

const WrapMultipleItem: React.FC<InputType> = (props) => {
  const { type, inputElement, ...restField } = props;
  const containerType =
    type === 'formItem' || type === 'item' ? 'item' : 'space'; // ??? list

  const theChildren: any[] = inputElement.map((sub: InputType) => {
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
  });

  if (containerType === 'item') {
    return <WrapFormItem {...restField}>{theChildren}</WrapFormItem>;
  } else {
    if (restField.compact) {
      return <Space.Compact {...restField}>{theChildren}</Space.Compact>;
    }
    return <Space {...restField}>{theChildren}</Space>;
  }
}

export const WrapInputElement: React.FC<any> = (props) => {
  const { inputElement, ...restField } = props;
  if (Array.isArray(inputElement)) {
    return <WrapMultipleItem {...restField} inputElement={inputElement} />;
  } else {
    return <Form.Item {...restField}>{inputElement}</Form.Item>;
  }
};
