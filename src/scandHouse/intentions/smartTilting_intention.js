const smartTilting = require('../devices/smartTilting');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
//const {windowGoal, windowIntention} = require('./windows_intention');
const house = require('../house/house');


class smartTiltingGoal extends Goal {
  constructor(smartTilting, house) {
    super(smartTilting);

    /** @type {smartTilting} smartTilting */
    this.smartTilting = smartTilting;
    /** @type {myHouse} house */
    this.house = house;
  }
}

class smartTiltingIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {smartTilting} smartTilting */
    this.smartTilting = this.goal.smartTilting;
    /** @type {myHouse} house */
    this.house = this.goal.house;
  }

  static applicable(goal) {
    return goal instanceof smartTiltingGoal;
  }

  *exec() {
    while(true){
      var smartTiltingGoals = [];
      let smartTiltingPromise = new Promise(( async res => {
          this.smartTilting.openTilting()
          let status = await this.smartTilting.notifyChange('status')
          this.agent.beliefs.declare('smarttilt_open', status=='open')
          this.agent.beliefs.declare('smarttilt_close', status=='close')
    }));

    smartTiltingGoals.push(smartTiltingPromise);
    yield Promise.all(smartTiltingGoals)
    }
}
}

module.exports = {smartTiltingGoal, smartTiltingIntention}