angular.module('app').factory('calculationFactory', function(){
  return {
    put: function(calc){
      localStorage.setItem('bb_fly-or-drive-calc' + calc.id, JSON.stringify(calc));
      return this.getAll();
    },
    get: function(index){
      return JSON.parse(localStorage.getItem('bb_fly-or-drive-calc' + index));
    },
    getAll: function(){
      var notes = [];
      
      for (var i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).indexOf('note') !== -1){
          var note = localStorage.getItem(localStorage.key(i));
          notes.push(JSON.parse(note));
        }
      }
      
      return notes;
    },
    remove: function(calc){
      localStorage.removeItem('bb_fly-or-drive-calc' + calc.index);
      
      return this.getAll();
    }
  };
});
