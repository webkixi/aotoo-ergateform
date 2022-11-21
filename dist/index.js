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
import * as React from 'react';
import { Form, Space } from 'antd';
import { adapterItemConfig, adapterConfig } from './parse';
/**
 * union: {
 *   target: '',
 *   event: '',
 *   callback(targetValue, form){
 *
 *   }
 * }
 */
function ErgateForm(formConfig) {
    var _form = Form.useForm()[0];
    var data = formConfig.data, restField = __rest(formConfig, ["data"]);
    var formProperty = restField;
    var form = _form;
    if (!formProperty.form) {
        formProperty.form = form;
    }
    else {
        form = formProperty.form;
    }
    var __id__ = React.useState('bind custom callback')[0];
    var formContext = {
        getForm: function () {
            return form;
        },
    };
    var _a = adapterConfig(data), fields = _a.fields, directUnions = _a.directUnions, flatFormNames = _a.flatFormNames, flatChilds = _a.flatChilds;
    var formWatcher = {};
    for (var ii = 0; ii < directUnions.length; ii++) {
        var _b = directUnions[ii], eventName = _b[0], name_1 = _b[1];
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
        if (field.type === 'direct-union-callback') {
            return field.memo;
        }
        else if (React.isValidElement(field)) {
            return field;
        }
        else {
            var key = field.key, inputElement = field.inputElement, restField_1 = __rest(field, ["key", "inputElement"]);
            if (Array.isArray(inputElement)) {
                return (React.createElement(Space, __assign({ key: key }, restField_1), inputElement.map(function (sub) {
                    if (sub.type === 'direct-union-callback') {
                        return sub.memo;
                    }
                    else if (React.isValidElement(sub)) {
                        return sub;
                    }
                    else {
                        var key_1 = sub.key, inputElement_1 = sub.inputElement, restField_2 = __rest(sub, ["key", "inputElement"]);
                        return (React.createElement(Form.Item, __assign({}, restField_2, { key: key_1 }), inputElement_1));
                    }
                })));
            }
            else {
                return (React.createElement(Form.Item, __assign({}, restField_1, { key: key }), inputElement));
            }
        }
    })));
}
// 为了方便
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
export function formItem(itemConfig) {
    var res = adapterItemConfig(itemConfig, [itemConfig]);
    var _a = res.current, key = _a.key, inputElement = _a.inputElement, restField = __rest(_a, ["key", "inputElement"]);
    if (Array.isArray(inputElement)) {
        return (React.createElement(Space, __assign({ key: key }, restField), inputElement.map(function (sub) {
            if (sub.type === 'direct-union-callback') {
                return sub.memo;
            }
            else if (React.isValidElement(sub)) {
                return sub;
            }
            else {
                var key_2 = sub.key, inputElement_2 = sub.inputElement, restField_3 = __rest(sub, ["key", "inputElement"]);
                return (React.createElement(Form.Item, __assign({}, restField_3, { key: key_2 }), inputElement_2));
            }
        })));
    }
    return (React.createElement(Form.Item, __assign({}, restField, { key: key }), inputElement));
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