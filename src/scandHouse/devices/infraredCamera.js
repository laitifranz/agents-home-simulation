const Observable = require('../utils/Observable');

class InfraredCamera extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('status', 'off_infrared') 
    }
    movementDetected () {
        this.status = 'movement_detected'
        console.log('Detected movement inside the garage')
    }
    switchOnInfrared () {
        if (this.status != 'on_infrared')
            this.house.utilities.electricity.consumption += 200;
        this.status = 'on_infrared'
        console.log('Infrared camera is on')
    }
    switchOffInfrared () {
        this.status = 'off_infrared'
        console.log('Infrared camera is off')
    }
}

module.exports = InfraredCamera;