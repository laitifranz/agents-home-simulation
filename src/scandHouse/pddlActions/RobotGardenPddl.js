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
        static precondition = [ ['gardenrobot', 'obj'], 
                                ['field', 'before'], 
                                ['field', 'after'], 
                                ['adj', 'before', 'after'], 
                                ['in_field', 'obj', 'before'], 
                                ['cut', 'before'],
                                ['not_in_base', 'obj'],
                                ['switch_on', 'obj']];
        static effect = [ ['in_field', 'obj', 'after'], ['not in_field', 'obj', 'before']];
        *exec ({obj, before, after}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.move(before, after);
            this.agent.beliefs.declare('in_field' + ' ' + obj + ' ' + after), this.agent.beliefs.undeclare('in_field' + ' ' + obj + ' ' + before);
        }
    }

    class SwitchOn_gr extends Check {
        static parameters = ['obj', 'status', 'status_temp', 'p'];
        static precondition = [ ['gardenrobot', 'obj'], 
                                ['switch_off', 'obj'], 
                                ['in_base', 'obj'], 
                                ['base', 'p'],
                                ['in_field', 'obj', 'p'], 
                                ['weather', 'status'], 
                                ['temperature', 'status_temp'] ];
        static effect = [ ['switch_on', 'obj']];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.turnOn();
            this.agent.beliefs.declare('switch_on' + ' ' + obj), this.agent.beliefs.undeclare('switch_off' + ' ' + obj);
        }
    }

    class SwitchOff_gr extends Check {
        static parameters = ['obj', 'p'];
        static precondition = [ ['gardenrobot', 'obj'], 
                                ['switch_on', 'obj'],
                                ['base', 'p'], 
                                ['in_field', 'obj', 'p'],
                                ['in_base', 'obj'] ];
        static effect = [ ['switch_off', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.turnOff();
            this.agent.beliefs.declare('switch_off' + ' ' + obj), this.agent.beliefs.undeclare('switch_on' + ' ' + obj);
        }
    }

    class CutGrass extends Check {
        static parameters = ['obj', 'place'];
        static precondition = [ ['gardenrobot', 'obj'], 
                                ['field', 'place'], 
                                ['in_field', 'obj', 'place'], 
                                ['not_cut', 'place'], 
                                ['switch_on', 'obj'],
                                ['not_in_base', 'obj'] ];
        static effect = [ ['cut', 'place'] ];
        *exec ({obj, place}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.cut(place);
            this.agent.beliefs.declare('cut' + ' ' + place), this.agent.beliefs.undeclare('not_cut' + ' ' + place);
        }
    }

    class ReturnToBase_gr extends Check {
        static parameters = ['obj', 'p'];
        static precondition = [ ['gardenrobot', 'obj'], 
                                ['base', 'p'], 
                                ['in_field', 'obj', 'p'], 
                                ['switch_on', 'obj'],
                                ['not_in_base', 'obj']];
        static effect = [ ['in_base', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.checkStatusBase(true);
            this.agent.beliefs.declare('in_base' + ' ' + obj), this.agent.beliefs.undeclare('not_in_base' + ' ' + obj);
        }
    }

    class ExitFromBase_gr extends Check {
        static parameters = ['obj', 'p', 'st'];
        static precondition = [ ['gardenrobot', 'obj'], 
                                ['in_base', 'obj'], 
                                ['base', 'p'],
                                ['in_field', 'obj', 'p'],
                                ['switch_on', 'obj'],
                                ['state_tilting', 'st'],
                                ['tilting', 'st'] ];
        static effect = [ ['not_in_base', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.checkStatusBase(false);
            this.agent.beliefs.declare('not_in_base' + ' ' + obj), this.agent.beliefs.undeclare('in_base' + ' ' + obj);
        }
    }


module.exports = {Move_gr, SwitchOn_gr, SwitchOff_gr, CutGrass, ReturnToBase_gr, ExitFromBase_gr}

