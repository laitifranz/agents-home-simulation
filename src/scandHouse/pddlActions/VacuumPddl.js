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

    class Move extends Check {
        static parameters = ['obj','before','after'];
        static precondition = [ ['vacuum', 'obj'], 
                                ['room', 'before'], 
                                ['room', 'after'], 
                                ['adj', 'before', 'after'], 
                                ['in_room', 'obj', 'before'], 
                                ['cleaned', 'before'], 
                                ['not_in_base', 'obj'], 
                                ['switch_on', 'obj'],];
        static effect = [ ['in_room', 'obj', 'after'], ['not in_room', 'obj', 'before']];
        *exec ({obj, before, after}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.move(before, after);
            this.agent.beliefs.declare('in_room' + ' ' + obj + ' ' + after), this.agent.beliefs.undeclare('in_room' + ' ' + obj + ' ' + before);
        }
    }

    class SwitchOn extends Check {
        static parameters = ['obj', 'p', 'sw', 'sg'];
        static precondition = [ ['vacuum', 'obj'], 
                                ['switch_off', 'obj'], 
                                ['in_base', 'obj'], 
                                ['base', 'p'], 
                                ['in_room', 'obj', 'p'],
                                ['state_water', 'sw'],
                                ['state_garbage', 'sg'],
                                ['water', 'sw'],
                                ['garbage', 'sg']];
        static effect = [ ['switch_on', 'obj']];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.turnOn();
            this.agent.beliefs.declare('switch_on' + ' ' + obj), this.agent.beliefs.undeclare('switch_off' + ' ' + obj);
        }
    }

    class SwitchOff extends Check {
        static parameters = ['obj', 'p'];
        static precondition = [ ['vacuum', 'obj'], 
                                ['switch_on', 'obj'], 
                                ['in_base', 'obj'], 
                                ['base', 'p'], 
                                ['in_room', 'obj', 'p']];
        static effect = [ ['switch_off', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.turnOff();
            this.agent.beliefs.declare('switch_off' + ' ' + obj), this.agent.beliefs.undeclare('switch_on' + ' ' + obj);
        }
    }

    class Clean extends Check {
        static parameters = ['obj', 'place'];
        static precondition = [ ['vacuum', 'obj'], 
                                ['room', 'place'], 
                                ['in_room', 'obj', 'place'], 
                                ['not_cleaned', 'place'], 
                                ['not_in_base', 'obj'],
                                ['switch_on', 'obj'] ];
        static effect = [ ['cleaned', 'place'] ];
        *exec ({obj, place}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.clean(place);
            this.agent.beliefs.declare('cleaned' + ' ' + place), this.agent.beliefs.undeclare('not_cleaned' + ' ' + place);
        }
    }

    class ReturnToBase extends Check {
        static parameters = ['obj', 'p'];
        static precondition = [ ['vacuum', 'obj'], 
                                ['base', 'p'], 
                                ['switch_on', 'obj'], 
                                ['not_in_base', 'obj'], 
                                ['in_room', 'obj', 'p']];
        static effect = [ ['in_base', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.checkStatusBase(true);
            this.agent.beliefs.declare('in_base' + ' ' + obj), this.agent.beliefs.undeclare('not_in_base' + ' ' + obj);
        }
    }

    class ExitFromBase extends Check {
        static parameters = ['obj', 'p'];
        static precondition = [ ['vacuum', 'obj'], 
                                ['in_base', 'obj'], 
                                ['switch_on', 'obj'],
                                ['base', 'p'],
                                ['in_room', 'obj', 'p'], ];
        static effect = [ ['not_in_base', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.checkStatusBase(false);
            this.agent.beliefs.declare('not_in_base' + ' ' + obj), this.agent.beliefs.undeclare('in_base' + ' ' + obj);
        }
    }
    
module.exports = {Move, SwitchOn, SwitchOff, Clean, ReturnToBase, ExitFromBase}

