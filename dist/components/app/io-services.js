angular.module('app')
    .factory('socket', function ($rootScope) {
        var socket = io.connect('http://' + SERVER.ip_adress + ':' + SERVER.port);
        return {
            on: function (eventName, callback) {
                socket.on(eventName, callback);
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, callback);
            }
        };
    });