const pddlActionIntention = require('../pddl/actions/pddlActionIntention')

    class Check extends pddlActionIntention{
        async checkPreconditionAndApplyEffect () {
            if ( this.checkPrecondition() ) {
                this.applyEffect()
                await new Promise(res=>setTimeout(res,100))
            }
            else
                throw new Error('pddl precondition not valid');
        }
    }

    class TurnOn extends Check {
        static parameters = ['obj', 'status'];
        static precondition = [ ['deicing', 'obj'], ['off', 'obj'], ['state', 'status'], ['temperature', 'status']];
        static effect = [ ['on', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.switchOnSystem();
            this.agent.beliefs.declare('on' + ' ' + obj), this.agent.beliefs.undeclare('off' + ' ' + obj);
        }
    }

    class TurnOff extends Check {
        static parameters = ['obj'];
        static precondition = [ ['deicing', 'obj'], ['on', 'obj']];
        static effect = [ ['off', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.switchOffSystem();
            this.agent.beliefs.declare('off' + ' ' + obj), this.agent.beliefs.undeclare('on' + ' ' + obj);
        }
    }


module.exports = {TurnOn, TurnOff}

