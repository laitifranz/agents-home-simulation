const humidityMeter = require('../devices/humidityMeter');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {windowGoal, windowIntention} = require('./windows_intention');
const House = require('../house/house');

class humidityMeterGoal extends Goal {
  constructor(humidityMeter, house) {
    super(humidityMeter);

    /** @type {humidityMeter} humidityMeter */
    this.humidityMeter = humidityMeter;
    /** @type {myHouse} house */
    this.house = house;
  }
}

class humidityMeterIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {humidityMeter} humidityMeter */
    this.humidityMeter = this.goal.humidityMeter;
    /** @type {myHouse} house */
    this.house = this.goal.house;

  }

  static applicable(goal) {
    return goal instanceof humidityMeterGoal;
  }

  *exec() {
    var humidityMeterGoals = [];
    let humidityMeterPromise = new Promise(( async res => {
        while(true){
            let status = await this.humidityMeter.notifyChange('status')
            this.log('status ' + this.humidityMeter.name + ': ' + status + '\n');
            this.agent.beliefs.declare('humidity_meter_low', status=='low_humidity')
            this.agent.beliefs.declare('humidity_meter_high', status=='high_humidity')
            if (status == 'high_humidity'){
              MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new windowGoal(this.house.devices.bathroom_window, this.house));
          }
        }
    }));

    humidityMeterGoals.push(humidityMeterPromise);
    yield Promise.all(humidityMeterGoals)
    }
}

module.exports = {humidityMeterGoal, humidityMeterIntention}