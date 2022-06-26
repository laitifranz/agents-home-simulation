const smartDoorLock = require('../devices/SmartDoorLock');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');

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

module.exports = {smartDoorLockGoal, smartDoorLockIntention}