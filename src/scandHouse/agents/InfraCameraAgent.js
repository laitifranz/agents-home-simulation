const Agent = require('../bdi/Agent');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {smartDoorLockGoal, smartDoorLockIntention, smartDoorLockGoal_lock, smartDoorLockIntention_lock} = require('../devices/SmartDoorLock');
const Observable = require('../utils/Observable');

class InfraCameraAgent extends Agent {
    constructor (name, infraredCamera, house) {
        super(name);
        this.infraredCamera = infraredCamera;
        this.house = house;
        this.movement = new Observable();
        this.movement.set('state', 'no_move_detect')
    }
}

class infraredCameraGoal extends Goal {}
class infraredCameraIntention extends Intention {

  static applicable(goal) {
    return goal instanceof infraredCameraGoal;
  }

  *exec() {
    var infraredCameraGoals = [];
    let infraredCameraPromise = new Promise(( async res => {
        while(true){
            let status = await this.agent.infraredCamera.notifyChange('status')
            this.log('status ' + this.agent.infraredCamera.name + ': ' + status + '\n');
            this.agent.movement.set('state', status)
        }
    }));

    infraredCameraGoals.push(infraredCameraPromise);
    yield Promise.all(infraredCameraGoals)
    }
}

class LockDoorGoal extends Goal{}
class LockDoorIntention extends Intention{
    static applicable(goal) {
        return goal instanceof LockDoorGoal;
    }

    *exec() {
        var infraredCameraGoals = [];
        let infraredCameraPromise = new Promise(( async res => {
            while(true){
                let deviceStatus = await this.agent.movement.notifyChange('state')
                if ((deviceStatus == 'move_detect')){
                    MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new smartDoorLockGoal_lock(this.agent.house.devices.garage_door_lock, 'lock'));
                }
            }
        }));
    
        infraredCameraGoals.push(infraredCameraPromise);
        yield Promise.all(infraredCameraGoals)
        }
    }

module.exports = {InfraCameraAgent, infraredCameraGoal, infraredCameraIntention, LockDoorGoal, LockDoorIntention};