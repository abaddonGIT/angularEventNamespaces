/**
 * Created by abaddon on 24.09.2014.
 */
/*global angular, console, document*/
(function (an, d) {
    "use strict";
    var app = an.module("myApp", ['angularEvent']).
        controller("baseController", ['$scope', '$anEvent', '$timeout', function ($scope, $anEvent, $timeout) {
            var buttons = d.querySelectorAll("button");
            an.forEach(buttons, function (v, k) {
                $anEvent.on(v, 'click', function (event) {
                    console.log(event.type + '-global-' + k);
                });
                $anEvent.on(v, 'click:space_' + k, function (event) {
                    console.log(event.type + '-' + k);
                });
                $anEvent.on(v, 'mouseover', function (event) {
                    console.log(event.type + '-' + k);
                });
            });
            $scope.text = 'Hello World!';
        }]);
}(angular, document));