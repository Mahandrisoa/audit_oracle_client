function tableIndexCtrl($scope, $element, $attrs, indexService) {
    var ctrl = this;
    this.$onInit = function () {
        indexService
            .getIndexes(ctrl.audit[1], ctrl.date, 'index')
            .then(function (response) {
                ctrl.indexes = response.data;
                ctrl._backup = response.data;
                ctrl._temp = response.data;
            }, function (reason) {
                console.warn('ERROR :' + reason);
            });
    }

    function total(array) {
        var sum = 0;
        ctrl.tables.forEach(function(element) {
            sum += element[2];
        });
        return sum;
    }

    this.handleChange = function (e) {
        console.log('onchange');
        switch (e.indexModel) {
            case 'biggest':
                ctrl.indexes = ctrl._temp.filter(function (element) {
                    return element[2] > 102400;
                });
                break;
            case 'mostDeffed': // les plus defragmentés                
                ctrl.indexes = ctrl._backup;
                break;
        }
    }
}

angular.module('app')
    .component('tableIndex', {
        templateUrl: './dist/components/table-index/table-index.html',
        controller: tableIndexCtrl,
        bindings: {
            audit: '<',
            date: '<',
        }
    })
    .service('indexService', function ($http) {
        this.getIndexes = function (division, date, objType) {
            return $http.get('http://'+ SERVER.ip_adress +':'+ SERVER.port +'/api/objet_details?division=' + division + '&date=' + date + '&objet=' + objType + '');
        }
    });