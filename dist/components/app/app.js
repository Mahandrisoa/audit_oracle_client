angular.module('app', [
    'ngComponentRouter',
])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .value('$routerRootComponent', 'app')
    .component('app', {
        templateUrl: './dist/components/app/app.html',
        controller: appCtrl,
    });

function appCtrl($scope, $http, $attrs) {
    var ctrl = this;
    this.$onInit = function () {
        ctrl.selected = false;
        // ctrl.io = io.connect('http://'+ SERVER.ip_adress +':' + SERVER.port);        
        // ctrl.io.on('test', function (data) {
        //     alert(data.data);
        // });
    }

    this.setSelected = function (elem, date) {
        ctrl.selected = !ctrl.selected;
        ctrl.selectedObj = elem;
        ctrl.selectedDate = date;
    }
}
