const Agent = require('../bdi/Agent');

class VacuumCleaner extends Agent {
    constructor (house, name) {
        super(house, name); 
        this.house = house; 
        this.name = name
        this.status = 'off' 
    }
    turnOff (obj) {
        this.status = 'turnOff'
        console.log(obj + ' turned off')
    }
    turnOn (obj) {
        if (this.status != 'turnOn')
            this.house.utilities.electricity.consumption += 150;
        this.status = 'turnOn'
        console.log(obj + ' turned on')
    }
    move (obj, before, after) {
        this.status = 'move'
        console.log('Move ' + obj + ' from ' + before + ' to ' + after)
        this.clean_previous(before)
        this.clean_after(after)
    }
    clean_previous (before) {
        this.house.utilities.water.consumption += 1;
        console.log('Cleaned ' + before)
    }
    clean_after (after) {
        console.log('Cleaning ' + after)
    }
}

module.exports = VacuumCleaner;