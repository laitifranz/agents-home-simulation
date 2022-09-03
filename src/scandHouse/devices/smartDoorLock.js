const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Observable = require('../utils/Observable');
const Clock = require('../utils/Clock');

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

class smartDoorLockGoal extends Goal {
    constructor(smartDoorLock) {
      super(smartDoorLock);
  
      /** @type {smartDoorLock} smartDoorLock */
      this.smartDoorLock = smartDoorLock;
    }
  }
  
  class smartDoorLockIntention extends Intention {
    constructor(agent, goal) {
      super(agent, goal);
  
      /** @type {smartDoorLock} smartDoorLock */
      this.smartDoorLock = this.goal.smartDoorLock;
    }
  
    static applicable(goal) {
      return goal instanceof smartDoorLockGoal;
    }
  
    *exec() {
          while(true){
            Clock.global.notifyChange('mm');
            yield
            if (Clock.global.hh == 22 && Clock.global.mm == 30) {
                this.smartDoorLock.lock();
                break;
            }
          }
      }
  }
  
  class smartDoorLockGoal_lock extends Goal {
    constructor(smartDoorLock, state) {
      super(smartDoorLock, state);
  
      /** @type {smartDoorLock} smartDoorLock */
      this.smartDoorLock = smartDoorLock;
        /** @type {string} state */
        this.state = state;
    }
  }
  
  class smartDoorLockIntention_lock extends Intention {
    constructor(agent, goal) {
      super(agent, goal);
  
      /** @type {smartDoorLock} smartDoorLock */
      this.smartDoorLock = this.goal.smartDoorLock;
      /** @type {string} state */
      this.state = this.goal.state;
    }
  
    static applicable(goal) {
      return goal instanceof smartDoorLockGoal_lock;
    }
  
    *exec() {
          while(true){
            if ((this.smartDoorLock.status == 'unlock') && (this.state == 'lock')){
              this.smartDoorLock.lock();
            }
            yield
          }
      }
  }

module.exports = {SmartLockDoor, smartDoorLockGoal, smartDoorLockIntention, smartDoorLockGoal_lock, smartDoorLockIntention_lock};