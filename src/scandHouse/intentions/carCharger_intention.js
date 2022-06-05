const CarCharger = require('../devices/carCharger');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');

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
            this.agent.beliefs.declare('charging_min', status=='plugged_min')
            this.agent.beliefs.declare('charging_max', status=='plugged_max')
            this.agent.beliefs.declare('not_charging_min', status=='unplugged_min')
            this.agent.beliefs.declare('not_charging_max', status=='unplugged_max')
            this.log('status ' + this.carCharger.name + ': ' + status + '\n');
        }
    }));

    carChargerGoals.push(carChargerPromise);
    yield Promise.all(carChargerGoals)
    }
}

module.exports = {CarChargerGoal, CarChargerIntention}