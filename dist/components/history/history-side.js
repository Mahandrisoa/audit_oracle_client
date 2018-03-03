function historyCtrl($scope,$http, historyService) {
    var ctrl = this;
    this.$onInit = function () {
        $http.get('http://' + SERVER.ip_adress + ':' + SERVER.port + '/api/allAuddits')
        .then(function (response) {
            ctrl.histories = response.data;
            console.log(ctrl.histories);
        }, function (reason) {
            console.warn('ERROR :' + reason)
        });
    }
}

angular.module('app')
    .component('historySide', {
        templateUrl: './dist/components/history/history-side.html',
        controller: historyCtrl,        
    })
    .service('historyService', function ($http) {
        this.getHistory = function () {
            return $http.get('http://' + SERVER.ip_adress + ':' + SERVER.port + '/api/allAuddits');
        }
    });