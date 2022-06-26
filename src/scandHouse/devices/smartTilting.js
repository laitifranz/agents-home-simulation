const Observable = require('../utils/Observable');

class SmartTilting extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house; 
        this.name = name; 
        this.set('status', 'close') 
    }
    openTilting () {
        this.status = 'open'
        this.house.devices.garage_light.turnOn()
        console.log('The tilting is open')
    }
    closeTilting () {
        this.status = 'close'
        this.house.devices.garage_light.turnOff()
        console.log('The tilting is close')
    }
}

module.exports = SmartTilting;