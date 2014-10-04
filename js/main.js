/**
 * Created by abaddon on 24.09.2014.
 */
/*global angular, console, document, window*/
(function (an, d, w) {
    "use strict";
    an.module("myApp", ['angularEvent']).
        controller("baseController", ['$scope', '$anEvent', '$timeout', function ($scope, $anEvent, $timeout) {
            $timeout(function () {
                var buttons = d.querySelectorAll("button.on"), offBut = d.querySelector("button.off"),
                    test = function () {
                        console.log('test handler');
                    },
                    test2 = function () {
                        console.log('test2 handler');
                    };

                an.forEach(buttons, function (v, k) {
                    $anEvent.on(v, 'mouseover', function (event) {
                        console.log(event.type + '-global-' + k);
                    });
                    $anEvent.on(v, 'click:test' + k, test);
                    $anEvent.on(v, 'click', test2);
                });

                $anEvent.on(offBut, 'click', function () {
                    an.forEach(buttons, function (v) {
                        $anEvent.off(v, 'click');
                    });
                });

                $anEvent.on(w, 'resize', function () {
                    console.log("размер сменили!");
                });
                //console.log();
            }, 0);
        }]);
}(angular, document, window));