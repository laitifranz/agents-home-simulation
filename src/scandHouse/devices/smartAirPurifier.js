const Observable = require('../utils/Observable');

class SmartAirPurifier extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('status')
    }
    switchOnPurifier () {
        if (this.status != 'turn_on'){
            this.house.utilities.electricity.consumption += 500;
            this.status = 'turn_on'
            console.log('Air purifier is ON')
        }
        else
            console.log('Air purifier is already ON')
    }
    switchOffPurifier () {
        this.status = 'turn_off'
        console.log('Air purifier is OFF')
    }
    dirtyAirDetected () {
        this.status = 'dirty_air'
        console.log('Dirty air detected from ' + this.name)
        this.switchOnPurifier()
    }
}

module.exports = SmartAirPurifier;