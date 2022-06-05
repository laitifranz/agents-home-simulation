const infraredCamera = require('../devices/infraredCamera');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
//const {windowGoal, windowIntention} = require('./windows_intention');
const {smartTiltingGoal, smartTiltingIntention} = require('./smartTilting_intention');
const house = require('../house/house');
const Clock = require('../utils/clock');

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
            this.agent.beliefs.declare('movement_detected', status=='movement_detected')
            if ((status == 'movement_detected')){
                MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new smartTiltingGoal(this.house.devices.garage_tilting, this.house));
            }
        }
    }));

    infraredCameraGoals.push(infraredCameraPromise);
    yield Promise.all(infraredCameraGoals)
    }
}

module.exports = {infraredCameraGoal, infraredCameraIntention}