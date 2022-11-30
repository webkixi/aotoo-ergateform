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
export default function useSelectOprate() {
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
//# sourceMappingURL=useSelectOprate.js.map