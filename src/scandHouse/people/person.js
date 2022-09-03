const Observable = require('../utils/Observable');

class Person extends Observable {
    constructor (house, name) {
        super()
        this.house = house;             
        this.name = name;              
        this.set('in_room', 'bedroom')  
        
    }
    moveTo (to) {
        if ( this.house.rooms[this.in_room].doors_to.includes(to) ) {
            console.log(this.name, ' moved from', this.in_room, 'to', to)
            this.in_room = to
            return true
        }
        else {
            console.log(this.name, ' failed moving from', this.in_room, 'to', to)
            return false
        }
    }
    resetVacuumCleaner (vacuumDevice) {
        if (this.name == 'Mario'){
            console.log('Mario is too young, cannot perform the action')
        }
        else
            vacuumDevice.resetVacuum()
    }
}

module.exports = Person