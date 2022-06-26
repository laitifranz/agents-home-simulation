const Observable = require('../utils/Observable');

class InfraredCamera extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('status', 'no_move_detect') 
        this.set('infrared', false)
    }
    movementDetected () {
        this.status = 'move_detect'
        console.log('ALERT! Detected movement from ' + this.name)
        this.status = 'no_move_detect'
    }
    switchOnInfrared () {
        if (!this.infrared){
            this.house.utilities.electricity.consumption += 300;
            this.infrared = true
            console.log('Infrared of ' + this.name + ' is ON')
        }
    }
    switchOffInfrared () {
        if (this.infrared){
            this.house.utilities.electricity.consumption += 100;
            this.infrared = false
            console.log('Infrared of ' + this.name + ' is OFF')
        }
    }
}

module.exports = InfraredCamera;