function diskCtrl($scope, $element, $attrs, diskService) {
    var ctrl = this;
    this.$onInit = function () {
        diskService.getDisks(ctrl.audit.DIVISION, ctrl.date)
            .then(function (response) {
                ctrl.disks = response.data;
                ctrl.disks.forEach(d => {
                    var r3 = parseFloat((d.ESPACE_LIBRE * 100) / d.ESPACE_TOTAL).toFixed(3);
                    d['percentUsed'] = r3;
                    /**
                     * need some verifications 
                     */
                });
            }, function (reason) {
                console.warn('ERROR :' + reason)
            });
    }

}

angular.module('app')
    .component('disk', {
        templateUrl: './dist/components/disk/disk.html',
        controller: diskCtrl,
        bindings: {
            audit: '<',
            date: '<',
        }
    })
    .service('diskService', function ($http) {
        this.getDisks = function (division, date) {
            return $http.get('http://'+ SERVER.ip_adress +':'+ SERVER.port +'/api/disque_details?division=' + division + '&date=' + date);
        }
    });