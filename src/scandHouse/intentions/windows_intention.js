const window = require('../devices/Window');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const myHouse = require('../house/House');

class windowGoal extends Goal {
  constructor(window, house, state) {
    super(window, house, state);

    /** @type {window} window */
    this.window = window;
    /** @type {myHouse} house */
    this.house = house;
    /** @type {string} state */
    this.state = state;
  }
}

class windowIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {window} window */
    this.window = this.goal.window;
    /** @type {myHouse} house */
    this.house = this.goal.house;
    /** @type {string} state */
    this.state = this.goal.state;
  }

  static applicable(goal) {
    return goal instanceof windowGoal;
  }

  *exec() {
    while(true){
      if ((this.window.status == 'close') && (this.state == 'open')){
        this.window.openWindow();
      }
      yield
      if((this.window.status == 'open') && (this.state == 'close')){
        this.window.closeWindow();
      }
      }
    }
}

module.exports = {windowGoal, windowIntention}