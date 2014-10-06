/**
 * Created by abaddon on 24.09.2014.
 */
/*global window, angular, console, document*/
(function (w, an, d) {
    "use strict";
    an.module("angularEvent", []).
        factory("$anEvent", [function () {
            var Event = function () {
                var params = {
                    cache: {},
                    counter: 1,
                    nextFnId: 1
                }, that = this;
                an.extend(this, params);
                this.unicid = this.counter;
                /*Регистрирует событие на элементе*/
                this.on = function (elem, type, fn) {
                    if (!fn || !type || !elem || (typeof elem !== "object")) {
                        return false;
                    }
                    var data = this._getMark(elem), typeObj = type.split(':'), namespace;
                    type = typeObj[0];//Тип события
                    namespace = typeObj[1] || 'global';//Пространство имен
                    this._namespaces('handlers.' + type + '.' + namespace, data);
                    fn.guid = fn.guid || this.nextFnId++;//Маркируем оригинальную ф-ю
                    data.handlers[type][namespace].push(fn);

                    if (!data.dispatcher) {
                        data.disabled = false;
                        data.dispatcher = function (event) {
                            if (data.disabled) {
                                return;
                            }
                            event = that._fixEvent(event);
                            //Вызов всех обработчиков
                            var spaces = data.handlers[event.type];
                            an.forEach(spaces, function (handlers) {
                                var ln = handlers.length, i = 0;
                                while (i < ln) {
                                    handlers[i].call(elem, event);
                                    i++;
                                }
                            });
                        };
                    }
                    if (data.handlers[type][namespace].length === 1) {//Если есть хоть одно такое событие, то регистрируем наш обработчик
                        if (elem.addEventListener) {
                            elem.addEventListener(type, data.dispatcher, false);
                        } else {
                            return false;
                        }
                    }
                };
                /*Удаляет обработчик с элемента*/
                this.off = function (elem, type, fn) {
                    if (!type || !elem || (typeof elem !== "object")) {
                        return false;
                    }
                    var typeObj = type.split(':'), namespace, data, handlers;
                    namespace = typeObj[1] || 'global';
                    type = typeObj[0];
                    //получаем данные по элементу из кэша
                    data = this._getMark(elem);

                    if (!data.handlers) {
                        return;
                    }
                    if (!data.handlers[type]) {
                        return;
                    }
                    handlers = data.handlers[type][namespace];
                    if (handlers) {
                        //Если передан конкретный обработчик, то удаляется именно он
                        if (fn) {
                            if (fn.guid) {//если его нет, то нет смысла гонять массив с обработчиками
                                an.forEach(handlers, function (v, k) {
                                    if (v.guid === fn.guid) {
                                        handlers.splice(k--, 1);
                                    }
                                });
                            }
                            if (this._isEmpty(handlers)) {
                                delete data.handlers[type][namespace];
                            }
                        } else {
                            if (namespace === 'global') {
                                delete data.handlers[type];
                            } else {
                                delete data.handlers[type][namespace];
                            }
                        }
                        if (this._isEmpty(data.handlers[type])) {//Если нет глобальных событий стем же типом, то удаляем обработчик
                            if (elem.removeEventListener) {
                                elem.removeEventListener(type, data.dispatcher, false);
                            }
                        }
                    }
                    //Проверка есть ли хоть один обработчик для данного типа события
                    if (this._isEmpty(data.handlers[type])) {
                        delete data.handlers[type];
                    }
                    //Если нет не одного обработчика
                    if (this._isEmpty(data.handlers)) {
                        delete data.handlers;
                        delete data.dispatcher;
                        delete data.disabled;
                    }
                    if (this._isEmpty(data)) {
                        this._removeMark(elem);
                    }
                };
                this.trigger = function (elem, type) {
                    var data = this._getMark(elem), typeObj = [], namespace, event, handlers, ln, i = 0, parent = elem.parentNode || elem.ownerDocument;
                    if (typeof type === "string") {
                        typeObj = type.split(':');
                        event = {
                            type: typeObj[0],
                            target: elem
                        };
                    } else {
                        event = type;
                    }
                    event = this._fixEvent(event);
                    namespace = typeObj[1] || 'global';
                    if (data.handlers) {
                        handlers = data.handlers[event.type] ? data.handlers[event.type][namespace] : [];
                        ln = handlers.length;
                        //Вызываем обработчики
                        for (i; i < ln; i++) {
                            handlers[i].call(elem, event);
                        }
                    }
                    //иммитация всплытия события
                    if (parent && !event.isPropagationStopped()) {
                        this.trigger(parent, event);
                    } else if (!parent && !event.isDefaultPrevented()) {//Действие по умолчанию
                        var targetData = this._getMark(event.target);
                        if (event.target[event.type]) {
                            targetData.disabled = true;
                            event.target[event.type]();
                            targetData.disabled = false;
                        }
                    }
                };
            };
            Event.prototype = {
                get unicid() {
                    return this._unic;
                },
                set unicid(value) {
                    this._unic = value + (new Date()).getTime();
                },
                _isEmpty: function (obj) {
                    for (var prop in obj) {
                        return false;
                    }
                    return true;
                },
                _getMark: function (elem) {//Маркирует элемент уникальным идентификатором
                    var guid = elem[this.unicid];
                    if (!guid) {
                        guid = elem[this.unicid] = this.counter++;
                        this.cache[guid] = {};
                    }
                    return this.cache[guid];
                },
                _removeMark: function (elem) {//Удаляет елемент из набора и кэша
                    var guid = elem[this.unicid];
                    if (!guid) {
                        return false;
                    }
                    delete this.cache[guid];
                    try {
                        delete elem[this.unicid];
                    } catch (e) {
                        elem.removeAttribute(this.unicid);
                    }
                },
                _namespaces: function (namespaceString, parent) {
                    var parts = namespaceString.split('.'), ln = parts.length, i,
                        currentPart = '';
                    for (i = 0; i < ln; i++) {
                        currentPart = parts[i];
                        if (i === ln - 1) {
                            parent[currentPart] = parent[currentPart] || [];
                        } else {
                            parent[currentPart] = parent[currentPart] || {};
                        }
                        parent = parent[currentPart];
                    }
                    return parent;
                },
                //Для создания кастомных событий
                _fixEvent: function (event) {
                    if (!event || !event.stopPropagation) {
                        var old = event || w.event, event = {}, prop,
                            returnFalse = function () {
                                return false;
                            },
                            returnTrue = function () {
                                return true;
                            };
                        //клонируем свойства
                        for (prop in old) {
                            event[prop] = old[prop];
                        }
                        //место инициализации события
                        if (!event.target) {
                            event.target = d;
                        }
                        event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
                        //Действие по умолчанию
                        event.preventDefault = function () {
                            event.returnValue = false;
                            event.isDefaultPrevented = returnTrue;
                        };
                        event.isDefaultPrevented = returnFalse;
                        //Всплытие события
                        event.stopPropagation = function () {
                            event.cancelBubble = true;
                            event.isPropagationStopped = returnTrue;
                        };
                        event.isPropagationStopped = returnFalse;
                        //Остановка всплятия события
                        event.stoplmmediatePropagation = function () {
                            event.islmmediatePropagationStopped = returnTrue;
                            event.stopPropagation();
                        };
                        event.islmmediatePropagationStopped = returnFalse;
                        event = this._mouseHook(event);
                    }
                    return event;
                },
                _mouseHook: function (event) {
                    if (event.clientX != null) {
                        var doc = d.documentElement, body = d.body, button = event.button;

                        event.pageX = original.clientX +
                            ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                            ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                        event.pageY = original.clientY +
                            ( doc && doc.scrollTop || body && body.scrollTop || 0 ) -
                            ( doc && doc.clientTop || body && body.clientTop || 0 );
                    }
                    if (!event.which && button != null) {
                        event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
                    }
                    return event;
                }
            }
            return new Event();
        }
        ]);
}(window, angular, document));