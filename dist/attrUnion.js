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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export default function (current, union) {
    function inputUnion(unionItem) {
        var event = unionItem.event, callback = unionItem.callback;
        var currentInput = current['$input'];
        var oldEvent = currentInput[event];
        currentInput[event] = function () {
            var args = arguments;
            var util = args[args.length - 1];
            var context = __assign(__assign({}, this), { getForm: util.getForm });
            if (typeof oldEvent === 'function') {
                oldEvent.apply(context, __spreadArray([], args, true));
            }
            if (typeof callback === 'function') {
                callback.apply(context, __spreadArray([], args, true));
            }
        };
        var tempAry = currentInput['unionEvnets'] || [];
        if (!tempAry.includes(event)) {
            tempAry.push(event);
        }
        currentInput['unionEvnets'] = tempAry;
        current['$input'] = currentInput;
    }
    if (union) {
        if (Array.isArray(union)) {
            union.forEach(function (unionItem) { return inputUnion(unionItem); });
        }
        else {
            inputUnion(union);
        }
    }
    return current;
}
//# sourceMappingURL=attrUnion.js.map