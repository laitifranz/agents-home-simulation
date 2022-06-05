const Observable = require('../utils/Observable');

class DeicingSystem extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('status', 'turn_off') 
    }
    switchOnSystem () {
        if (this.status != 'turn_on')
            this.house.utilities.electricity.consumption += 2000;
        this.status = 'turn_on'
        console.log('Deicing system on')
    }
    switchOffSystem () {
        this.status = 'turn_off'
        console.log('Deicing system off')
    }
}

module.exports = DeicingSystem;