/**
 * Created by abaddon on 24.09.2014.
 */
/*global angular, console, document, window*/
(function (an, d, w) {
    "use strict";
    an.module("myApp", ['angularEvent']).
        controller("baseController", ['$scope', '$anEvent', '$timeout', function ($scope, $anEvent, $timeout) {
            //timeout for correct testing
            $timeout(function () {
                var but = d.querySelector("button.click"),
                    removeAll = d.querySelector("button.remove-all"),
                    removeNamespace = d.querySelector("button.remove-namespace"),
                    area = d.querySelector("div.mouse"),
                    select = d.querySelector("select.change");
                //Click event
                $anEvent.on(but, 'click', function (e) {
                    alert("click");
                });
                $anEvent.on(but, 'click:namespace', function (e) {
                    alert("click with namespace");
                });
                $anEvent.on(removeAll, 'click', function (e) {
                    $anEvent.off(but, 'click');
                });
                $anEvent.on(removeNamespace, 'click', function (e) {
                    $anEvent.off(but, 'click:namespace');
                });
                //mouseover and mouseout
                $anEvent.on(area, 'mouseover', function (e) {
                    this.innerHTML = 'mouseover';
                });
                $anEvent.on(area, 'mouseout', function (e) {
                    this.innerHTML = 'mouseout';
                });
                //change
                $anEvent.on(select, 'change', function (e) {
                    alert(this.value);
                });

                $anEvent.on(w, 'resize', function () {
                    $anEvent.trigger(buttons[0], 'testEvent');
                });
            }, 0);
        }]);
}(angular, document, window));