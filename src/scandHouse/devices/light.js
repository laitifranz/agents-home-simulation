const Observable = require('../utils/Observable');

class Light extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name; 
        this.set('status', 'turn_off') 
    }
    switchOnLight () {
        if (this.status != 'turn_on')
            this.house.utilities.electricity.consumption += 10;
        this.status = 'turn_on'
        console.log(this.name, ' light turned on')
    }
    switchOffLight () {
        this.status = 'turn_off'
        console.log(this.name, ' light turned off')
    }
}

module.exports = Light;