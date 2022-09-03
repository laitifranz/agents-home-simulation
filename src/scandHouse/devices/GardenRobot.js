const Observable = require('../utils/Observable');

class GardenRobot extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house; 
        this.name = name;

        this.status = 'turn_off'
        this.battery = 100
        this.isCutting = false
        this.inBase = true
        this.returningToBase = false
        this.set('tiltingToBeOpen', false)
    }

    turnOff () {
        if (this.status != 'turn_off'){
            this.status = 'turn_off'
            this.isCuting = false
            this.inBase = true
            this.returningToBase = false

            console.log(this.name + ' turned off')

            this.lastTask()
        }
    }
    turnOn () {
        if (this.status != 'turn_on'){
            this.house.utilities.electricity.consumption += 180;
            this.status = 'turn_on'
            this.battery = 100
            this.tiltingToBeOpen = true
            console.log(this.name + ' turned on')
        } 
    }
    move (before, after) {
        this.status = 'move'
        this.isCutting = false
        console.log('Moving ' + this.name + ' from ' + before + ' to ' + after + ' field')
    }
    cut (field){
        if (this.battery <= 20)
                console.log('ALERT: ' + this.name + ' has low battery!')
        this.battery -= 18
        this.isCutting = true
        console.log(this.name + ' has cut the ' + field + ' field')
    }

    checkStatusBase(state){
        if(state == true){
            this.returningToBase = true
            console.log(this.name + ' has returned to the base')
        }
        else{
            this.inBase = false
            this.returningToBase = false
            console.log(this.name + ' is out of base')
        }
    }
    lastTask() {
        console.log(this.name + ' has finished the task')
        console.log('\tINFOS')
        console.log('\t' + 'Battery: ' + this.battery + ' %')
        this.tiltingToBeOpen = false;
    }
}

module.exports = GardenRobot;