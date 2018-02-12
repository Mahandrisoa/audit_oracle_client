function auditCtrl($scope, $http, $element, $timeout, $attrs, auditService, socket, httpPreConfig) {
    var ctrl = this;


    this.$onInit = function () {
        $scope.$on('httpCallStarted', function (e) {
            $('#datePicker').prop('disabled', true);
        });
        $scope.$on('httpCallStopped', function (e) {
            $('#datePicker').prop('disabled', false);
        });

        var converted = this.convertDate(new Date().toDateString());
        ctrl.convertedDate = converted;
        ctrl.showSpinner = true;

        $scope.datePicker = new Date();

        socket.on('startListening', function (socketResponse) {
            auditService
                .getAudits(converted)
                .then(function (response) {
                    response.data.forEach(element => {
                        var cache = parseFloat(element.CACHE_HIT_RATIO).toFixed(3);
                        element.CACHE_HIT_RATIO = cache;
                        element.AUDIT_LABEL = element.DIVISION_TYPE.substring(0, 2) + "" + element.DIVISION;
                    });
                    response.data.sort(compareByLabel);
                    ctrl.httpDone = true;
                    ctrl.audits = response.data;
                    ctrl._temp = response.data; // temp is used for backing up data
                    ctrl._backup = response.data;
                    if (ctrl.audits.length > 0) {
                        ctrl.dateAudit = ctrl.audits[0].DATE_AUDIT_JOURNALIER;
                    }
                    ctrl.showSpinner = false;                   
                }, function (reason) {
                    console.log(reason);
                });
        });
    }
    function compareByLabel(a, b) {
        if (a.AUDIT_LABEL < b.AUDIT_LABEL)
            return -1;
        if (a.AUDIT_LABEL > b.AUDIT_LABEL)
            return 1;
        return 0;
    }

    this.handlePickerChange = function () {
        var converted = this.convertDate($scope.datePicker);
        ctrl.showSpinner = true
        auditService
            .getAudits(converted)
            .then(function (response) {
                response.data.forEach(element => {
                    var cache = parseFloat(element.CACHE_HIT_RATIO).toFixed(3);
                    element.CACHE_HIT_RATIO = cache;
                    element.AUDIT_LABEL = element.DIVISION_TYPE.substring(0, 2) + "" + element.DIVISION;
                    ctrl.showSpinner = false;
                });
                response.data.sort(compareByLabel);
                ctrl.audits = response.data;
                ctrl._temp = response.data; // temp is used for backing up data
                ctrl._backup = response.data;
                if (ctrl.audits.length > 0) {
                    ctrl.dateAudit = ctrl.audits[0].DATE_AUDIT_JOURNALIER;
                } else {
                    ctrl.dateAudit = converted;
                }
                ctrl.showSpinner = false;
                $scope.typeModel = 'Tout';
            }, function (reason) {
                console.log(reason);
            });
    }
    this.handleTypeChange = function (e) {
        if ($scope.typeModel === 'Tout') {
            ctrl.audits = ctrl._backup;
        } else {
            ctrl.audits = ctrl._temp.filter(function (element) {
                return element.DIVISION_TYPE === $scope.typeModel;
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
