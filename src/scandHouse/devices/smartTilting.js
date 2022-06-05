const Observable = require('../utils/Observable');

class SmartTilting extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house; 
        this.name = name; 
        this.set('status', 'close') 
    }
    openTilting (l) {
        this.status = 'open'
        console.log('The tilting is open')
    }
    closeTilting (l) {
        this.status = 'close'
        console.log('The tilting is close')
    }
}

module.exports = SmartTilting;