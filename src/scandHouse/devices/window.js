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
        console.log(this.name + ' is open')
    }
    closeWindow () {
        this.status = 'close'
        console.log(this.name + ' is close')
    }
}

module.exports = Window;