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
import attrUnion from './attrUnion';
import InputUnitElement from './inputElement';
export function adapterItemConfig(current, data, operate, index) {
    var directUnions = [];
    var flatFormNames = [];
    var flatChilds = [];
    if (current.name && current.type !== 'direct-union-callback') {
        flatFormNames.push(current.name);
        if (index) {
            flatChilds.push({
                name: current.name,
                path: index,
                type: current.type,
            });
        }
    }
    if (current['$input']) {
        if (Array.isArray(current['$input'])) {
            current['$input'] = current['$input'].map(function (subItem, jj) {
                var _key = subItem.key || (subItem.name || '') + current.key + '_' + jj;
                if (React.isValidElement(subItem)) {
                    return React.cloneElement(subItem, { key: _key });
                }
                else {
                    subItem.key = _key;
                    var res = adapterItemConfig(subItem, data, operate, index ? __spreadArray(__spreadArray([], index, true), [jj], false) : undefined);
                    directUnions = directUnions.concat(res.directUnions);
                    flatFormNames = flatFormNames.concat(res.flatFormNames);
                    flatChilds = flatChilds.concat(res.flatChilds);
                    return res.current;
                }
            });
        }
        else {
            if (current.type === 'direct-union-callback') {
                directUnions.push([
                    current.event,
                    current.name,
                    current.directUnionCallback,
                ]);
            }
            // 处理联动关系
            data.forEach(function (item) {
                var $input = item['$input'];
                var accessUnion = true;
                if (Array.isArray($input)) {
                    $input.forEach(function () {
                        var res = adapterItemConfig(current, $input, operate);
                        return res.current;
                    });
                    accessUnion = false;
                }
                if (accessUnion && item.union && item.union.target === current.name) {
                    current = attrUnion(current, item.union);
                }
            });
        }
        var $input = current.$input, label = current.label, name_1 = current.name, key = current.key, union = current.union, restField = __rest(current, ["$input", "label", "name", "key", "union"]);
        var inputEle = null;
        var _key = key || name_1;
        if (Array.isArray($input)) {
            inputEle = $input;
        }
        else {
            inputEle = (React.createElement(InputUnitElement, __assign({ selfUnion: union }, $input, { operate: operate })));
        }
        return {
            current: __assign({ label: label, name: name_1, inputElement: inputEle, key: _key }, restField),
            directUnions: directUnions,
            flatFormNames: flatFormNames,
            flatChilds: flatChilds,
        };
    }
    if (current.type === 'direct-union-callback') {
        directUnions.push([
            current.evnet,
            current.name,
            current.directUnionCallback,
        ]);
    }
    if (current.name) {
        flatFormNames.push(current.name);
    }
    return { current: current, directUnions: directUnions, flatFormNames: flatFormNames, flatChilds: flatChilds };
}
export function adapterConfig(data, operate) {
    var fields = [];
    var directUnions = [];
    var flatFormNames = []; // 扁平化所有表单的name
    var flatChilds = []; // 扁平化子元素及寻址路径
    data.forEach(function (item, ii) {
        var _key = item.key || (item.name || '') + '_' + ii;
        if (React.isValidElement(item)) {
            var jsx = React.cloneElement(item, { key: _key });
            fields.push(jsx);
        }
        else {
            item.key = _key;
            var result = adapterItemConfig(item, data, operate, [ii]);
            directUnions = __spreadArray(__spreadArray([], directUnions, true), result.directUnions, true);
            flatFormNames = __spreadArray(__spreadArray([], flatFormNames, true), result.flatFormNames, true);
            flatChilds = __spreadArray(__spreadArray([], flatChilds, true), result.flatChilds, true);
            fields.push(result.current);
        }
    });
    return {
        fields: fields,
        directUnions: directUnions,
        flatFormNames: flatFormNames,
        flatChilds: flatChilds,
    };
}
//# sourceMappingURL=parse.js.map