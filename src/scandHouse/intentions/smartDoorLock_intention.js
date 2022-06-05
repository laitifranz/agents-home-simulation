const smartDoorLock = require('../devices/smartDoorLock');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {LightGoal, LightIntention} = require('../intentions/light_intention')

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
    var smartDoorLockGoals = [];
    let smartDoorLockPromise = new Promise(( async res => {
        while(true){
            let status = await this.smartDoorLock.notifyChange('status')
            this.agent.beliefs.declare('lock', status=='lock')
            this.agent.beliefs.declare('unlock', status=='unlock')
            this.log('status ' + this.smartDoorLock.name + ': ' + status + '\n');
            this.agent.postSubGoal(new LightGoal(this.agent.house.devices.entrance_light))
        }
    }));

    smartDoorLockGoals.push(smartDoorLockPromise);
    yield Promise.all(smartDoorLockGoals)
    }
}

module.exports = {smartDoorLockGoal, smartDoorLockIntention}