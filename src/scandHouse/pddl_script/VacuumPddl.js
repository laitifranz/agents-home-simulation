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
        static precondition = [ ['vacuum', 'obj'], ['room', 'before'], ['room', 'after'], ['adj', 'before', 'after'], ['in_room', 'obj', 'before'], ['cleaned', 'before']];
        static effect = [ ['in_room', 'obj', 'after'], ['not in_room', 'obj', 'before']];
        *exec ({obj, before, after}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.move(before, after);
            this.agent.beliefs.declare('in_room' + ' ' + obj + ' ' + after), this.agent.beliefs.undeclare('in_room' + ' ' + obj + ' ' + before);
        }
    }

    class SwitchOn extends Check {
        static parameters = ['obj'];
        static precondition = [ ['vacuum', 'obj'], ['switch_off', 'obj'], ['in_base', 'obj'] ];
        static effect = [ ['switch_on', 'obj']];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.turnOn();
            this.agent.beliefs.declare('switch_on' + ' ' + obj), this.agent.beliefs.undeclare('switch_off' + ' ' + obj);
        }
    }

    class SwitchOff extends Check {
        static parameters = ['obj'];
        static precondition = [ ['vacuum', 'obj'], ['switch_on', 'obj'], ['in_base_finished', 'obj'] ];
        static effect = [ ['switch_off_finished', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.turnOff();
            this.agent.beliefs.declare('switch_off_finished' + ' ' + obj), this.agent.beliefs.undeclare('switch_on' + ' ' + obj);
        }
    }

    class Clean extends Check {
        static parameters = ['obj', 'place'];
        static precondition = [ ['vacuum', 'obj'], ['room', 'place'], ['in_room', 'obj', 'place'], ['not_cleaned', 'place'], ['not_in_base', 'obj'] ];
        static effect = [ ['cleaned', 'place'] ];
        *exec ({obj, place}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.clean(place);
            this.agent.beliefs.declare('cleaned' + ' ' + place), this.agent.beliefs.undeclare('not_cleaned' + ' ' + place);
        }
    }

    class CleanAll extends Check {
        static parameters = ['obj', 'p1', 'p2', 'p3', 'p4'];
        static precondition = [ ['vacuum', 'obj'], ['room1', 'p1'], ['room2', 'p2'], ['room3', 'p3'], ['room4', 'p4'], ['cleaned', 'p1'], ['cleaned', 'p2'], ['cleaned', 'p3'], ['cleaned', 'p4'],['not_in_base', 'obj']]; //, ['every_room_clean', 'state'] , ['s', 'state'],
        static effect = [ ['clean_all', 'obj'] ]; 
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.cleanAll();
            this.agent.beliefs.declare('clean_all' + ' ' + obj)
        }
    }

    class ReturnToBase extends Check {
        static parameters = ['obj', 'p1'];
        static precondition = [ ['vacuum', 'obj'], ['room1', 'p1'], ['in_room', 'obj', 'p1'], ['clean_all', 'obj']];
        static effect = [ ['in_base_finished', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.checkStatusBase(true);
            this.agent.beliefs.declare('in_base_finished' + ' ' + obj), this.agent.beliefs.undeclare('not_in_base' + ' ' + obj);
        }
    }

    class ExitFromBase extends Check {
        static parameters = ['obj'];
        static precondition = [ ['vacuum', 'obj'], ['in_base', 'obj'], ['switch_on', 'obj'] ];
        static effect = [ ['not_in_base', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.checkStatusBase(false);
            this.agent.beliefs.declare('not_in_base' + ' ' + obj), this.agent.beliefs.undeclare('in_base' + ' ' + obj);
        }
    }

    class LastTask extends Check {
        static parameters = ['obj'];
        static precondition = [ ['vacuum', 'obj'], ['clean_all', 'obj'], ['switch_off_finished', 'obj']];
        static effect = [ ['finish_clean', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.lastTask();
            this.agent.beliefs.declare('finish_clean' + ' ' + obj);
        }
    }


module.exports = {Move, SwitchOn, SwitchOff, Clean, CleanAll, ReturnToBase, ExitFromBase, LastTask}

