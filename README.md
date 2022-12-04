## 前言

`ErgateForm` 是配置化的 `antd form(react)` 组件。通过配置化生成表单。实现了表单联动、动态表等单功能，表单属性仍沿用 antd form 各个组件的属性。

我自己在做 ToB 类项目时，比较头疼大量的表单业务。会将表单等组件重新封装一下，使用 JSON 来配置化自动生成表单。即方便 CV，也方便各种抽离，对于模块化也比较友好，下图是我做的 DEMO，可以很方便的组合成各种表单

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/774e0e9bffe74efb8799f5221c539058~tplv-k3u1fbpfcp-watermark.image?)

## 基础使用

### 安装

```bash
npm install @aotoo/ergateform

# or

yarn add @aotoo/ergateform
```

### 基础表单

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

### 联动表单

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
        $input: { type: 'text'},
      },
      {
        label: '响应文本框',
        name: 'response-input',
        $input: { type: 'text' },
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

### 支持的表单类型

```javascript
{
  $input: { type: '???', }  // type 用来设置表单类型
}
```

- button => Button
- text => Input 表单的别名
- textarea => Input.TextArea 别名
- search => Input.Search
- password => Input.Password
- cascader => Cascader
- select => Select
- autocomplete => AutoComplete
- inputnumber => InputNumber
- rate => Rate
- slider => Slider
- switch => Switch
- timepicker => TimePicker
- timerange => TimePicker.RangePicker 别名
- treeselect => TreeSelect
- datepicker => DatePicker
- daterange => DatePicker.RangePicker 别名
- checkbox => Checkbox
- checkboxGroup => Checkbox.Group
- radio => Radio
- radioGroup => Radio.Group
- transfer => Transfer
- upload => Upload

## 配置

### Form 配置

在`ErgateForm`中使用最外层的非`data`属性来配置 Form 属性

**Form.state**  
这是 ErgateForm 的属性，原生 antd Form 表单无此属性，该属性作用是用来方便模块化时能够方便设置状态值得变更，使用 React 的 useState 实现

**ergateform 的写法**

```javascript
const formConfig = {
  labelCol:{ span: 8 }
  wrapperCol: { span: 16 }
  layout: "horizontal"
  ...
  data: [...]  // data用来配置 Form.Item 集合
}

return <ErgateForm {...formConfig}/>

// 或者

return <ErgateForm
  labelCol= {{span: 8}}
  wrapperCol={{span: 16}}
  layout={'horizontal'}
  ...
  data: [...]
/>
```

**antd form 原生写法**

```html
<Form labelCol={{ span: 8 }} wraperCol={{ span: 16 }} layout="horizontal">
  ...
</Form>
```

### FormItem 配置

Form.Item 是 antd 表单的基础结构。ErgateForm 使用`data`的数据项来配置`Form.Item`属性及表单属性

**ergateform 的写法**

1. data 为数组

```javascript
// 配置
{
  data: [
    {
      label: '标题名',  // 对应 Form.Item 的label属性
      name: 'uniq-name' // 对应 Form.Item 的name属性
      $input: { ... } // 配置表单属性
    },
    JSX,
    union(...)
  ]
}
```

2. data 配置为方法  
   可以将 data 设置为方法，只要数组项数组即可。该方法接收`state, setState`两个参数，这样我们可以在配置中灵活设置一些状态

```javascript
data: function(state, setState){
  return [
    ...
  ]
}
```

> 数据项可以是 JSX，或者`union`方法返回的结构，union 方法后面会讲到

**antd form 原生写法**

```html
<Form.Input label="标题名" name="uniq-name">
  <input {...$input} />
</Form.Input>
```

#### 横向排列

ErgateForm 默认使用`Space`组件来横向排列表单，只需要将`$input`配置成数组即可，来看配置

```javascript
{
  data: [
    {
      ...,  // 此时这里的属性会自动添加到Space组件中
      $input: [
        {
          label: 'UserName',
          name: 'username',
          $input: {  // 嵌套表单仍然使用`$input`属性
            type: 'text',
          }
        },
        {
          label: 'Password',
          name: 'password',
          $input: {
            type: 'password'
          }
        }
      ]
    }
  ]
}
```

> radio / checkbox 的竖向排列，官网是使用 Space 组件包裹，这里直接添加`$input.direction`

### 特殊属性

`ErgateFome`加入的属性，用来控制配置结构和联动

1. $input
2. union

#### $input

`$input`用来配置具体的表单/表单组，如 `Input, Select`等支持的表单元件，api 属性与官网一致

#### $input.type

该属性用来标识使用那个表单组件，

> antd 的 Button 组件包含 type 属性，请使用 `buttonType` 替换

#### union

用来设置表单联动，union 的实现思路有点类似于监视者的角色，当目标值变更时及时做出响应。union 属性包含三个必须设置的参数 `target、event、callback`

#### union.target

描述对齐的目标 name

#### union.event

表单组件一般都有几个事件方法，例如 Search 表单组件有 onSearch 和 onChange 等事件，我们只想关注 onChange 事件时将 union.event 设置为 onChange 即可

#### union.callback

事件响应方法，当对齐目标表单状态发生改变时，触发该方法

#### 多联动

一个表单需要关注多个表单时设置，将 union 设置为数组即可实现多联动

#### 示例 code

```javascript
[
  {
    label: '我是目标表单',
    name: 'name-target',
    $input: {type: 'select', ...}
  },

  // 单联动
  {
    label: '单联动响应表单',
    name: 'name-response',
    union: {
      target: 'name-target',
      event: 'onChange',
      callback(value, option){
        /** do something */
      }
    }
  },

  // 多联动
  {
    label: '多联动响应表单',
    name: 'mul-response',
    union: [
      {target: 'name-target', event: 'onChange', callback: ...},
      {target: 'name-target', event: 'onSearch', callback: ...},
    ]
  }
]
```

## union 方法

在设计表单时，有些结构需要根据状态来显示，此时可以引入 union 方法来实现这种类型的需求。

union 方法实现的原理是通过 antd 的`form.useWatch`对观测表单的状态改变做出响应。需要注意，如果表单组件不包含`value`属性，会提示报错。例如 Checkbox 组件就不包含 value 属性，需要通过 state 来控制 Checkbox 的状态。幸运的是其他所有表单都有 value 属性

### union 方法的用法

union 有三种设置方法

1. 对表单响应
2. 对 state 属性响应
3. 无响应，但会在表单完成时反馈出结构(useEffect 实现)

```javascript
// 联动组件
union('target-name', function (value) {
  return JSX;
});
```

```javascript
// 联动state
union('state.xxx', function (value) {
  return JSX;
});
```

```javascript
// 无响应
union('任意字串描述，不可以和组件name/state[name]重名即可', function (value) {
  return JSX;
});
```

> union 方法中也可以设置其他表单组件的属性，但一定要加上延迟，否则会造成渲染冲突，这一点后面会讲到

### 示例 CODE

注意下面的 union 方法的使用的位置

```javascript
import ErgateForm {union} from '@aotoo/ergateform'
import {Form} from 'antd'

function App(){
  const form = Form.useForm()
  const formConfig = {
    ... // Form配置项
    data: function(state, setState){
      return [
        {
          $input: [ // 表单组
            {
              label: '文本框',
              name: 'target-select',
              $input: {
                type: 'select',
                options: [
                  {label: '选项一', value: '1'},
                  ...
                ]
              }
            },
            // 组内union
            union('target-select', function(value){
              if (value === '3'){
                return <div>response vlaue 3</div>
              }
            })
          ],
        },

        <button>按钮</button>,  // 支持直接插入JSX

        // 组外union
        union('target-input', function(value){
          if (value === '1') {
            return <div>response value 1</div>
          }
          if (value === '2') {
            return <div>response value 2</div>
          }
        }),

        // state联动
        union('state.xxx', function(value){
          return JSX
        })
      ]
    }
  }

  return <ErgateForm {...formConfig}/>
}

return <App />

```

> > union 方法不需要设置 event 参数，内部使用了 antd 的 Form.useWatch 实现值变更追踪
>
> > 暂时不支持 async await promise 的使用

## 复杂使用

### getForm 方法

Ergate 使用的是 antd 的最新版本(5.0.3)，antd Form 可以使用 form 的实例来做很多事情，具体使用方法可以参考官方文档

getForm 方法是为了模块化时能方便取到 form 实例，ErgateForm 会拦截每个表单事件的回调方法，重构后并还原成原来的使用方式

```javascript
data = [
  {
    label: 'title',
    name: 'name',
    $input: {
      type: 'button',
      buttonType: '...', // 注意button组件是没有value的，不能够使用union来追踪
      onClick() {
        const form = this.getForm(); // 获取form的实例
        form.setFieldValue('xxx-name', value);
      },
    },
  },
];
```

### setOptions 方法

`setOptions`可以很方便的设置表单内的各个 Select 组件的下拉列表

```javascript
data = [
   {
     label: 'title',
     name: 'select-name',
     $input: {
       type: 'select',
       options: []
     }
   },

   {
     $input: {
       type: 'button',
       onClick(){
         const form = this.getForm()
         form.setOptions('select-name', [
           {label: '选项一', value: '1'},
           {label: '选项二', value: '2'},
           ...
         ])
       }
     }
   }
 ]
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
      const form = this.getForm()
      if (value === 'b') {
        setTimeout(()=>{
          form.setOptions('select-box', [...])
        }, 100)
      }
      return JSX || null
    })
  ]
}
```

### 使用 state

```javascript

const stateData = {
  checked: false
}

{
  layout="horizontal"
  onFinish={onFinish}
  ...
  state={stateData}
  data: function(state, setState){
    return [
      {
        name: 'check-box',
        $input: {
          type: 'checkbox',
          checked: state.checked,
          onChange(){
            setState({
              checked: !state.checked
            })
          }
        }
      },

      union('state.checked', function(value){
        console.log(value)
      })
    ]
  }
}
```
