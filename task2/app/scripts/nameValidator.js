var app = angular.module('app', ['ngMessages']);
app.directive('nameValidator', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            function nameValidator(ngModelValue) {
                var firstChar = ngModelValue[0];
                if (/[A-Za-z]$/.test(ngModelValue)) {
                    ctrl.$setValidity('englishSymbolsValidator', true);
                } else {
                    ctrl.$setValidity('englishSymbolsValidator', false);
                }
                if (/[A-Z]/.test(firstChar)) {
                    ctrl.$setValidity('uppercaseValidator', true);
                } else {
                    ctrl.$setValidity('uppercaseValidator', false);
                }
                if (ngModelValue.length > 3) {
                    ctrl.$setValidity('sixCharactersValidator', true);
                } else {
                    ctrl.$setValidity('sixCharactersValidator', false);
                }
                return ngModelValue;
            }
            ctrl.$parsers.push(nameValidator);
        }
    };
});