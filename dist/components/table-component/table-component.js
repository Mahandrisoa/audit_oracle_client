function tableCtrl($scope, $element, $attrs, tableService) {
    var ctrl = this;

    this.$onInit = function () {
        tableService
            .getTables(ctrl.audit[1], ctrl.date, 'table')
            .then(function (response) {
                // TYPE_OBJET,NOM_OBJET,TAILLE_OBJET,NB_EXTENT,TAILLE_UTILISE,DATE_AUDIT_JOURNALIER,DIVISION
                ctrl.tables = response.data;
                ctrl._backup = response.data;
                ctrl._temp = response.data;
                ctrl.totalSize = total(ctrl.tables);
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
        switch (e.tableModel) {
            case 'biggest':
                ctrl.tables = ctrl._temp.filter(function (element) {
                    return element[2] > 102400;
                });
                break;
            case 'mostDeffed': // les plus defragmentés                
                ctrl.tables = ctrl._backup;
                break;
        }
    }
}

angular.module('app')
    .component('tableComponent', {
        templateUrl: './dist/components/table-component/table-component.html',
        controller: tableCtrl,
        bindings: {
            audit: '<',
            date: '<',
        },
    })
    .service('tableService', function ($http) {
        this.getTables = function (division, date, objType) {
            return $http.get('http://' + SERVER.ip_adress + ':' + SERVER.port + '/api/objet_details?division=' + division + '&date=' + date + '&objet=' + objType + '');
        };
    });