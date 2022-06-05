const window = require('../devices/window');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const myHouse = require('../house/house');
const MessageDispatcher = require('../utils/messagedispatcher');

class windowGoal extends Goal {
  constructor(window, house) {
    super(window, house);

    /** @type {window} window */
    this.window = window;
    /** @type {myHouse} house */
    this.house = house;
  }
}

class windowIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {window} window */
    this.window = this.goal.window;
    /** @type {myHouse} house */
    this.house = this.goal.house;
  }

  static applicable(goal) {
    return goal instanceof windowGoal;
  }

  *exec() {
    while(true){
      var windowsGoals = [];
      let windowsPromise = new Promise(( async res => {
        this.window.openWindow()
        let status = await this.window.notifyChange('status')
        this.agent.beliefs.declare('window_open', status=='open')
        this.agent.beliefs.declare('window_close', status=='close')
      }));
    windowsGoals.push(windowsPromise);
    yield Promise.all(windowsGoals)
      }
    }
}

module.exports = {windowGoal, windowIntention}