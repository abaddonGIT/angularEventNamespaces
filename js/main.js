/**
 * Created by abaddon on 24.09.2014.
 */
/*global angular, console, document*/
(function (an, d) {
    "use strict";
    var app = an.module("myApp", ['angularEvent']).
        controller("baseController", ['$scope', '$anEvent', '$timeout', function ($scope, $anEvent, $timeout) {
            var buttons = d.querySelectorAll("button.on"), offBut = d.querySelector("button.off");
            var test = function () {
                console.log('test handler');
            };
            var test2 = function () {
                console.log('test2 handler');
            };
            an.forEach(buttons, function (v, k) {
//                $anEvent.on(v, 'click', function (event) {
//                    console.log(event.type + '-global-' + k);
//                });
                $anEvent.on(v, 'click:test' + k, test);
                $anEvent.on(v, 'click', test2);
                //$anEvent.on(v, 'mouseover', test);
            });
            $anEvent.on(offBut, 'click', function () {
                an.forEach(buttons, function (v, k) {
                    $anEvent.off(v, 'click');
                });
            });
            $scope.text = 'Hello World!';
        }]);
}(angular, document));