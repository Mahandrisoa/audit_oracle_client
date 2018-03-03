function tablespaceCtrl($scope, $element, $attrs, tablespaceService) {
    var ctrl = this;
    this.$onInit = function () {
        tablespaceService.getTablespaces(ctrl.audit[1], ctrl.date, 'tablespace')        
            .then(function (response) {
                ctrl.tablespaces = response.data;
                // [ TYPE_OBJET, NOM_OBJET , TAILLE_OBJET , NB_EXTENT , TAILLE_UTILISE , DATE_AUDIT_JOURNALIER , DIVISION]
                ctrl.tablespaces.forEach(function(tbl){
                    var r3 = parseFloat((tbl[4] * 100) / tbl[2]).toFixed(3);
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
            return $http.get('http://' + SERVER.ip_adress + ':' + SERVER.port + '/api/objet_details?division=' + division + '&date=' + date + '&objet=' + objType + '');
        }
    });