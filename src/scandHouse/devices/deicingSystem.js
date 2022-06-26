const Agent = require('../bdi/Agent');

class DeicingSystem extends Agent {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.status = 'off' 
    }
    switchOnSystem () {
        if (this.status != 'on'){
            this.house.utilities.electricity.consumption += 2000;
            this.status = 'on'
            console.log('Deicing system ON')
        }
        else
            console.log('Deicing system is already ON')
    }
    switchOffSystem () {
        if (this.status != 'off'){
            this.status = 'off'
            console.log('Deicing system OFF')
        }
        else
            console.log('Deicing system is already OFF')
    }
}

module.exports = DeicingSystem;