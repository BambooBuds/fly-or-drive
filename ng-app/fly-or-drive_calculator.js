angular.module('app').directive('calculator', function(calculationFactory) {
  return {
    restrict: "E",
    scope: {
      miles : "&miles",
      fare : "&fare",
      flyingTime : "&flightLen",
      mpg_e : "&mpgE",
      electricVehicle : "&elec",
      valueOfPersonHour : "&hourVal",
      numberOfTravelers : "&numPass",
    },
    link: function(scope, elem, attrs){
      curr_index = 0;
      internal_outputs = [];
      // ADVANCED INPUTS
      CO2perKWH = 1.52;
      CO2perGallonGas = 19.64;
      CostOfFuel = 3.12;
      CostPerKWH = 0.1092;
      CostOffsetting1TonOfCarbon = 14;
      DeprecationMainenecePerMile_nonTesla = 0.12;
      DeprecationMainenecePerMile_Tesla = 0.36;
      
      scope.outputTotal = function(output) {
        return output.gas + output.depreciation + output.fare + output.electricity + output.time + output.carbon;
      };
      
      createOutput = function(title, g, d, f, e, t, c) {
        carbon = (c / 2000) * CostOffsetting1TonOfCarbon;
        
        // To get around angular's dirty checking of hashkeys, we reuse values
        ret = { style: {}};
        if(internal_outputs.length >= (curr_index + 1)) {
          ret = internal_outputs[curr_index];
          curr_index++;
        }
        ret.title = title;
        ret.gas = g;
        ret.depreciation = d;
        ret.fare = f;
        ret.electricity = e;
        ret.time = t;
        ret.carbon = carbon;
        ret.style.best = false;
        ret.style.worst = false;
        ret.style.eco = false;
        return ret;
      };
      
      scope.generateOutputs = function() {
        curr_index = 0;
        humanCostPerHour = scope.valueOfPersonHour() * scope.numberOfTravelers();
        carTravelTime = (scope.miles() / 60) + (Math.floor(scope.miles() / 1440) * 12);
        outputs = [];
        outputs.push(createOutput(
          "Flying",
          0,
          0,
          (scope.fare() * scope.numberOfTravelers()),
          0,
          (scope.flyingTime() * humanCostPerHour),
          (((scope.miles() < 1400) ? (((1400 - scope.miles()) / 1400)*0.54) : 0) + (scope.numberOfTravelers() * scope.miles() * 1.08))));
        outputs.push(createOutput(
          "Driving - Input Vehicle",
          (scope.electricVehicle()) ? 0 : ((scope.miles() / scope.mpg_e()) * CostOfFuel),
          (scope.miles() * DeprecationMainenecePerMile_nonTesla),
          0,
          (scope.electricVehicle()) ? (scope.miles() / scope.mpg_e) * CostPerKWH : 0,
          carTravelTime * humanCostPerHour,
          (scope.miles() / scope.mpg_e()) * (scope.electricVehicle() ? (33.7 * CO2perKWH) : CO2perGallonGas)));
        outputs.push(createOutput(
          "Driving 25 MPG Car",
          (scope.miles() / 25) * CostOfFuel,
          (scope.miles() * DeprecationMainenecePerMile_nonTesla),
          0,
          0,
          carTravelTime * humanCostPerHour,
          CO2perGallonGas * (scope.miles() / 25)));
        outputs.push(createOutput(
          "Driving 50 MPG Car",
          (scope.miles() / 50) * CostOfFuel,
          (scope.miles() * DeprecationMainenecePerMile_nonTesla),
          0,
          0,
          carTravelTime * humanCostPerHour,
          CO2perGallonGas * (scope.miles() / 50)));
        outputs.push(createOutput(
          "Driving Tesla Model S",
          0,
          (scope.miles() * DeprecationMainenecePerMile_Tesla),
          0,
          (scope.miles() / 89) * 33.7 * CostPerKWH,
          (carTravelTime + (Math.floor(scope.miles() / 530) * 2)) * humanCostPerHour,
          33.7 * CO2perKWH * (scope.miles() / 89)));
        
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

        internal_outputs = outputs;
        return outputs;
      };
      
      scope.generateOutputs();
    },
    templateUrl: "ng-app/fly-or-drive_calculator.html"
  };
});
