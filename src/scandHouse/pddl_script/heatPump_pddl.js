const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')

    class Check extends pddlActionIntention{
        async checkPreconditionAndApplyEffect () {
            if ( this.checkPrecondition() ) {
                this.applyEffect()
                await new Promise(res=>setTimeout(res,1000))
            }
            else
                throw new Error('pddl precondition not valid'); //Promise is rejected!
        }
    }

    class SwitchOn_hp extends Check {
        static parameters = ['obj'];
        static precondition = [ ['heatpump', 'obj'], ['switch_off', 'obj'] ];
        static effect = [ ['switch_on', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect, this.agent.switchOnPump(obj);
            this.agent.beliefs.declare('switch_on' + ' ' + obj), this.agent.beliefs.undeclare('switch_off' + ' ' + obj);
        }
    }

    class SwitchOff_hp extends Check {
        static parameters = ['obj'];
        static precondition = [ ['heatpump', 'obj'], ['switch_on', 'obj'] ];
        static effect = [ ['switch_off', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect, this.agent.switchOffPump(obj);
            this.agent.beliefs.declare('switch_off' + ' ' + obj), this.agent.beliefs.undeclare('switch_on' + ' ' + obj);
        }
    }
   
    class setTemp_high extends Check {
        static parameters = ['obj', 'obj2', 'obj3', 'obj4'];
        static precondition = [ ['heatpump', 'obj'], ['solarpanel', 'obj2'], ['carcharger', 'obj3'], ['window', 'obj4'], ['awake', 'obj2'], ['notawake', 'obj3'], ['notopen', 'obj4'], ['switch_on', 'obj'] ];
        static effect = [ ['set_temp_high', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect, this.agent.turnHighTemp(obj);
            this.agent.beliefs.declare('set_temp_high' + ' ' + obj), this.agent.beliefs.undeclare('set_temp_high' + ' ' + obj);
        }
    }

    class setTemp_low extends Check {
        static parameters = ['obj', 'obj2', 'obj3', 'obj4'];
        static precondition = [ ['heatpump', 'obj'], ['set_temp_high', 'obj'] ];
        static effect = [ ['set_temp_low', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect, this.agent.returnLowTemp(obj);
            this.agent.beliefs.declare('set_temp_low' + ' ' + obj), this.agent.beliefs.undeclare('set_temp_high' + ' ' + obj);
        }
    }

    class RetryGoal_hp extends Goal {}
    class RetryFourTimesIntention_hp extends Intention {
        static applicable (goal) {
            return goal instanceof RetryGoal_hp
        }
        *exec ({goal}=parameters) {
            for(let i=0; i<4; i++) {
                let goalAchieved = yield this.agent.postSubGoal( goal )
                if (goalAchieved)
                    return;
                this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
                yield this.agent.beliefs.notifyAnyChange()
            }
        }
    }


module.exports = {SwitchOn_hp, SwitchOff_hp, setTemp_high, setTemp_low, RetryGoal_hp, RetryFourTimesIntention_hp}

