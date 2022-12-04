import * as React from 'react';
export default function renderMemos(allfields, params) {
    var flatFormNames = params.flatFormNames, formWatcher = params.formWatcher, formContext = params.formContext, status = params.status;
    return allfields.map(function (field, ii) {
        if (field.type === 'direct-union-callback') {
            var name_1 = field.name, directUnionCallback_1 = field.directUnionCallback, event_1 = field.event;
            if (flatFormNames.indexOf(field.name) > -1) {
                var theMemo = React.useMemo(function () {
                    if (formWatcher[field.name] !== undefined) {
                        var jsx = directUnionCallback_1.call(formContext, formWatcher[name_1]) || null;
                        if (jsx && !jsx.key) {
                            jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
                        }
                        return jsx;
                    }
                }, [formWatcher[field.name]]);
                return {
                    type: 'direct-union-callback',
                    memo: theMemo,
                };
            }
            else if (name_1.indexOf('state.') === 0 || status.hasOwnProperty(name_1)) {
                var _name_1 = name_1.replace(/state\./gi, '');
                var theMemo = React.useMemo(function () {
                    if (status[_name_1] !== undefined) {
                        var jsx = directUnionCallback_1.call(formContext, status[_name_1]) || null;
                        if (jsx && !jsx.key) {
                            jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
                        }
                        return jsx;
                    }
                }, [status[_name_1]]);
                return {
                    type: 'direct-union-callback',
                    memo: theMemo,
                };
            }
            else {
                var stockMemo = React.useMemo(function () {
                    var jsx = directUnionCallback_1.call(formContext, formWatcher[name_1]) || null;
                    if (jsx && !jsx.key) {
                        jsx = React.cloneElement(jsx, { key: 'callback_' + ii });
                    }
                    return jsx;
                }, []);
                return {
                    type: 'direct-union-callback',
                    memo: stockMemo,
                };
            }
        }
        else {
            if (Array.isArray(field.inputElement)) {
                field.inputElement = renderMemos(field.inputElement, {
                    flatFormNames: flatFormNames,
                    formWatcher: formWatcher,
                    formContext: formContext,
                    status: status,
                });
            }
        }
        return field;
    });
}
//# sourceMappingURL=renderMemos.js.map