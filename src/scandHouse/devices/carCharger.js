const Observable = require('../utils/Observable');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');

class CarCharger extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name
        this.set('status', 'unplugged') 
    }

    rechargeMaxPower () {
        if (this.status != 'plugged_max'){
            this.house.utilities.electricity.consumption += 21000;
            this.status = 'plugged_max'
            console.log('Start charging car at MAX power')
        }
        else
            console.log('Car is already charging at MAX power')
    }
    rechargeMinPower () {
        if (this.status != 'plugged_min'){
            this.house.utilities.electricity.consumption += 14000;
            this.status = 'plugged_min'
            console.log('Start charging car at MIN power')
        }
        else
            console.log('Car is already charging at MIN power')
    }
    stopRecharge () {
        this.status = 'unplugged'
        console.log('Recharge car has been stopped')
    }
}

class CarChargerGoal extends Goal {
    constructor(carCharger) {
      super(carCharger);
  
      /** @type {CarCharger} carCharger */
      this.carCharger = carCharger;
    }
  }
  
class CarChargerIntention extends Intention {
    constructor(agent, goal) {
      super(agent, goal);
  
      /** @type {CarCharger} carCharger */
      this.carCharger = this.goal.carCharger;
    }
  
    static applicable(goal) {
      return goal instanceof CarChargerGoal;
    }
  
    *exec() {
      var carChargerGoals = [];
      let carChargerPromise = new Promise(( async res => {
          while(true){
              let status = await this.carCharger.notifyChange('status')
              switch(status){
                    case 'plugged_max':
                        this.carCharger.rechargeMaxPower()
                        break;
                    case 'plugged_min':
                        this.carCharger.rechargeMinPower()
                        break;
                    case 'unplugged':
                        this.carCharger.stopRecharge()
                        break;
              }
          }
      }));
  
      carChargerGoals.push(carChargerPromise);
      yield Promise.all(carChargerGoals)
      }
  }

module.exports = {CarCharger, CarChargerGoal, CarChargerIntention};