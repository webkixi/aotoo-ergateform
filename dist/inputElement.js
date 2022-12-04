var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from 'react';
import { Button, Form, Input, Cascader, Select, AutoComplete, InputNumber, Radio, Checkbox, Rate, Slider, Switch, TimePicker, TreeSelect, DatePicker, Transfer, Upload, Space, } from 'antd';
var TextArea = Input.TextArea;
var Search = Input.Search;
var Group = Input.Group;
var Password = Input.Password;
var TimeRangePicker = TimePicker.RangePicker;
var DateRangePicker = DatePicker.RangePicker;
var compoents = {
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
function inputComponent(Component, type, params) {
    if (type === 'button') {
        var buttonType = params.buttonType, restField = __rest(params, ["buttonType"]);
        return React.createElement(Button, __assign({}, restField, { type: buttonType }));
    }
    if (type === 'upload') {
        var fieldName = params.fieldName, restField = __rest(params, ["fieldName"]);
        return React.createElement(Upload, __assign({}, restField, { name: fieldName }));
    }
    if (type === 'checkboxgroup' || type === 'radiogroup') {
        var direction = params.direction, options = params.options, restField = __rest(params, ["direction", "options"]);
        if (direction) {
            var ChildComponent_1 = type === 'checkboxgroup' ? Checkbox : Radio;
            var opts = options.map(function (item, ii) {
                return (React.createElement(ChildComponent_1, { key: "".concat(type, "-").concat(item.value, "-").concat(ii), value: item.value },
                    item.label,
                    item.children));
            });
            return (React.createElement(Component, __assign({}, restField),
                React.createElement(Space, { direction: direction }, opts)));
        }
        return React.createElement(Component, __assign({}, restField, { options: options }));
    }
    return React.createElement(Component, __assign({}, params));
}
function generateInput(inputConfig) {
    if (React.isValidElement(inputConfig)) {
        return inputConfig;
    }
    var type = inputConfig.type, restField = __rest(inputConfig, ["type"]);
    if (type) {
        return inputComponent(compoents[type], type, restField);
    }
    else {
        console.warn('需要指定组件type');
        return null;
    }
}
var eventsString = ['blur', 'focus'];
function isEventProperty(attribut) {
    var res = attribut.indexOf('on') === 0 ? true : false;
    return res ? res : eventsString.includes(attribut);
}
var InputUnitElement = function (props) {
    var form = Form.useFormInstance();
    var eventAttributs = [];
    var unionEvnets = props.unionEvnets, selfUnion = props.selfUnion, operate = props.operate, restField = __rest(props, ["unionEvnets", "selfUnion", "operate"]);
    var _a = React.useState(restField.options || []), opts = _a[0], setOpts = _a[1];
    Object.keys(restField).forEach(function (ky) {
        if (isEventProperty(ky)) {
            eventAttributs.push(ky);
        }
    });
    var util = {
        getForm: function () {
            return __assign(__assign({}, form), { setOptions: function (id, options) {
                    operate.selectOp.setOptions(id, options);
                } });
        },
    };
    if (restField.type === 'select' || restField.type === 'cascader') {
        operate.selectOp.setAction(restField.id, setOpts);
        restField.options = opts;
    }
    var eventHandle = function (callback) {
        return function () {
            var args = arguments;
            callback.apply(this, __spreadArray(__spreadArray([], args, true), [util], false));
        };
    };
    eventAttributs.forEach(function (evt) {
        restField[evt] = eventHandle(restField[evt]);
    });
    return generateInput(restField);
};
export default InputUnitElement;
//# sourceMappingURL=inputElement.js.map