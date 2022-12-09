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
import { Form, Space, Row } from 'antd';
var WrapFormItem = function (props) {
    var align = props.align, direction = props.direction, size = props.size, split = props.split, wrap = props.wrap, block = props.block, compact = props.compact, children = props.children, restField = __rest(props, ["align", "direction", "size", "split", "wrap", "block", "compact", "children"]);
    var isSpace = align || direction || size || split || wrap || block || compact;
    var spaceProps = {
        align: align,
        direction: direction,
        size: size,
        split: split,
        wrap: wrap,
        block: block,
    };
    if (isSpace) {
        if (compact) {
            return (React.createElement(Form.Item, __assign({}, restField),
                React.createElement(Space.Compact, __assign({}, spaceProps), children)));
        }
        else {
            return (React.createElement(Form.Item, __assign({}, restField),
                React.createElement(Space, __assign({}, spaceProps), children)));
        }
    }
    return React.createElement(Form.Item, __assign({}, restField), props.children);
};
var WrapMultipleItem = function (props) {
    var type = props.type, inputElement = props.inputElement, restField = __rest(props, ["type", "inputElement"]);
    var containerType = type === 'formItem' || type === 'item' ? 'item' : type || 'space'; // ??? list
    var theChildren = inputElement.map(function (sub) {
        if (sub.type === 'direct-union-callback') {
            return sub.memo;
        }
        else if (React.isValidElement(sub)) {
            return sub;
        }
        else {
            var key = sub.key, inputElement_1 = sub.inputElement, restField_1 = __rest(sub, ["key", "inputElement"]);
            return (React.createElement(Form.Item, __assign({}, restField_1, { key: key }), inputElement_1));
        }
    });
    if (containerType === 'grid') {
        return React.createElement(Row, null, theChildren);
    }
    if (containerType === 'item') {
        return React.createElement(WrapFormItem, __assign({}, restField), theChildren);
    }
    else {
        if (restField.compact) {
            return React.createElement(Space.Compact, __assign({}, restField), theChildren);
        }
        return React.createElement(Space, __assign({}, restField), theChildren);
    }
};
export var WrapInputElement = function (props) {
    var inputElement = props.inputElement, restField = __rest(props, ["inputElement"]);
    if (Array.isArray(inputElement)) {
        return React.createElement(WrapMultipleItem, __assign({}, restField, { inputElement: inputElement }));
    }
    else {
        return React.createElement(Form.Item, __assign({}, restField), inputElement);
    }
};
//# sourceMappingURL=wrapElement.js.map