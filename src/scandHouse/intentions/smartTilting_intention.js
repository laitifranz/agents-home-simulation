const smartTilting = require('../devices/SmartTilting');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');


class smartTiltingGoal extends Goal {
  constructor(smartTilting, house) {
    super(smartTilting);

    /** @type {smartTilting} smartTilting */
    this.smartTilting = smartTilting;
    /** @type {myHouse} house */
    this.house = house;
  }
}

class smartTiltingIntention extends Intention {
  constructor(agent, goal) {
    super(agent, goal);

    /** @type {smartTilting} smartTilting */
    this.smartTilting = this.goal.smartTilting;
    /** @type {myHouse} house */
    this.house = this.goal.house;
  }

  static applicable(goal) {
    return goal instanceof smartTiltingGoal;
  }

  *exec() {
    var check = false //for avoiding multiple execution of the same if-else statement
    while(true) {
      Clock.global.notifyChange('mm');
      if (Clock.global.hh == 7 && Clock.global.mm == 0 && !check) {
          check = true
          this.smartTilting.openTilting();
      }
      yield
      if (Clock.global.hh == 9 && Clock.global.mm == 0 && check){
        check = false
        this.smartTilting.closeTilting();
      }
  }
}
}

module.exports = {smartTiltingGoal, smartTiltingIntention}