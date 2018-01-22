function auditCtrl($scope, $http, $element, $timeout, $attrs, auditService) {
    var ctrl = this;

    this.$onInit = function () {
        var converted = this.convertDate(new Date().toDateString());
        ctrl.convertedDate = converted;
        ctrl.showSpinner = true;

        $scope.datePicker = new Date();

        $timeout(function () {
            auditService
                .getAudits(converted)
                .then(function (response) {
                    response.data.forEach(element => {
                        var cache = parseFloat(element.CACHE_HIT_RATIO).toFixed(3);
                        element.CACHE_HIT_RATIO = cache;
                    });
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
        }, 1000);

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
                    ctrl.showSpinner = false;
                });
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
            return $http.get('http://'+ SERVER.ip_adress +':'+ SERVER.port +'/api/audits?date=' + date);
        }
    });
