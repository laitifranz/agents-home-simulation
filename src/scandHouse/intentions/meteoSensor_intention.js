const meteoSensor = require('../devices/MeteoSensor');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {windowGoal, windowIntention} = require('./windows_intention');
const House = require('../house/House');
const Clock = require('../utils/Clock');

class meteoSensorGoal extends Goal {
  constructor(meteoSensor, house) {
    super(meteoSensor);

    /** @type {meteoSensor} meteoSensor */
    this.meteoSensor = meteoSensor;
    /** @type {myHouse} house */
    this.house = house;
  }
}

class meteoSensorIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {meteoSensor} meteoSensor */
    this.meteoSensor = this.goal.meteoSensor;
    /** @type {myHouse} house */
    this.house = this.goal.house;

  }

  static applicable(goal) {
    return goal instanceof meteoSensorGoal;
  }

  *exec() {
    while(true){
      yield this.meteoSensor.notifyAnyChange()
      this.meteoSensor.applyChange()
    }
  }
}

module.exports = {meteoSensorGoal, meteoSensorIntention}