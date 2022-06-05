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

    class Move extends Check {
        static parameters = ['obj','before','after'];
        static precondition = [ ['vacuum', 'obj'], ['room', 'before'], ['room', 'after'], ['adj', 'before', 'after'], ['in_room', 'obj', 'before'], ['adj', 'after', 'before'], ['switch_on', 'obj'] ];
        static effect = [ ['in_room', 'obj', 'after'], ['not in_room', 'obj', 'before']];
        *exec ({obj, before, after}=parameters) {
            yield this.checkPreconditionAndApplyEffect, this.agent.move(obj, before, after);
            this.agent.beliefs.declare('in_room' + ' ' + obj + ' ' + after), this.agent.beliefs.undeclare('in_room' + ' ' + obj + ' ' + before);
        }
    }

    class SwitchOn extends Check {
        static parameters = ['obj'];
        static precondition = [ ['vacuum', 'obj'], ['switch_off', 'obj'] ];
        static effect = [ ['switch_on', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect, this.agent.turnOn(obj);
            this.agent.beliefs.declare('switch_on' + ' ' + obj), this.agent.beliefs.undeclare('switch_off' + ' ' + obj);
        }
    }

    class SwitchOff extends Check {
        static parameters = ['obj'];
        static precondition = [ ['vacuum', 'obj'], ['switch_on', 'obj'] ];
        static effect = [ ['switch_off', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect, this.agent.turnOff(obj);
            this.agent.beliefs.declare('switch_off' + ' ' + obj), this.agent.beliefs.undeclare('switch_on' + ' ' + obj);
        }
    }

    class RetryGoal_vc extends Goal {}
    class RetryFourTimesIntention_vc extends Intention {
        static applicable (goal) {
            return goal instanceof RetryGoal_vc
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


module.exports = {Move, SwitchOn, SwitchOff, RetryGoal_vc, RetryFourTimesIntention_vc}

