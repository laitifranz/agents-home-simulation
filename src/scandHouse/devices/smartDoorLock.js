const Observable = require('../utils/Observable');

class SmartLockDoor extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name; 
        this.set('status','unlock')
    }
    lock () {
        this.status = 'lock'
        console.log(this.name + ' is locked')
    }
    unlock () {
        this.status = 'unlock'
        console.log(this.name + ' is unlocked')
    }
}

module.exports = SmartLockDoor;