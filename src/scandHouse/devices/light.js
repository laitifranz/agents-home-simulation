const Observable = require('../utils/Observable');

class Light extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name; 
        this.set('status', 'off') 
    }

    turnOn () {
        if (this.status != 'on'){
            this.house.utilities.electricity.consumption += 10;
            this.status = 'on'
            console.log(this.name + ' turned on')
        }
        else
            console.log(this.name + ' is already on')
    }
    turnOff () {
        if (this.status != 'off'){
            this.status = 'off'
            console.log(this.name + ' turned off')
        }
        else
            console.log(this.name + ' is already off')
    }
}

module.exports = Light;