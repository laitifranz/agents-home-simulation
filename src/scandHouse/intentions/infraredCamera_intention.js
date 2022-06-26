const infraredCamera = require('../devices/InfraredCamera');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const { smartDoorLockGoal_lock } = require('./smartDoorLock_intention_lock');

class infraredCameraGoal extends Goal {
  constructor(infraredCamera, house) {
    super(infraredCamera);

    /** @type {infraredCamera} infraredCamera */
    this.infraredCamera = infraredCamera;
    /** @type {myHouse} house */
    this.house = house;
  }
}

class infraredCameraIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {infraredCamera} infraredCamera */
    this.infraredCamera = this.goal.infraredCamera;
    /** @type {myHouse} house */
    this.house = this.goal.house;
  }

  static applicable(goal) {
    return goal instanceof infraredCameraGoal;
  }

  *exec() {
    var infraredCameraGoals = [];
    let infraredCameraPromise = new Promise(( async res => {
        while(true){
            let status = await this.infraredCamera.notifyChange('status')
            this.log('status ' + this.infraredCamera.name + ': ' + status + '\n');
            if ((status == 'move_detect')){
                MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new smartDoorLockGoal_lock(this.house.devices.garage_door_lock, 'lock'));
            }
        }
    }));

    infraredCameraGoals.push(infraredCameraPromise);
    yield Promise.all(infraredCameraGoals)
    }
}

module.exports = {infraredCameraGoal, infraredCameraIntention}