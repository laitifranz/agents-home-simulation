const Agent = require('../bdi/Agent');

class HeatPump extends Agent {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.status = 'turn_off'
    }

    turnOn () {
        if (this.status != 'turn_on') {
            this.house.utilities.electricity.consumption += 3000; 
            this.house.utilities.water.consumption += 15;
            this.status = 'turn_on'
            console.log('Heat pump is ON')
            this.lowTemp()
        }
    }
    turnOff () {
        this.status = 'turn_off'
        console.log('Heat pump is OFF')
    }
    highTemp () {
        if (this.status != 'high_temp'){
            this.house.utilities.electricity.consumption += 4000;
            this.status = 'high_temp'
            console.log('High temperature (80 degrees) set on heat pump')
        }
        else
            console.log('Heat pump is already at 80 degrees')
    }
    lowTemp () {
        if (this.status != 'low_temp'){
            this.house.utilities.electricity.consumption += 4000;
            this.status = 'low_temp'
            console.log('Low temperature (50 degrees) set on heat pump')
        }
        else
            console.log('Heat pump is already at 50 degrees')
    }
}

module.exports = HeatPump;