const smartDoorLock = require('../devices/SmartDoorLock');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');

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

module.exports = {smartDoorLockGoal_lock, smartDoorLockIntention_lock}