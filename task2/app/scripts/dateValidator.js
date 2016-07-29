app.directive('dateValidator', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            function dateValidator(ngModelValue) {
                var inputDate = ngModelValue.split("/");
                var currentDate = new Date();
                var minDate = [1920,01,01];
                var maxDays = function(year, month, day) {
                    var max = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                        if (year % 4 == 0) {
                            max[1] = 29;
                        }
                        return (max[month-1] >= day);
                }
                if ((inputDate[0].length == 4) && (inputDate[1].length == 2) && (inputDate[2].length == 2)) {
                    ctrl.$setValidity('dateFormatValidator', true);
                }
                else {
                    ctrl.$setValidity('dateFormatValidator', false);
                }
                if (/\d+\/\d+\/\d{2}$/.test(ngModelValue)) {
                    ctrl.$setValidity('isNumbersValidator', true);
                }
                else {
                    ctrl.$setValidity('isNumbersValidator', false);
                }
                if ( (inputDate[0] >= minDate[0]) && ((inputDate[1] > 0) && inputDate[1] <= 12) && ((inputDate[2] > 0) && (maxDays(inputDate[0],inputDate[1],inputDate[2])))) {
                    ctrl.$setValidity('dateRangeValidator', true);
                }
                else {
                    ctrl.$setValidity('dateRangeValidator', false);
                }
                if ((inputDate[0] < currentDate.getFullYear())) {
                    ctrl.$setValidity('isDateValidator', true);
                }
                else if ((inputDate[0] == currentDate.getFullYear()) && (inputDate[1] <= currentDate.getMonth()) && (inputDate[2] <= currentDate.getDate())) {
                    ctrl.$setValidity('isDateValidator', true);
                }
                else {
                    ctrl.$setValidity('isDateValidator', false);
                }
                
                return ngModelValue;
            }
            ctrl.$parsers.push(dateValidator);
        }
    };
});