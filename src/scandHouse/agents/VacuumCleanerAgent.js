const Agent = require('../bdi/Agent');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const { RetryGoal } = require('../utils/RetryGoal');
const PlanningGoal = require('../pddl/PlanningGoal')

class VacuumCleanerAgent extends Agent {
    constructor (name, vacuumCleanerDevice) {
        super(name);
        this.device = vacuumCleanerDevice;
    }
}

class VacuumCleanerGoal extends Goal{}
class VacuumCleanerIntention extends Intention{
    static applicable(goal) {
        return goal instanceof VacuumCleanerGoal;
    }
    *exec({goal_finish_clean, nameDevice}) {
        //console.log(goal_finish_clean)
        let goalSuccess = yield this.agent.postSubGoal(new RetryGoal( { goal: new PlanningGoal( { goal: goal_finish_clean } ) } ) );
        if(goalSuccess)
            goalSuccess = yield this.agent.postSubGoal(new RetryGoal( { goal: new PlanningGoal( { goal: ['switch_off ' + nameDevice] } ) } ) );
        else
            this.log("Goal " + goal_finish_clean + " not achieved, switch off is impossible!")
    }
}

class SensorVacuumCleanerGoal extends Goal{}
class SensorVacuumCleanerIntention extends Intention{
    static applicable(goal) {
        return goal instanceof SensorVacuumCleanerGoal;
    }
    *exec() {
        let vacuumCleanerGoals = [];
        let vacuumCleanerPromis_garbage = new Promise(( async res => {
            while(true){
                let status = await this.agent.device.notifyChange('isFullGarbage');
                if(status){
                    this.agent.beliefs.undeclare('garbage empty')
                }
                else{
                    this.agent.beliefs.declare('garbage empty')
                }
            }
        }));
        let vacuumCleanerPromis_water = new Promise(( async res => {
            while(true){
                let status = await this.agent.device.notifyChange('hasWater');
                if(status){
                    this.agent.beliefs.declare('water full')
                }
                else{
                    this.agent.beliefs.undeclare('water full')
                }
            }
        }));

        vacuumCleanerGoals.push(vacuumCleanerPromis_garbage);
        vacuumCleanerGoals.push(vacuumCleanerPromis_water);
        yield Promise.all(vacuumCleanerGoals)
        }
}

module.exports = {VacuumCleanerAgent, VacuumCleanerGoal, VacuumCleanerIntention, SensorVacuumCleanerGoal, SensorVacuumCleanerIntention};