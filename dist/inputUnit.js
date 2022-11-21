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
import { Button, Form, Input, Cascader, Select, AutoComplete, InputNumber, Radio, Checkbox, Rate, Slider, Switch, TimePicker, TreeSelect, DatePicker, } from 'antd';
import 'antd/dist/antd.css';
var TextArea = Input.TextArea;
var Search = Input.Search;
var Group = Input.Group;
var Password = Input.Password;
var TimeRangePicker = TimePicker.RangePicker;
var DateRangePicker = DatePicker.RangePicker;
function generateInput(inputConfig) {
    if (React.isValidElement(inputConfig)) {
        return inputConfig;
    }
    var type = inputConfig.type, restField = __rest(inputConfig, ["type"]);
    type = type && type.toLowerCase();
    switch (type) {
        case 'button':
            return React.createElement(Button, __assign({}, restField));
            break;
        case 'text':
            return React.createElement(Input, __assign({}, restField));
            break;
        case 'textarea':
            return React.createElement(TextArea, __assign({}, restField));
            break;
        case 'search':
            return React.createElement(Search, __assign({}, restField));
            break;
        case 'password':
            return React.createElement(Password, __assign({}, restField));
            break;
        case 'cascader':
            return React.createElement(Cascader, __assign({}, restField));
            break;
        case 'select':
            return React.createElement(Select, __assign({}, restField));
            break;
        case 'autocomplete':
            return React.createElement(AutoComplete, __assign({}, restField));
            break;
        case 'inputnumber':
            return React.createElement(InputNumber, __assign({}, restField));
            break;
        case 'rate':
            return React.createElement(Rate, __assign({}, restField));
            break;
        case 'slider':
            return React.createElement(Slider, __assign({}, restField));
            break;
        case 'switch':
            return React.createElement(Switch, __assign({}, restField));
            break;
        case 'timepicker':
            return React.createElement(TimePicker, __assign({}, restField));
            break;
        case 'timerange':
            return React.createElement(TimeRangePicker, __assign({}, restField));
            break;
        case 'treeselect':
            return React.createElement(TreeSelect, __assign({}, restField));
            break;
        case 'datepicker':
            return React.createElement(DatePicker, __assign({}, restField));
            break;
        case 'daterange':
            return React.createElement(DateRangePicker, __assign({}, restField));
            break;
        // CheckboxGroup
        case 'checkbox':
            return React.createElement(Checkbox, __assign({}, restField));
            break;
        case 'checkboxgroup':
            return React.createElement(Checkbox.Group, __assign({}, restField));
            break;
        case 'radio':
            return React.createElement(Radio, __assign({}, restField));
            break;
        default:
            return null;
    }
}
var InputUnitElement = function (props) {
    var form = Form.useFormInstance();
    var unionEvnets = props.unionEvnets, selfUnion = props.selfUnion, restField = __rest(props, ["unionEvnets", "selfUnion"]);
    var eventHandle = function (callback) {
        return function () {
            var args = arguments;
            callback.apply(this, __spreadArray(__spreadArray([], args, true), [
                {
                    getForm: function () {
                        return form;
                    },
                },
            ], false));
        };
    };
    if (unionEvnets && unionEvnets.length) {
        unionEvnets.forEach(function (evt) {
            restField[evt] = eventHandle(restField[evt]);
        });
    }
    return generateInput(restField);
};
export default InputUnitElement;
//# sourceMappingURL=inputUnit.js.map