const Observable = require('../utils/Observable');

class Window extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('status', 'close') 
    }
    openWindow () {
        this.status = 'open'
        this.house.devices.garage_pump.beliefs.declare("open window_open")
        this.house.devices.garage_pump.beliefs.declare("notopen window_open")
        console.log(this.name + ' is open')
    }
    closeWindow () {
        this.status = 'close'
        this.house.devices.garage_pump.beliefs.declare("notopen window_open")
        this.house.devices.garage_pump.beliefs.declare("open window_open")
        console.log(this.name + ' is close')
    }
}

module.exports = Window;