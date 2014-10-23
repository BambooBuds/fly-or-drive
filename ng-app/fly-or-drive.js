angular.module('app').directive('fly', function(calculationFactory) {
  return {
    restrict: "AE",
    scope: {},
    link: function(scope, elem, attrs){
      // USER INPUTS
      scope.miles = 0;
      scope.flyingTime = 0;
      scope.mpg = 0;
      scope.electricVehicle = false;
      scope.valueOfPersonHour = 0;
      scope.numberOfTravelers = 0;
      
      // ADVANCED INPUTS
      CO2perKWH = 1.52;
      CO2perGallonGas = 19.64;
      CostOfFuel = 3.55;
      CostPerKWH = 0.122;
      CostOffsetting1TonOfCarbon = 14;
      DeprecationMainenecePerMile_nonTesla = 0.1;
      DeprecationMainenecePerMile_nonTesla = 0.3;
      
      scope.flyingCO2 = function() {
        p = 0;
        if(scope.miles < 4000) {
          p = (4000 - scope.miles) / 4000*0.54;
        }
        return p + scope.numberOfTravelers*scope.miles*1.08;
      };
      scope.inputVehicleCO2 = function() {
        m = CO2perGallonGas;
        if(scope.electricVehicle) {
          m = 33.7 * CO2perKWH;
        }
        return (scope.miles / scope.mpg) * m;
      };
      scope.mpg25CO2 = function() {
        return CO2perGallonGas * (scope.miles / 25);
      };
      scope.mpg50CO2 = function() {
        return CO2perGallonGas * (scope.miles / 50);
      };
      scope.teslaCO2 = function() {
        return 33.7 * CO2perKWH * (scope.miles / 89)
      };
      
      scope.save = function() {
        if (scope.calc){
          var calc = {};
          
          calc.title = scope.title;
          calc.id = scope.index != -1 ? scope.index : localStorage.length;
          scope.calculations = calculationFactory.put(calc);
        }
      };
      
      scope.remove = function(index) {
        var indexToDelete = index;
        if (index === undefined){
          indexToDelete = scope.index;
        }
        
        scope.calculations = calculationFactory.remove(indexToDelete);
      };
      
      scope.calculations = calculationFactory.getAll();
    },
    templateUrl: "ng-app/fly-or-drive_main.html"
  };
});
