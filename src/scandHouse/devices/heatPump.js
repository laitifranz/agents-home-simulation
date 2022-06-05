const Agent = require('../bdi/Agent');

class HeatPump extends Agent {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.status = 'turn_off'
    }
    switchOnPump () {
        if (this.status != 'turn_on') {
            this.house.utilities.electricity.consumption += 2000; 
            this.house.utilities.water.consumption += 15;
        }
        this.status = 'turn_on'
        console.log('Heat pump on')
        this.returnLowTemp()
    }
    switchOffPump () {
        this.status = 'turn_off'
        console.log('Heat pump off')
    }
    turnHighTemp () {
        if (this.status != 'maintain_high_temp')
            this.house.utilities.electricity.consumption += 4000;
        this.status = 'maintain_high_temp'
        console.log('High temperature (80 degrees) of heat pump on')
    }
    returnLowTemp () {
        this.status = 'return_low_temp'
        console.log('Low temperature (50 degrees) of heat pump on')
    }
}

module.exports = HeatPump;