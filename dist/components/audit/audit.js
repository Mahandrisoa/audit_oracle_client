function auditCtrl($scope, $http, $element, $timeout, $interval, $attrs, auditService, httpPreConfig) {
    var ctrl = this;


    this.$onInit = function () {
        $scope.$on('httpCallStarted', function (e) {
            $('#datePicker').prop('disabled', true);
        });
        $scope.$on('httpCallStopped', function (e) {
            $('#datePicker').prop('disabled', false);
        });
        ctrl.timeOut = 10000;
        var converted = this.convertDate(new Date().toDateString());
        ctrl.convertedDate = converted;
        ctrl.showSpinner = true;

        $scope.datePicker = new Date();

        auditService
            .getAudits(converted)
            .then(function (response) {
                response.data.forEach(function (element) {
                    var cache = parseFloat(element[3]).toFixed(3);
                    element.CACHE_HIT_RATIO = cache;
                    element.AUDIT_LABEL = element[2].substring(0, 2) + "" + element[1];
                });
                response.data.sort(compareByLabel);
                ctrl.httpDone = true;
                ctrl.audits = response.data;
                ctrl._temp = response.data; // temp is used for backing up data
                ctrl._backup = response.data;
                if (ctrl.audits.length > 0) {
                    ctrl.dateAudit = ctrl.audits[0][4]; // ctrl.audits[0][4] est la date de l'audit 
                } else {
                    ctrl.dateAudit = cov(new Date().toDateString());
                }
                ctrl.showSpinner = false;

                var sumUs = 0, sumAg = 0;
                ctrl.audits.forEach(function (value, index) {
                    if (value[2] === "Agence") sumAg++;
                    else if (value[2] === "Usine") sumUs++;
                });

                $('#labelUsine').html(sumUs + ' USINES');
                $('#labelAgence').html(sumAg + ' AGENCES');

            }, function (reason) {
                console.log(reason);
            });

        if (ctrl.enableReload) {
            var time = parseInt($scope.refreshModel);
            ctrl.interval = setInterval(function () {
                auditService
                    .getAudits(converted)
                    .then(function (response) {
                        response.data.forEach(function (element) {
                            var cache = parseFloat(element[3]).toFixed(3);
                            element.CACHE_HIT_RATIO = cache;
                            element.AUDIT_LABEL = element[2].substring(0, 2) + "" + element[1];
                        });
                        response.data.sort(compareByLabel);
                        ctrl.httpDone = true;
                        ctrl.audits = response.data;
                        ctrl._temp = response.data; // temp is used for backing up data
                        ctrl._backup = response.data;
                        if (ctrl.audits.length > 0) {
                            ctrl.dateAudit = ctrl.audits[0][4]; // ctrl.audits[0][4] est la date de l'audit 
                        } else {
                            ctrl.dateAudit = cov(new Date().toDateString());
                        }
                        ctrl.showSpinner = false;

                        var sumUs = 0, sumAg = 0;
                        ctrl.audits.forEach(function (value, index) {
                            if (value[2] === "Agence") sumAg++;
                            else if (value[2] === "Usine") sumUs++;
                        });

                        ctrl.agences = sumAg;
                        ctrl.usines = sumUs;

                    }, function (reason) {
                        console.log(reason);
                    });
            }, time);
        }
    }

    function compareByLabel(a, b) {
        if (a.AUDIT_LABEL < b.AUDIT_LABEL)
            return -1;
        if (a.AUDIT_LABEL > b.AUDIT_LABEL)
            return 1;
        return 0;
    }
    /**
     * alternavite for this.convertDate() {}
     * used in handleInterval
     * @param {} inputFormat 
     */
    function cov(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    }


    this.handleInterval = function () {
        if ($scope.refreshModel === "0") {
            clearInterval(ctrl.interval);
        } else {
            var time = parseInt($scope.refreshModel);
            clearInterval(ctrl.interval);
            ctrl.interval = setInterval(function () {
                var converted = cov(new Date().toDateString());
                ctrl.showSpinner = true
                auditService
                    .getAudits(converted)
                    .then(function (response) {
                        response.data.forEach(function (element) {
                            var cache = parseFloat(element[3]).toFixed(3);
                            element.CACHE_HIT_RATIO = cache;
                            element.AUDIT_LABEL = element[2].substring(0, 2) + "" + element[1];
                        });
                        response.data.sort(compareByLabel);
                        ctrl.httpDone = true;
                        ctrl.audits = response.data;
                        ctrl._temp = response.data; // temp is used for backing up data
                        ctrl._backup = response.data;
                        if (ctrl.audits.length > 0) {
                            ctrl.dateAudit = ctrl.audits[0][4]; // ctrl.audits[0][4] est la date de l'audit 
                            $('#datePicker').val(null);
                        } else {
                            ctrl.dateAudit = cov(new Date().toDateString());
                            var now = new Date();
                            var day = ("0" + now.getDate()).slice(-2);
                            var month = ("0" + (now.getMonth() + 1)).slice(-2);
                            var today = now.getFullYear() + "-" + (month) + "-" + (day);                                                       
                            ctrl.datePicker = null;
                            $('#datePicker').val(null);
                        }
                        ctrl.showSpinner = false;

                        var sumUs = 0, sumAg = 0;
                        ctrl.audits.forEach(function (value, index) {
                            if (value[2] === "Agence") sumAg++;
                            else if (value[2] === "Usine") sumUs++;
                        });

                        ctrl.agences = sumAg;
                        ctrl.usines = sumUs;

                    }, function (reason) {
                        console.log(reason);
                    });
            }, time);
        }
    }

    this.handlePickerChange = function (e) {
        var converted = this.convertDate($scope.datePicker);
        ctrl.showSpinner = true
        auditService
            .getAudits(converted)
            .then(function (response) {
                response.data.forEach(function (element) {
                    var cache = parseFloat(element[3]).toFixed(3);
                    element.CACHE_HIT_RATIO = cache;
                    element.AUDIT_LABEL = element[2].substring(0, 2) + "" + element[1];
                    ctrl.showSpinner = false;
                });
                response.data.sort(compareByLabel);
                ctrl.audits = response.data;
                ctrl._temp = response.data; // temp is used for backing up data
                ctrl._backup = response.data;
                if (ctrl.audits.length > 0) {
                    ctrl.dateAudit = ctrl.audits[0][4];
                } else {
                    ctrl.dateAudit = converted;                    
                }
                ctrl.showSpinner = false;
                $scope.typeModel = 'Tout';

                var sumUs = 0, sumAg = 0;
                ctrl.audits.forEach(function (value, index) {
                    if (value[2] === "Agence") sumAg++;
                    else if (value[2] === "Usine") sumUs++;
                });
                
                ctrl.agences = sumAg;
                ctrl.usines = sumUs;
               

            }, function (reason) {
                console.log(reason);
            });
    }

    this.handleTypeChange = function (e) {
        if ($scope.typeModel === 'Tout') {
            ctrl.audits = ctrl._backup;
        } else {
            ctrl.audits = ctrl._temp.filter(function (element) {
                return element[2] === $scope.typeModel;
            });
        }
    }
    this.convertDate = function (inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    }
    this.handleSearch = function (e) {
        console.log($scope.searchModel);
        //ctrl.audits.match()
    }
}

angular.module('app')
    .component('audit', {
        templateUrl: './dist/components/audit/audit.html',
        controller: auditCtrl,
    })
    .service('auditService', function ($http) {
        this.getAudits = function (date) {
            return $http.get('http://' + SERVER.ip_adress + ':' + SERVER.port + '/api/audits?date=' + date, {
                cache: true
            });
        }
    });
