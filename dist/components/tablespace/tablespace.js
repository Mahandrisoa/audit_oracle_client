function tablespaceCtrl($scope, $element, $attrs, tablespaceService) {
    var ctrl = this;
    this.$onInit = function () {
        tablespaceService.getTablespaces(ctrl.audit.DIVISION, ctrl.date, 'tablespace')
            .then(function (response) {
                ctrl.tablespaces = response.data;
                ctrl.tablespaces.forEach(tbl => {
                    var r3 = parseFloat((tbl.TAILLE_UTILISE * 100) / tbl.TAILLE_OBJET).toFixed(3);
                    tbl['percentUsed'] = r3;
                });                
            });        
    }
}

angular.module('app')
    .component('tablespace', {
        templateUrl: './dist/components/tablespace/tablespace.html',
        controller: tablespaceCtrl,
        bindings: {
            audit: '<',
            date: '<',
        }
    }).service('tablespaceService', function ($http) {
        this.getTablespaces = function (division, date, objType) {
            return $http.get('http://'+ SERVER.ip_adress +':'+ SERVER.port +'/api/objet_details?division=' + division + '&date=' + date + '&objet=' + objType + '');
        }
    });