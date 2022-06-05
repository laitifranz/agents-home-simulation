const smartAirPurifier = require('../devices/smartAirPurifier');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {windowGoal, windowIntention} = require('./windows_intention');
const house = require('../house/house');


class smartAirPurifierGoal extends Goal {
  constructor(smartAirPurifier, house) {
    super(smartAirPurifier);

    /** @type {smartAirPurifier} smartAirPurifier */
    this.smartAirPurifier = smartAirPurifier;
    /** @type {myHouse} house */
    this.house = house;
  }
}

class smartAirPurifierIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {smartAirPurifier} smartAirPurifier */
    this.smartAirPurifier = this.goal.smartAirPurifier;
    /** @type {myHouse} house */
    this.house = this.goal.house;
  }

  static applicable(goal) {
    return goal instanceof smartAirPurifierGoal;
  }

  *exec() {
    var smartAirPurifierGoals = [];
    let smartAirPurifierPromise = new Promise(( async res => {
        while(true){
            let status = await this.smartAirPurifier.notifyChange('status')
            this.log('status ' + this.smartAirPurifier.name + ': ' + status + '\n');
            this.agent.beliefs.declare('dirty_air', status=='dirty_air')
            if (status == 'dirty_air'){
              MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new windowGoal(this.house.devices.kitchen_windows.window1, this.house));
          }
        }
    }));

    smartAirPurifierGoals.push(smartAirPurifierPromise);
    yield Promise.all(smartAirPurifierGoals)
    }
}

module.exports = {smartAirPurifierGoal, smartAirPurifierIntention}