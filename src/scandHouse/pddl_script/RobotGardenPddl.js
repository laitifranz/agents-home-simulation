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

    class Move_gr extends Check {
        static parameters = ['obj','before','after'];
        static precondition = [ ['gardenrobot', 'obj'], ['field', 'before'], ['field', 'after'], ['adj', 'before', 'after'], ['in_field', 'obj', 'before'], ['cut', 'before']];
        static effect = [ ['in_field', 'obj', 'after'], ['not in_field', 'obj', 'before']];
        *exec ({obj, before, after}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.move(before, after);
            this.agent.beliefs.declare('in_field' + ' ' + obj + ' ' + after), this.agent.beliefs.undeclare('in_field' + ' ' + obj + ' ' + before);
        }
    }

    class SwitchOn_gr extends Check {
        static parameters = ['obj', 'status', 'status_temp'];
        static precondition = [ ['gardenrobot', 'obj'], ['switch_off', 'obj'], ['in_base', 'obj'], ['status_weather', 'status'], ['weather', 'status'], ['state', 'status_temp'], ['temperature', 'status_temp'] ];
        static effect = [ ['switch_on', 'obj']];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.turnOn();
            this.agent.beliefs.declare('switch_on' + ' ' + obj), this.agent.beliefs.undeclare('switch_off' + ' ' + obj);
        }
    }

    class SwitchOff_gr extends Check {
        static parameters = ['obj'];
        static precondition = [ ['gardenrobot', 'obj'], ['switch_on', 'obj'], ['in_base_finished', 'obj'] ];
        static effect = [ ['switch_off_finished', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.turnOff();
            this.agent.beliefs.declare('switch_off_finished' + ' ' + obj), this.agent.beliefs.undeclare('switch_on' + ' ' + obj);
        }
    }

    class CutGrass extends Check {
        static parameters = ['obj', 'place'];
        static precondition = [ ['gardenrobot', 'obj'], ['field', 'place'], ['in_field', 'obj', 'place'], ['not_cut', 'place'], ['not_in_base', 'obj'] ];
        static effect = [ ['cut', 'place'] ];
        *exec ({obj, place}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.cut(place);
            this.agent.beliefs.declare('cut' + ' ' + place), this.agent.beliefs.undeclare('not_cut' + ' ' + place);
        }
    }

    class CutAll extends Check {
        static parameters = ['obj', 'p1', 'p2', 'p3', 'p4'];
        static precondition = [ ['gardenrobot', 'obj'], ['field1', 'p1'], ['field2', 'p2'], ['field3', 'p3'], ['field4', 'p4'], ['cut', 'p1'], ['cut', 'p2'], ['cut', 'p3'], ['cut', 'p4'],['not_in_base', 'obj']];
        static effect = [ ['cut_all', 'obj'] ]; 
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.cutAll();
            this.agent.beliefs.declare('cut_all' + ' ' + obj)
        }
    }

    class ReturnToBase_gr extends Check {
        static parameters = ['obj', 'p1'];
        static precondition = [ ['gardenrobot', 'obj'], ['field1', 'p1'], ['in_field', 'obj', 'p1'], ['cut_all', 'obj']];
        static effect = [ ['in_base_finished', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.checkStatusBase(true);
            this.agent.beliefs.declare('in_base_finished' + ' ' + obj), this.agent.beliefs.undeclare('not_in_base' + ' ' + obj);
        }
    }

    class ExitFromBase_gr extends Check {
        static parameters = ['obj'];
        static precondition = [ ['gardenrobot', 'obj'], ['in_base', 'obj'], ['switch_on', 'obj'] ];
        static effect = [ ['not_in_base', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.checkStatusBase(false);
            this.agent.beliefs.declare('not_in_base' + ' ' + obj), this.agent.beliefs.undeclare('in_base' + ' ' + obj);
        }
    }

    class LastTask_gr extends Check {
        static parameters = ['obj'];
        static precondition = [ ['gardenrobot', 'obj'], ['cut_all', 'obj'], ['switch_off_finished', 'obj']];
        static effect = [ ['finish_cut', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.lastTask();
            this.agent.beliefs.declare('finish_cut' + ' ' + obj);
        }
    }


module.exports = {Move_gr, SwitchOn_gr, SwitchOff_gr, CutGrass, CutAll, ReturnToBase_gr, ExitFromBase_gr, LastTask_gr}

