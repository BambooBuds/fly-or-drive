angular.module('app').directive('flyOrDrive', function(calculationFactory) {
  return {
    restrict: "AE",
    scope: {},
    link: function(scope, elem, attrs){
      scope.calcs = [];
      
      // USER INPUTS
      scope.miles = null;
      scope.fare = null;
      scope.flyingTime = null;
      scope.mpg_e = null;
      scope.electricVehicle = false;
      scope.valueOfPersonHour = null;
      scope.numberOfTravelers = null;
      
      nn = function(x) {
        return x !== null;
      };
      
      scope.allInputsNonNull = function() {
        return true; //nn(scope.miles) && nn(scope.fare) && nn(scope.flyingTime) && nn(scope.mpg_e) && nn(scope.valueOfPersonHour) && nn(scope.numberOfTravelers);
      };

      scope.save = function() {
        if (scope.calc){
          var calc = {};

          calc.title = scope.title;
          calc.id = scope.index != -1 ? scope.index : localStorage.length;
          scope.calcs = calculationFactory.put(calc);
        }
      };

      scope.remove = function(index) {
        var indexToDelete = index;
        if (index === undefined){
          indexToDelete = scope.index;
        }
        
        scope.calcs = calculationFactory.remove(indexToDelete);
        
      };

      scope.calcs = calculationFactory.getAll();
    },
    templateUrl: "nh-app/fly-or-drive_main.html"
  };
});
