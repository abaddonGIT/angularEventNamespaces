/**
 * Created by abaddon on 30.09.2014.
 */
/*global angular, describe, beforeEach, it, expect*/
(function (an) {
    'use strict';
    describe('baseController', function () {
        var scope, anEvent;
        beforeEach(an.mock.module('myApp'));
        beforeEach(an.mock.inject(function ($rootScope, $controller, $anEvent) {
            scope = $rootScope.$new();
            anEvent = $anEvent;
            $controller('baseController', {$scope: scope});
        }));
        /*
         * testing _getMark Function
         * Тест для ф-и _getMArk
         *  Ф-я добавляет к элементу уникальный идентификатор
         *  и создает для элемента оъект для, в котором
         *  будет хранится обработчики
         */
        it('should mark object and create for him storage object', function () {
            var i, unic = anEvent.unicid, elem, storage;
            for (i = 1; i <= 10; i++) {
                elem = {};
                storage = anEvent._getMark(elem);
                expect(storage).toBe(anEvent.cache[i]);
                expect(elem[unic]).toBe(i);
            }
        });
        /*
         * testing _removeMark function
         * Тест для ф-и _removeMArk
         *  обратная для ф-и _getMark
         */
        it('should remove element from cache', function () {
            var i, elems = [], elem;
            for (i = 1; i < 10; i++) {
                elem = {};
                anEvent._getMark(elem);
                elems.push(elem);
            }
            var ln = elems.length;
            while (ln--) {
                var el = elems[ln];
                expect(anEvent._removeMark(el)).toBeUndefined();
            }
            expect(anEvent._removeMark({})).toBeFalsy();
        });
        /*
         * testing _namespace function
         * Тест для ф-и _namespace
         *  Ф-я для создания пространства имен по строке с разделителем
         */
        it('should create namespaces from string and last element to be array', function () {
            var test = {};
            anEvent._namespaces('one.tow.test.picture', test);
            expect(test.one.tow.test.picture).toBeDefined();
        });
        /*
         * testing on function
         * Тест для ф-и on
         *  Привязвает ф-ю обработчик к элементу
         */
        it('should create data object for element and add to him handler', function () {
            var elem = {}, counter, handler = function () {
                return true;
            };
            expect(anEvent.on(elem, 'click')).toBeFalsy();
            expect(anEvent.on(elem, null, handler)).toBeFalsy();
            expect(anEvent.on(elem, 'click', handler)).toBeFalsy();
            expect(anEvent.on(elem, 'click:namespace1', handler)).toBeFalsy();
            counter = elem[anEvent.unicid];
            expect(counter).toBe(1);
            expect(anEvent.cache[counter].handlers.click.global[0]()).toBeTruthy();
            expect(anEvent.cache[counter].handlers.click.namespace1[0]()).toBeTruthy();
        });
        /*
         * testing off function
         * Тест ф-и off
         *   Отвязывает ф-ю обработчик с элемента
         */
        it('should remove handler from element', function () {
            var elem = {}, counter, check, handler = function () {
                    return true;
                },
                handler2 = function () {
                    return true;
                };
            anEvent.on(elem, 'click', handler);
            //delete one handler from namespace
            anEvent.on(elem, 'click:namespace1', handler);
            anEvent.on(elem, 'click:namespace1', handler2);
            counter = elem[anEvent.unicid];
            anEvent.off(elem, 'click:namespace1', handler);
            check = anEvent.cache[counter].handlers.click.namespace1;
            expect(check.length).toBe(1);
            anEvent.off(elem, 'click:namespace1', handler2);
            expect(check.length).toBe(0);

            //delete all handlers from namespace
            anEvent.on(elem, 'click:namespace1', handler);
            anEvent.on(elem, 'click:namespace1', handler2);
            anEvent.off(elem, 'click:namespace1');
            check = anEvent.cache[counter].handlers.click.namespace1;
            expect(check).toBeUndefined();

            //delete all handlers from if this type
            anEvent.on(elem, 'click:namespace1', handler);
            anEvent.on(elem, 'click:namespace1', handler2);
            anEvent.off(elem, 'click');
            check = anEvent.cache[counter];
            expect(check).toBeUndefined();
        });
    });
}(angular));