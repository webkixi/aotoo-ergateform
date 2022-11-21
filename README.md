## ErgateForm

```bash
npm install @aotoo/ergateform

# or

yarn add @aotoo/ergateform
```

`ErgateForm` 是配置化的 `antd form(react)` 组件。通过配置化生成表单，实现了表单联动、动态表单功能，表单属性仍沿用 antd form 各个组件的属性

### 简单表单

```javascript
import ErgateForm from '@aotoo/ergateform'
import {Form}  from 'antd'

function App(){
  const form = Form.useForm()
  const formConfig = {
    labelCol:{ span: 8 }
    wrapperCol: { span: 16 }
    layout: "horizontal"
    initialValues: {textbox: 'hello world'}
    form: form  // antd的form实例
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

  return (
    <ErgateForm {...formConfig}/>
  )
}
```

### 简单的联动表单

表单值同步

```javascript
import ErgateForm from '@aotoo/ergateform'
import {Form}  from 'antd'

function App(){
  const form = Form.useForm()  // antd的form实例
  const formConfig = {
    labelCol:{ span: 8 }
    wrapperCol: { span: 16 }
    layout: "horizontal"
    initialValues: {textbox: 'hello world'}
    form: form
    data: [
      {
        label: '目标文本框',
        name: 'target-input',
        $input: {
          type: 'text',
        },
      },
      {
        label: '响应文本框',
        name: 'response-input',
        $input: {
          type: 'text',
        },
        union: {
          target: 'target-input',
          event: 'onChange',
          callback(e){
            console.log(e.target.value)
            form.setFieldValue('response-input', e.target.value)
          }
        }
      },
    ]
  }

  return (
    <ErgateForm {...formConfig}/>
  )
}
```

## 支持表单的类型

```javascript
{
  $input: { type: '???', }  // type 用来设置表单类型
}
```

- button  
  Button
- text  
  Input 表单的别名
- textarea  
  Input.TextArea 别名
- search  
  Input.Search
- password  
  Input.Password
- cascader  
  Cascader
- select  
  Select
- autocomplete  
  AutoComplete
- inputnumber  
  InputNumber
- rate  
  Rate
- slider  
  Slider
- switch  
  Switch
- timepicker  
  TimePicker
- timerange  
  TimePicker.RangePicker 别名
- treeselect  
  TreeSelect
- datepicker  
  DatePicker
- daterange  
  DatePicker.RangePicker 别名
- checkbox  
  Checkbox
- radio  
  Radio

## 配置说明

### Form 结构

antd form 最终都会生成`<Form>...</Form>`结构，在`ErgateForm`中使用最外层的非`data`属性来配置 Form

**配置**

```javascript
const formConfig = {
  labelCol:{ span: 8 }
  wrapperCol: { span: 16 }
  layout: "horizontal"
  ...
  data: [...]  // data用来配置 Form.Item 集合
}

return <ErgateForm {...formConfig}/>

// or

return <ErgateForm
  labelCol= {{span: 8}}
  wrapperCol={{span: 16}}
  layout={'horizontal'}
  ...
  data: [...]
/>
```

**生成结构**

```html
<Form labelCol={{ span: 8 }} wraperCol={{ span: 16 }} layout="horizontal">
  ...
</Form>
```

### FormItem 结构

antd 中使用`Form.Item`对表单进行包裹。这里我们使用`data`的数据项来配置`Form.Item`

**配置项**

```javascript
{
  data: [
    {
      label: '标题名',  // 对应 Form.Item 的label属性
      name: 'uniq-name' // 对应 Form.Item 的name属性
      $input: { type: 'text', ... } // $input 会将属性设置到 Input 表单组件中
    }
  ]
}
```

**生成结构**

```html
<Form.Input label="标题名" name="uniq-name">
  <input {...$input} />
</Form.Input>
```

### 特殊属性名

`AnerFome`加入了几个属性，用来控制配置结构和联动

1. $input
2. union

#### $input

`$input`用来配置具体的表单属性，如 `Input, Select`等支持的表单元件，api 属性也与官网一致

#### $input.type

该属性用来标识使用那个表单组件

#### union

该属性用来设置表单联动

#### union.target

描述对齐的目标 name

#### union.event

描述对齐的目标的事件名称，一版我们可以使用`onChange`，大部分表单组件都支持`onChange`事件，当然还可以使用其他事件属性，如`onBlur`等

#### union.callback

事件响应方法，当对齐目标表单状态发生改变时，触发该方法

#### 示例 code

```javascript
[
  {
    label: '我是目标表单',
    name: 'name-target',
    $input: {type: 'select', ...}
  },
  {
    label: '我是响应表单',
    name: 'name-response',
    union: {
      target: 'name-target',
      event: 'onChange',
      callback(value, option){
        /** do something */
      }
    }
  }
]
```

## 联动方法

引入`union`联动方法，可以灵活设置回调方法去响应目标表单状态改变, `union`方法有两个参数

```javascript
union('target-name', callback);
```

**示例 code**

```javascript
import ErgateForm {union} from '@aotoo/ergateform'
import {Form} from 'antd'

function App(){
  const form = Form.useForm()
  const formConfig = {
    labelCol:{ span: 8 }
    wrapperCol: { span: 16 }
    layout: "horizontal"
    initialValues: {textbox: 'hello world'}
    form: form  // antd的form实例
    data: [
      {
        label: '文本框',
        name: 'target-input',
        $input: {
          type: 'text',
        },
      },
      union('target-input', function(value){
        if (value === '1') {
          return <div>response value 1</div>
        }
        if (value === '2') {
          return <div>response value 2</div>
        }
      })
    ]
  }

  return <ErgateForm {...formConfig}/>
}

return <App />

```

> > 注：union 方法不需要设置 event 参数，内部使用了 antd 的 Form.watch 实现值变更的跟踪
>
> > 暂时不支持 async await promise 的使用

## 复杂使用

### 如何设置横向的表单

$input属性支持 `object|array` 两种模式，当$input 为数组时，多个表单 Form.Item 会被 `Space` 组件包裹

```javascript
{
  data: [
    {
      ...  // 此时，这里配置的是 Space 组件的属性，具体参考官方

      $input: [
        {
          label: 'first name',  // Form.Item的属性
          name: 'first-name',
          $input: {
            type: 'text',
          },
        },
        {
          label: 'last name',
          name: 'last-name',
          $input: {
            type: 'text',
          },
        },
      ],
    },
  ];
}
```

**生成结构**

```html
<Space {...}>
  <Form.Item {...$input} />
  <Form.Item {...$input} />
</Space>
<Form.Item {...$input} />
...
```

> 注：$input 的数组项将用来配置 Form.Item

### 使用 JSX 灵活设置表单结构

```javascript
{
  data: [
    {
      ...  // 此时，这里配置的是 Space 组件的属性，具体参考官方

      $input: [
        {
          label: 'first name',  // Form.Item的属性
          name: 'first-name',
          $input: {
            type: 'text',
          },
        },

        <div>任意JSX</div>

      ],
    },
  ];
}
```

### union 方法的灵活使用

union 方法可以作为数据项插入到配置结构中

```javascript
{
  data: [
    {
      $input: [
        {
          label: 'first name',  // Form.Item的属性
          name: 'first-name',
          $input: {
            type: 'text',
          },
        },

        <div>可以设置任意JSX结构</div>,

        union('select-box', function(value){
          // 响应 select-box 表单值的变化
          return JSX
        })

      ],
    },

    {
      label: '选择框',
      name: 'select-box',
      $input: {
        type: 'select',
        options: [...]
      }
    },

    union('select-box', function(value){
      // 响应 select-box 表单值的变化
      return JSX
    })
  ];
}
```

### union 方法中设置其他表单属性

不建议在 `union` 的回调方法中设置其他表单的属性，如果非要设置请加上延迟方法，否则会造成渲染冲突  
**示例 code**

```javascript
{
  data: [
    ...,

    {
      label: '选择框',
      name: 'select-box',
      $input: {
        options: [
          {lable: 'a', value: 'a'},
          {lable: 'b', value: 'b'},
        ]
      }
    },

    union('select-box', function(value){
      if (value === 'b') {
        setTimeout(()=>{
          form.setFieldValue('response-input', value)
        }, 100)
      }
      return JSX || null
    })
  ]
}
```

### 静态使用 union 方法

可以将`union`方法的第一个参数设置为一段描述，它只会执行一次，且不响应任何组件状态变更

**示例 code**

```javascript
{
  data: [
    ...,
    union('可以设置为一段描述', function(){
      return JSX
    })
  ]
}
```
