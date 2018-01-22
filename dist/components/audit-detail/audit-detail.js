function auditDetailCtrl($scope, $http, $element, $attrs) {
    var ctrl = this;

    this.show = function (e) {
        this.appCtrl.setSelected(ctrl.audit, ctrl.date);
    }
}
angular.module('app')
    .component('auditDetail', {
        templateUrl: './dist/components/audit-detail/audit-detail.html',
        controller: auditDetailCtrl,
        require: {
            appCtrl: '^app'
        },
        bindings: {
            audit: '<',
            date: '<',
        }
    });    