const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Observable = require('../utils/Observable');

class MeteoSensor extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('temperature', 18)
        this.set('forecast_today', 'night')
    }
    
    showData() {
        console.log('The weather is ' + (this.forecast_today).toUpperCase())
        console.log('The temperature outside is ' + this.temperature + '°C')
        
    }
}

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
        this.meteoSensor.showData()
        }
    }
}

module.exports = {MeteoSensor, meteoSensorGoal, meteoSensorIntention};