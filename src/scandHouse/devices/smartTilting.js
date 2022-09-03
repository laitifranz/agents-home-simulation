const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Observable = require('../utils/Observable');

class SmartTilting extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house; 
        this.name = name; 
        this.set('status', 'close') 
    }
    openTilting () {
        this.status = 'open'
        console.log('The tilting is open')
    }
    closeTilting () {
        this.status = 'close'
        console.log('The tilting is close')
    }
}

class OpenCloseTiltingGoal extends Goal{
    constructor(smartTilting, state) {
      super(smartTilting, state);
  
      /** @type {smartTilting} smartTilting */
      this.smartTilting = smartTilting;
      /** @type {string} state */
      this.state = state;
    }
  }
  
  class OpenCloseTiltingIntention extends Intention{
    constructor(agent, goal) {
      super(agent, goal);
  
      /** @type {smartTilting} smartTilting */
      this.smartTilting = this.goal.smartTilting;
      /** @type {string} state */
      this.state = this.goal.state;
    }
  
    static applicable(goal) {
      return goal instanceof OpenCloseTiltingGoal;
    }
  
    *exec() {
        while(true){
          yield
          if ((this.smartTilting.status == 'close') && (this.state == 'open')){
            this.smartTilting.openTilting();
          }
          
          if((this.smartTilting.status == 'open') && (this.state == 'close')){
            this.smartTilting.closeTilting();
          }
          break;
        }
    }
  }

module.exports = {SmartTilting, OpenCloseTiltingGoal, OpenCloseTiltingIntention};