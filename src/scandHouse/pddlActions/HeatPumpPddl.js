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

    class SwitchOn_hp extends Check {
        static parameters = ['obj'];
        static precondition = [ ['heatpump', 'obj'], ['switch_off', 'obj'] ];
        static effect = [ ['switch_on', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.turnOn();
            this.agent.beliefs.declare('switch_on' + ' ' + obj), this.agent.beliefs.undeclare('switch_off' + ' ' + obj);
        }
    }

    class SwitchOff_hp extends Check {
        static parameters = ['obj'];
        static precondition = [ ['heatpump', 'obj'], ['switch_on', 'obj'] ];
        static effect = [ ['switch_off', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.turnOff();
            this.agent.beliefs.declare('switch_off' + ' ' + obj), this.agent.beliefs.undeclare('switch_on' + ' ' + obj);
        }
    }
   
    class setTempHigh extends Check {
        static parameters = ['obj', 'obj2', 'obj3', 'obj4'];
        static precondition = [ ['heatpump', 'obj'], 
                                ['solarpanel', 'obj2'], 
                                ['carcharger', 'obj3'], 
                                ['window', 'obj4'], 
                                ['awake', 'obj2'], 
                                ['notawake', 'obj3'], 
                                ['notopen', 'obj4'], 
                                ['switch_on', 'obj'], 
                                ['temp_low', 'obj'] ];
        static effect = [ ['temp_high', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.highTemp();
            this.agent.beliefs.declare('temp_high' + ' ' + obj), this.agent.beliefs.undeclare('temp_low' + ' ' + obj);
        }
    }

    class setTempLow extends Check {
        static parameters = ['obj'];
        static precondition = [ ['heatpump', 'obj'], ['switch_on', 'obj'] ];
        static effect = [ ['temp_low', 'obj'] ];
        *exec ({obj}=parameters) {
            yield this.checkPreconditionAndApplyEffect(), this.agent.device.lowTemp();
            this.agent.beliefs.declare('temp_low' + ' ' + obj), this.agent.beliefs.undeclare('temp_high' + ' ' + obj);
        }
    }


module.exports = {SwitchOn_hp, SwitchOff_hp, setTempHigh, setTempLow}

