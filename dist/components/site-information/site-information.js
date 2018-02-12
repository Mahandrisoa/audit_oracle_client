function siteInformationCtrl($scope, $attrs) {
    var ctrl = this;
    this.$onInit = function () {
        alert(audits);
    }
}
angular.module('app')
    .component('siteInformation', {
        templateUrl: './dist/components/site-information/site-information.html',
        controller: siteInformationCtrl,
        bindings: {
        } 
    });