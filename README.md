angularEventNamespaces
======================

Позволяет регистрировать события на елементах с использованием пространств имен, без jQuery.

**[Демка](http://angular.demosite.pro/event/)**
###Установка:
    var app = angular.module('app', ['angularEvent']);
###Привязка событий:
События регистрируются на элементе при помощи метода **on**. Метод принимает три аргумента:
- Елемент на котором регистрируется событие (без обёртки jqLite)
- Имя события. Если необходимо зарегистрировать событие в пространстве имен, то оно указывается так:
        
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
Метод принимает два аргумента:
- Елемент на котором было зарегистрированно событие (без обёртки jqLite)
- Имя или объект события, которое необходимо вызвать.
        
        area = d.querySelector("div.mouse");
        $anEvent.on(area, 'testEvent', testEvent);
        $anEvent.on(w, 'resize', function () {
            $anEvent.trigger(area, 'testEvent');
        });

angularEventNamespaces
======================

The module adds methods for registration of events with use of namespace in angular without jQuery.

**[Demo](http://angular.demosite.pro/event/)**
###installation:
    var app = angular.module('app', ['angularEvent']);
###Bind event:
Method **on** bind events for element. It accepts three arguments:
- Element to which bind events (not wrapper jqLite);
- Event name. If the event has to be connected with an element through namespace, you write something like this:
        
        click:namespace
- Handler function.
        
        var but = d.querySelector("button.click");
        $anEvent.on(but, 'click', function (e) {
            alert("click");
        });
        $anEvent.on(but, 'click:namespace', function (e) {
            alert("click with namespace");
        });

###Unbind event:
Method **off** unbind event for element. It accepts two or three arguments:
- Element to which bind events (not wrapper jqLite);
- Event name which should unbind from element. If namespace isn't specified when unbind all events this type;
- Handler function. If is true when it will be removed. 
        
        //Removed all handlers for event which name click
        $anEvent.off(but, 'click');
        //Removed all handlers for event which name click in namespace
        $anEvent.off(but, 'click:namespace');

###Call of events on demand:
Method **trigger** call of event on demand;
It accepts two arguments:
- Element to which bind events (not wrapper jqLite);
- Event name or event object when should called.
        
        area = d.querySelector("div.mouse");
        $anEvent.on(area, 'testEvent', testEvent);
        $anEvent.on(w, 'resize', function () {
            $anEvent.trigger(area, 'testEvent');
        });