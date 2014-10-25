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
      
      // ADVANCED INPUTS
      CO2perKWH = 1.52;
      CO2perGallonGas = 19.64;
      CostOfFuel = 3.55;
      CostPerKWH = 0.122;
      CostOffsetting1TonOfCarbon = 14;
      DeprecationMainenecePerMile_nonTesla = 0.1;
      DeprecationMainenecePerMile_Tesla = 0.3;
      
      nn = function(x) {
        return x !== null;
      };
      
      scope.allInputsNonNull = function() {
        return nn(scope.miles) && nn(scope.fare) && nn(scope.flyingTime) && nn(scope.mpg_e) && nn(scope.valueOfPersonHour) && nn(scope.numberOfTravelers);
      };
      
      scope.outputTotal = function(output) {
        return output.gas + output.depreciation + output.fare + output.electricity + output.time + output.carbon;
      }
      
      createOutput = function(title, g, d, f, e, t, c) {
        carbon = (c / 2000) * CostOffsetting1TonOfCarbon;
        
        ret = {
          title: title,
          gas : g,
          depreciation : d,
          fare : f,
          electricity : e,
          time : t,
          carbon : carbon,
          style : {best : false, worst : false, eco : false}
        };
        return ret;
      };
      
      scope.generateOutputs = function(miles, fare, flyingTime, mpg_e, electricVehicle, valueOfPersonHour, numberOfTravelers) {
        humanCostPerHour = valueOfPersonHour * numberOfTravelers;
        carTravelTime = ((miles / 60) + Math.floor(miles / 1440)) * 12;
        outputs = [];
        outputs.push(createOutput(
          "Flying",
          0,
          0,
          (fare * numberOfTravelers),
          0,
          (flyingTime * humanCostPerHour),
          (((miles < 4000) ? ((4000 - miles) / 4000*0.54) : 0) + (numberOfTravelers * miles * 1.08))));
        outputs.push(createOutput(
          "Driving - Input Vehicle",
          (electricVehicle) ? 0 : ((miles / mpg_e) * CostOfFuel),
          (miles * DeprecationMainenecePerMile_nonTesla),
          0,
          (electricVehicle) ? 10 : 0,
          carTravelTime * humanCostPerHour,
          (miles / mpg_e) * (electricVehicle ? (33.7 * CO2perKWH) : CO2perGallonGas)));
        outputs.push(createOutput(
          "Driving 25 MPG Car",
          (miles / 25) * CostOfFuel,
          (miles * DeprecationMainenecePerMile_nonTesla),
          0,
          0,
          carTravelTime * humanCostPerHour,
          CO2perGallonGas * (miles / 25)));
        outputs.push(createOutput(
          "Driving 50 MPG Car",
          (miles / 50) * CostOfFuel,
          (miles * DeprecationMainenecePerMile_nonTesla),
          0,
          0,
          carTravelTime * humanCostPerHour,
          CO2perGallonGas * (miles / 50)));
        outputs.push(createOutput(
          "Driving Tesla Model S",
          0,
          (miles * DeprecationMainenecePerMile_Tesla),
          0,
          (miles / 89) * 33.7 * CostPerKWH,
          (carTravelTime + (Math.floor(miles / 530) * 2)) * humanCostPerHour,
          33.7 * CO2perKWH * (miles / 89)));
        
        bestVal_ind = 0;
        worstVal_ind = 0;
        mostEcoFriendly_ind = 0;
        
        for(i = 1; i < outputs.length; i++) {
          if(scope.outputTotal(outputs[i]) < scope.outputTotal(outputs[bestVal_ind])) {
            bestVal_ind = i;
          } else if(scope.outputTotal(outputs[worstVal_ind]) < scope.outputTotal(outputs[i])) {
            worstVal_ind = i;
          }
          if(outputs[i].carbon < outputs[mostEcoFriendly_ind].carbon) {
            mostEcoFriendly_ind = i;
          }
        }
        
        outputs[bestVal_ind].style.best = true;
        outputs[worstVal_ind].style.worst = true;
        outputs[mostEcoFriendly_ind].style.eco = true;
        
        console.log(outputs);
        return outputs;
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
    templateUrl: "fly-or-drive_main.html"
  };
});
