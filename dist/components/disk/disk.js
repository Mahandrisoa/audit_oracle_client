function diskCtrl($scope, $element, $attrs, diskService) {
    var ctrl = this;
    this.$onInit = function () {     
        
        var date  = ctrl.date;
        var tableau = date.split('/');
        var cdate = tableau[0] +"/"+ tableau[1]+"/"+ new Date().getFullYear();        
        diskService.getDisks(ctrl.audit.DIVISION, cdate)
            .then(function (response) {
                ctrl.disks = response.data;
                /** Adding precent to object attribute */
                ctrl.disks.forEach(d => {
                    var r3 = parseFloat((d.ESPACE_LIBRE * 100) / d.ESPACE_TOTAL).toFixed(3);
                    if(isNaN(r3)) {
                        d['percentUsed'] = "0";
                    }else {
                        d['percentUsed'] = r3;
                    }
                });
                /** Filtering with non zero attribute **/
                ctrl.disks = ctrl.disks.filter(function (el){
                    return el.ESPACE_TOTAL !== 0; 
                });
            }, function (reason) {
                console.warn('ERROR :' + reason)
            });
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