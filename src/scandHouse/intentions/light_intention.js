const Light = require('../devices/light');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');

class LightGoal extends Goal {
  constructor(Light) {
    super(Light);

    /** @type {Light} Light */
    this.Light = Light;
  }
}

class LightIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {Light} Light */
    this.Light = this.goal.Light;
  }

  static applicable(goal) {
    return goal instanceof LightGoal;
  }

  *exec() {
    var LightGoals = [];
    let LightPromise = new Promise(( async res => {
        while(true){
            let status = await this.Light.notifyChange('status')
            this.agent.beliefs.declare('light_off', status=='turn_on')
            this.agent.beliefs.declare('light_on', status=='turn_off')
            this.log('status ' + this.Light.name + ': ' + status + '\n');
        }
    }));

    LightGoals.push(LightPromise);
    yield Promise.all(LightGoals)
    }
}

module.exports = {LightGoal, LightIntention}