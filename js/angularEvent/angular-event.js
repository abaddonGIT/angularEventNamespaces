/**
 * Created by abaddon on 24.09.2014.
 */
/*global window, angular, console, document*/
(function (w, an, d) {
    "use strict";
    an.module("angularEvent", []).
        factory("$anEvent", [function () {
            console.log(w.event);
            var Event = function () {
                var params = {
                    cache: {},
                    counter: 1,
                    nextFnId: 1
                };
                an.extend(this, params);
                this.unicid = this.counter;
                /*Регистрирует событие на элементе*/
                this.on = function (elem, type, fn) {
                    if (!fn || !type || (typeof elem !== "object")) {
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
                    if (!type || (typeof elem !== "object")) {
                        return false;
                    }
                    var typeObj = type.split(':'), namespace, data, handlers;
                    namespace = typeObj[1] || 'global';
                    type = typeObj[0];
                    //получаем данные по элементу из кэша
                    data = this._getMark(elem);
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
                this.trigger = function (elem, event) {
                    //инициализация события
                    //to be continued...
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
                }
            };

            return new Event();
        }
        ]);
}(window, angular, document));