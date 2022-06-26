const Agent = require('../bdi/Agent');

class VacuumCleaner extends Agent {
    constructor (house, name) {
        super(house, name); 
        this.house = house; 
        this.name = name;

        this.status = 'turn_off'
        this.battery = 100
        this.water = 2
        this.garbage = 0
        this.isCleaning = false
        this.isFullGarbage = false
        this.hasWater = true
        this.inBase = true
        this.returningToBase = false
        this.counterRoom = 0
    }

    turnOff () {
        if (this.status != 'turn_off'){
            if (this.water <= 0)
                this.hasWater = false
            if (this.garbage >= 100)
                this.isFullGarbage = true
            this.status = 'turn_off'
            this.isCleaning = false
            this.inBase = true
            this.returningToBase = false
            this.counterRoom = 0

            console.log(this.name + ' turned off')
        }
    }
    turnOn () {
        if (this.status != 'turn_on'){
            this.house.utilities.electricity.consumption += 150;
            this.status = 'turn_on'
            this.battery = 100
            console.log(this.name + ' turned on')
        } 
    }
    move (before, after) {
        this.status = 'move'
        this.isCleaning = false
        console.log('Moving ' + this.name + ' from ' + before + ' to ' + after)
    }
    clean (room){
        if (this.water <= 0)
                this.hasWater = false, console.log('ALERT: ' + this.name  + ' has no water')
        if (this.battery <= 20)
                console.log('ALERT: ' + this.name + ' has low battery!')
        if (this.garbage >= 100)
                this.isFullGarbage = true, console.log(this.name + ' has full garbage')

        this.battery -= 12
        this.water -= 0.2
        this.garbage += 15
        this.counterRoom += 1
        this.isCleaning = true

        console.log(this.name + ' has cleaned the ' + room)
    }

    cleanAll(){
        console.log(this.name + ' has cleaned all the room, for a total of ' + this.counterRoom + ' rooms. Returning to base')
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
        console.log('\t' + 'Water  : ' + this.water + ' L')
        console.log('\t' + 'Garbage: ' + this.garbage + ' %')
        this.turnOff()
    }
    resetVacuum(){
        this.hasWater = true
        this.water = 2
        this.house.utilities.water.consumption += this.water

        this.isFullGarbage = false
        this.garbage = 0

        console.log(this.name + ' has been reset. Garbage is empty and water is full')

        this.turnOff()
    }
}

module.exports = VacuumCleaner;