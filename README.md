## anerForm

配置化 antd form 表单组件，通过配置化生成表单，实现了表单联动，动态表单功能，表单属性仍沿用 antd form 各个组件的属性

### 简单的示例

```javascript
const formConfig = {
  labelCol={{ span: 8 }}
  wrapperCol={{ span: 16 }}
  layout="horizontal"
  initialValues={textbox: 'hello world'}
  data: [
    {
      label: '文本框',
      name: 'textbox',
      $input: {
        type: 'text',
      },
    },
  ]
}
```

### 支持的表单组件

### 特殊 key 名

1. $input
2. union

#### $input

如上述例子中，`$input`中主要存放表单组件的属性，如 antd 的 Input
