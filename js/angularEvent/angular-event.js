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
                };
                an.extend(this, params);
                this.unicid = this.counter;
                /*Регистрирует событие на элементе*/
                this.on = function (elem, type, fn) {
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
                        elem.addEventListener(type, data.dispatcher, false);
                    }
                };
                /*Удаляет обработчик с элемента*/
                this.off = function (elem, type) {
                    var typeObj = type.splite(':'), namespace, data;
                    namespace = typeObj[1] || 'global';
                    //получаем данные по элементу из кэша
                    data = this._getMark(elem);

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
        }]);
}(window, angular, document));