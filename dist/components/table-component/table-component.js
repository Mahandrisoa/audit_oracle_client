function tableCtrl($scope, $element, $attrs, tableService) {
    var ctrl = this;

    this.$onInit = function () {
        tableService
            .getTables(ctrl.audit.DIVISION, ctrl.date, 'table')
            .then(function (response) {
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
        ctrl.tables.forEach(element => {
            sum += element.TAILLE_OBJET;
        });
        return sum;
    }

    this.handleChange = function (e) {
        switch (e.tableModel) {
            case 'biggest':
                ctrl.tables = ctrl._temp.filter(function (element) {
                    return element.TAILLE_OBJET > 102400;
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
            return $http.get('http://'+ SERVER.ip_adress +':'+ SERVER.port +'/api/objet_details?division=' + division + '&date=' + date + '&objet=' + objType + '');
        };
    });