const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Observable = require('../utils/Observable');

class DeicingSystem extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.status = 'off' 
    }
    switchOnSystem () {
        if (this.status != 'on'){
            this.house.utilities.electricity.consumption += 2000;
            this.status = 'on'
            console.log('Deicing system ON')
        }
        else
            console.log('Deicing system is already ON')
    }
    switchOffSystem () {
        if (this.status != 'off'){
            this.status = 'off'
            console.log('Deicing system OFF')
        }
        else
            console.log('Deicing system is already OFF')
    }
}

class DeicingSystemGoal extends Goal{
    constructor(deicingSystem, house) {
        super(deicingSystem);
    
        /** @type {deicingSystem} deicingSystem */
        this.deicingSystem = deicingSystem;
        /** @type {myHouse} house */
        this.house = house;
      }
}
class DeicingSystemIntention extends Intention{
    constructor(agent, goal) {
        super(agent, goal);
    
        /** @type {deicingSystem} deicingSystem */
        this.deicingSystem = this.goal.deicingSystem;
        /** @type {myHouse} house */
        this.house = this.goal.house;
      }

    static applicable(goal) {
        return goal instanceof DeicingSystemGoal;
    }

    *exec() {
        let deicingSystemGoals = [];
        let deicingSystemPromise = new Promise(( async res => {
            while(true){
                let temp = await this.house.devices.meteo_sensor.notifyAnyChange();
                if(!isNaN(temp) && temp < 0)
                    this.deicingSystem.switchOnSystem()
            }
        }));
        deicingSystemGoals.push(deicingSystemPromise);
        yield Promise.all(deicingSystemGoals)
        }
}

module.exports = {DeicingSystem, DeicingSystemGoal, DeicingSystemIntention};