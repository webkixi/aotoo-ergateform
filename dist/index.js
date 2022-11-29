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
import { Form } from 'antd';
import { adapterItemConfig, adapterConfig } from './parse';
import { WrapInputElement } from './wrapElement';
import 'antd/dist/reset.css';
function useSelectOprate() {
    var data = React.useRef([]);
    function setAction(id, func) {
        var target = data.current.filter(function (item) { return item.id === id; });
        if (!target.length) {
            data.current = __spreadArray(__spreadArray([], data.current, true), [{ id: id, action: func }], false);
        }
    }
    function setOptions(id, option) {
        var target = data.current.filter(function (item) { return item.id === id; });
        if (target.length) {
            var action = target[0].action;
            action(option);
        }
    }
    return [
        {
            setAction: setAction,
            setOptions: setOptions,
        },
    ];
}
/**
 * ErgateForm
 * antd 表单配置化，模块化的封装
 * https://www.github.com/webkixi/aotoo-ergateform
 */
function ErgateForm(formConfig) {
    var _form = Form.useForm()[0];
    var selectOp = useSelectOprate()[0];
    var data = formConfig.data, state = formConfig.state, restField = __rest(formConfig, ["data", "state"]);
    var formProperty = restField;
    var form = formProperty.form || _form;
    var __id__ = React.useState('bind custom callback')[0];
    var _a = React.useState(state || {}), status = _a[0], setStatus = _a[1];
    var setMystate = function (params) {
        var newState = __assign(__assign({}, status), params);
        setStatus(newState);
    };
    form.operate = { selectOp: selectOp };
    if (!formProperty.form) {
        formProperty.form = form;
    }
    var formContext = {
        getForm: function () {
            return __assign(__assign({}, form), { setOptions: function (id, options) {
                    selectOp.setOptions(id, options);
                } });
        },
    };
    var realyData = typeof data === 'function' ? data(status, setMystate) : data;
    var _b = adapterConfig(realyData, form.operate), fields = _b.fields, directUnions = _b.directUnions, flatFormNames = _b.flatFormNames;
    var formWatcher = {};
    for (var ii = 0; ii < directUnions.length; ii++) {
        var _c = directUnions[ii], eventName = _c[0], name_1 = _c[1];
        if (flatFormNames.indexOf(name_1) > -1) {
            formWatcher[name_1] = Form.useWatch(name_1, form);
        }
    }
    function renderMemos(allfields) {
        return allfields.map(function (field, ii) {
            if (field.type === 'direct-union-callback') {
                var name_2 = field.name, directUnionCallback_1 = field.directUnionCallback;
                if (flatFormNames.indexOf(field.name) > -1) {
                    var theMemo = React.useMemo(function () {
                        var jsx = directUnionCallback_1.call(formContext, formWatcher[name_2]) || null;
                        if (jsx && !jsx.key) {
                            jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
                        }
                        return jsx;
                    }, [formWatcher[field.name]]);
                    return {
                        type: 'direct-union-callback',
                        memo: theMemo,
                    };
                }
                else {
                    var stockMemo = React.useMemo(function () {
                        var jsx = directUnionCallback_1.call(formContext, formWatcher[name_2]) || null;
                        if (jsx && !jsx.key) {
                            jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
                        }
                        return jsx;
                    }, [__id__]);
                    return {
                        type: 'direct-union-callback',
                        memo: stockMemo,
                    };
                }
            }
            else {
                if (Array.isArray(field.inputElement)) {
                    field.inputElement = renderMemos(field.inputElement);
                }
            }
            return field;
        });
    }
    fields = renderMemos(fields);
    return (React.createElement(Form, __assign({}, formProperty), fields.map(function (field) {
        return field.type == 'direct-union-callback' ? (field.memo) : React.isValidElement(field) ? (field) : (React.createElement(WrapInputElement, __assign({}, field)));
    })));
}
// 为了方便，不用单独引用antd
export { Form } from 'antd';
export function union(name, callback) {
    var evt = '';
    return {
        type: 'direct-union-callback',
        name: name,
        event: evt,
        directUnionCallback: callback,
    };
}
var FormItem = function (props) {
    var form = Form.useFormInstance();
    var res = adapterItemConfig(__assign({}, props), [__assign({}, props)], form.operate);
    return React.createElement(WrapInputElement, __assign({}, res.current));
};
export function formItem(itemConfig) {
    return React.createElement(FormItem, __assign({}, itemConfig));
}
export function formList(listConfig) {
    var formListConfig = __assign({}, listConfig);
    return {
        render: function (callback) {
            var _this = this;
            return (React.createElement(Form.List, __assign({}, formListConfig), function (fields, _a, _b) {
                var add = _a.add, remove = _a.remove, move = _a.move;
                var errors = _b.errors;
                return callback.apply(_this, [
                    fields,
                    { add: add, remove: remove, move: move },
                    { errors: errors },
                ]);
            }));
        },
    };
}
export default ErgateForm;
//# sourceMappingURL=index.js.map