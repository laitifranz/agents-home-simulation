const Observable = require('../utils/Observable');

class SmartAirPurifier extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house; // reference to the house
        this.name = name; // non-observable
        this.set('status') // observable
    }
    switchOnPurifier () {
        if (this.status != 'turn_on')
            this.house.utilities.electricity.consumption += 500;
        this.status = 'turn_on'
        console.log('Air purifier is on')
    }
    switchOffPurifier () {
        this.status = 'turn_off'
        console.log('Air purifier is off')
    }
    dirtyAirDetected () {
        this.status = 'dirty_air'
        console.log('Dirty air detected in the kitchen')
        this.switchOnPurifier()
    }
}

module.exports = SmartAirPurifier;