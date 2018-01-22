function auditShowCtrl($scope, $http, $attrs) {
    var ctrl = this;
    ctrl.backToAudit = function (e) {
        ctrl.appCtrl.setSelected(null);
    }

    ctrl.$onInit = function() {
        ctrl.selectedObj = ctrl.appCtrl.selectedObj; 
        ctrl.selectedDate = ctrl.appCtrl.selectedDate;
    }
}

angular.module('app')
    .component('auditShow', {
        templateUrl: '/components/audit-show/audit-show.html',
        controller: auditShowCtrl,
        bindings: {
            audit: '<',

        },
        require: {
            appCtrl: '^app'
        },
    })