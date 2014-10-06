angularEventNamespaces
======================

Позволяет регистрировать события на елементах с использованием пространст имен, без jQuery.

**[Демка](http://angular.demosite.pro/event/)**
###Установка:
    var app = angular.module('app', ['angularEvent']);
###Регистрация событий:
События регистрируются на элементе при помощи метода **on**. Метод принимает три аргумента:
- Елемент на котором регистрируется событие (без обёртки jqLite)
- Имя события. Если необходимо зарегистрировать событие в пространстве имен, то оно указывается через <b>:</b>.
        
        click:namespace
- Функция обработчик. которая будет вызвана по наступлению события
        
        var but = d.querySelector("button.click");
        $anEvent.on(but, 'click', function (e) {
            alert("click");
        });
        $anEvent.on(but, 'click:namespace', function (e) {
            alert("click with namespace");
        });

###Отвязка события:
Отвязка события осуществляется при помощи метода **off**.
Метод принимает либо два. либо три аргумента:
- Елемент от. которого надо отвязать событие (без обёртки jqLite)
- Имя отвязываемого события. Если передано имя события без указания пространсва, то будут удалены все обработчики с данным типом.
- Ф-я обработчик. Если данный параметер есть, то будет удален конкретный обработчик события с данным типом.
        
        //Удалить все обработчики события клик
        $anEvent.off(but, 'click');
        //Удалить все обработчики событий в пространсве имен namespace 
        $anEvent.off(but, 'click:namespace');

###Вызов событий по требованию:
Вызов события осуществляется при помощи метода **trigger**;
Метод принимает три два аргумента:
- Елемент на котором было зарегистрированно событие (без обёртки jqLite)
- Имя или объект события, которое необходимо вызвать.
        
        area = d.querySelector("div.mouse");
        $anEvent.on(area, 'testEvent', testEvent);
        $anEvent.on(w, 'resize', function () {
            $anEvent.trigger(area, 'testEvent');
        });
The module adds methods for registration of events with use of namespace in angular without jQuery
