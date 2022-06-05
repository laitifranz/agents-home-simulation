const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {windowGoal, windowIntention} = require('./windows_intention');

class AlarmGoal extends Goal {
}

class AlarmIntention extends Intention {

    static applicable(goal) {
        return goal instanceof AlarmGoal
    }
    *exec(){
        while(true) {
            Clock.global.notifyChange('mm')
            yield
            if (Clock.global.hh == 5 && Clock.global.mm == 30) {
                console.log('ALARM, it\'s ' + Clock.global.hh + ' and ' + Clock.global.mm + '!')
                break;
            }
        }
    }
}



module.exports = {AlarmGoal, AlarmIntention}