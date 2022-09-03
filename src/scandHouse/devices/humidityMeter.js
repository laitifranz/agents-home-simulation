const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Observable = require('../utils/Observable');

class HumidityMeter extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('status', 'low_humidity') 
        this.set('humidity', 60)
    }
    
    humidityDetected () {
        this.status = 'high_humidity'
        console.log('High humidity detected from ' + this.name)
    }
    humidityNotDetected () {
        this.status = 'low_humidity'
        console.log('Low humidity from ' + this.name)
    }
}

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
                this.house.devices.bathroom_window.openWindow()
              }
          }
      }));
  
      humidityMeterGoals.push(humidityMeterPromise);
      yield Promise.all(humidityMeterGoals)
      }
  }

module.exports = {HumidityMeter, humidityMeterGoal, humidityMeterIntention};