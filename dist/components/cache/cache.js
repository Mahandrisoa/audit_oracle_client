function cacheCtrl($scope, $http, $element, $attrs) {
    var ctrl = this;

}
angular.module('app')
    .component('cache', {
        templateUrl: './dist/components/cache/cache.html',
        controller: cacheCtrl,
        bindings: {
            cacheValue: '<'
        }
    })