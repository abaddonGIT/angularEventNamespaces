/**
 * Created by abaddon on 30.09.2014.
 */
/*global angular, describe, beforeEach, it, expect*/
(function (an) {
    'use strict';
    describe('baseController', function () {
        var scope, anEvent;
        //mock Application to allow us to inject our own dependencies
        beforeEach(an.mock.module('myApp'));
        //mock the controller for the same reason and include $rootScope and $controller
        beforeEach(an.mock.inject(function ($rootScope, $controller, $anEvent) {
            //create an empty scope
            scope = $rootScope.$new();
            anEvent = $anEvent;
            //declare the controller and inject our empty scope
            $controller('baseController', {$scope: scope});
        }));
        //testing _getMark Function
        it('should mark object and create for him storage object', function () {
            var i, unic = anEvent.unicid, elem, storage;
            for (i = 1; i <= 50; i++) {
                elem = {};
                storage = anEvent._getMark(elem);
                expect(storage).toBe(anEvent.cache[i]);
                expect(elem[unic]).toBe(i);
            }
        });
        //testing _removeMark Function
        it('should remove element from cache', function () {
            var i, elems = [], elem;
            for (i = 1; i < 50; i++) {
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
        //testing _namespace function
        it('should create namespaces from string and last element to be array', function () {
            var test = {};
            anEvent._namespaces('one.tow.test.picture', test);
            expect(test.one.tow.test.picture).toBeDefined();
        });
    });
}(angular));