const Agent = require('../bdi/Agent');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {windowGoal, windowIntention} = require('../devices/Window');
const Observable = require('../utils/Observable');

class SmartAirAgent extends Agent {
    constructor (name, smartAir, house) {
        super(name);
        this.smartAir = smartAir;
        this.house = house;
        this.dirtyAir = new Observable();
        this.dirtyAir.set('state', 'turn_off')
    }
}

class smartAirPurifierGoal extends Goal {}
class smartAirPurifierIntention extends Intention {
  
    static applicable(goal) {
      return goal instanceof smartAirPurifierGoal;
    }
  
    *exec() {
      var smartAirPurifierGoals = [];
      let smartAirPurifierPromise = new Promise(( async res => {
          while(true){
              let status = await this.agent.smartAir.notifyChange('status')
              this.log('status ' + this.agent.smartAir.name + ': ' + status + '\n');
              this.agent.dirtyAir.set('state', status)
              //console.log('### ', this.agent.dirtyAir.state)
          }
      }));
  
      smartAirPurifierGoals.push(smartAirPurifierPromise);
      yield Promise.all(smartAirPurifierGoals)
      }
  }
  
  class OpenWindowGoal extends Goal{}
  class OpenWindowIntention extends Intention{
      static applicable(goal) { 
          return goal instanceof OpenWindowGoal;
      }
      *exec() {
        var smartAirPurifierGoals = [];
        let smartAirPurifierPromise = new Promise(( async res => {
            while(true){
                let deviceStatus = await this.agent.dirtyAir.notifyChange('state')
                if (deviceStatus == 'dirty_air'){
                  MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new windowGoal(this.agent.house.devices.kitchen_windows, this.agent.house, 'open'));
              }
            }
        }));
    
        smartAirPurifierGoals.push(smartAirPurifierPromise);
        yield Promise.all(smartAirPurifierGoals)
        }
    }

module.exports = {SmartAirAgent, smartAirPurifierGoal, smartAirPurifierIntention, OpenWindowGoal, OpenWindowIntention};