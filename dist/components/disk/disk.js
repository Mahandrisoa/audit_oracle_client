function diskCtrl($scope, $element, $attrs, diskService) {
    var ctrl = this;
    this.$onInit = function () {

        var date = ctrl.date;
        var tableau = date.split('/');
        var cdate = tableau[0] + "/" + tableau[1] + "/" + new Date().getFullYear();
        diskService.getDisks(ctrl.audit[1], cdate)
            .then(function (response) {
                ctrl.disks = response.data;
                /** Adding precent to object attributes */
                ctrl.disks.forEach(d => {

                    // [ NOM_DISQUE , ESPACE_TOTAL , ESPACE_LIBRE , serveur , DATE_AUDIT_JOURNALIER , DIVISION ]
                    var r3 = parseFloat((d[2] * 100) / d[1]).toFixed(3);
                    var goUsed = precisionRound(parseFloat((d[1] - d[2]) / 1073741824).toFixed(3), 1);
                    var goTotal = precisionRound(parseFloat(d[1] / 1073741824).toFixed(3), 1);
                    if (isNaN(r3)) {
                        d['percentUsed'] = "0";
                    } else {
                        d['percentUsed'] = r3;
                    }
                    d['goUsed'] = goUsed;
                    d['goTotal'] = goTotal;
                });
                /** Filtering with non zero attribute **/
                ctrl.disks = ctrl.disks.filter(function (el) {
                    return el[1] !== 0;
                });
            }, function (reason) {
                console.warn('ERROR :' + reason)
            });
    }

    function precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

    this.convertDate = function (inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
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
            return $http.get('http://' + SERVER.ip_adress + ':' + SERVER.port + '/api/disque_details?division=' + division + '&date=' + date);
        }
    });