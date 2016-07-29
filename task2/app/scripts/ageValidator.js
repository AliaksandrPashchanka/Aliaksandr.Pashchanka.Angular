app.directive('ageValidator', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            function ageValidator(ngModelValue) {
                if (/^[ 0-9]+$/.test(ngModelValue)) {
                    ctrl.$setValidity('isNumberValidator', true);
                } else {
                    ctrl.$setValidity('isNumberValidator', false);
                }
                if (_.inRange(parseInt(ngModelValue,10),12,100)) {
                    ctrl.$setValidity('ageRangeValidator', true);
                } else {
                    ctrl.$setValidity('ageRangeValidator', false);
                }
                return ngModelValue;
            }
            ctrl.$parsers.push(ageValidator);
        }
    };
});