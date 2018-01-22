function tabCtrl() {
    var ctrl = this;

}
angular.module('app')
    .component('tab', {
        templateUrl: './dist/components/tab/tab.html',
        controller: tabCtrl,
        bindings: {
            audit: '<',
            date : '<',
        }
    });