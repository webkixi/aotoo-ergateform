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
var eventsString = ['blur', 'focus'];
function isEventProperty(attribut) {
    var res = attribut.indexOf('on') === 0 ? true : false;
    return res ? res : eventsString.includes(attribut);
}
function inputUnion(current, unionItem) {
    var target = unionItem.target, event = unionItem.event, callback = unionItem.callback;
    var currentInput = current['$input'];
    if (target && target === current.name) {
        if (!currentInput[event]) {
            var tempAry = currentInput['unionEvnets'] || [];
            currentInput[event] = function () {
                var args = arguments;
                if (args[0] !== undefined) {
                    callback.apply(this, __spreadArray([], args, true));
                }
            };
            if (tempAry.indexOf(event) === -1) {
                tempAry.push(event);
            }
            currentInput['unionEvnets'] = tempAry;
            current['$input'] = currentInput;
        }
    }
    Object.keys(currentInput).forEach(function (ky) {
        if (isEventProperty(ky)) {
            var oldEvent_1 = currentInput[ky];
            currentInput[ky] = function () {
                var args = arguments;
                var util = args[args.length - 1];
                var context = __assign(__assign({}, this), { getForm: util.getForm });
                if (typeof oldEvent_1 === 'function') {
                    oldEvent_1.apply(context, __spreadArray([], args, true));
                }
            };
        }
    });
    current['$input'] = currentInput;
}
export default function (current, union) {
    if (union === void 0) { union = {}; }
    if (Array.isArray(union)) {
        union.forEach(function (unionItem) { return inputUnion(current, unionItem); });
    }
    else {
        inputUnion(current, union);
    }
    return current;
}
//# sourceMappingURL=unionEvent.js.map