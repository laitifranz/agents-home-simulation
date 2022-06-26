const humidityMeter = require('../devices/HumidityMeter');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {windowGoal, windowIntention} = require('./windows_intention');

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
            let humidity = await this.humidityMeter.notifyChange('humidity')
            if (humidity > 85) {
              console.log('Humidity: ' + humidity + '%')
              MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new windowGoal(this.house.devices.bathroom_window, this.house, 'open'));
            }
        }
    }));

    humidityMeterGoals.push(humidityMeterPromise);
    yield Promise.all(humidityMeterGoals)
    }
}

module.exports = {humidityMeterGoal, humidityMeterIntention}