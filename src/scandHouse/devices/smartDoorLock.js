const Observable = require('../utils/Observable');

class SmartLockDoor extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name; 
        this.set('status','lock')
    }
    lockDoor () {
        this.status = 'lock'
        console.log(this.name + ' locked')
    }
    unlockDoor () {
        this.status = 'unlock'
        console.log(this.name + ' unlocked')
    }
}

module.exports = SmartLockDoor;