const Agent = require('../bdi/Agent');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const {OpenCloseTiltingGoal, OpenCloseTiltingIntention} = require('../devices/SmartTilting');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const Observable = require('../utils/Observable');
const { RetryGoal } = require('../utils/RetryGoal');
const PlanningGoal = require('../pddl/PlanningGoal')

class GardenRobotAgent extends Agent {
    constructor (name, gardenRobotDevice, meteoSensorDevice, tiltingDevice, house) {
        super(name);
        this.device = gardenRobotDevice;
        this.meteoSensorDevice = meteoSensorDevice;
        this.tiltingDevice = tiltingDevice;
        this.house = house;

        this.tiltingStatus = new Observable();
        this.tiltingStatus.set('tilting', false)
    }
}


class SensorGardenRobotGoal extends Goal{}
class SensorGardenRobotIntention extends Intention{ //Sensors
    static applicable(goal) {
        return goal instanceof SensorGardenRobotGoal;
    }

    changeTemp(temperature) {
        if(temperature > 0) {
            this.agent.beliefs.declare('temperature over_zero')
        }
        else
            this.agent.beliefs.undeclare('temperature over_zero')    
    }
    changeForecast(forecast) {
        if(forecast == 'sunny') {
            this.agent.beliefs.declare('weather good')
        }
        else if (forecast == 'cloudy'){
            this.agent.beliefs.declare('weather good')
        }
        else if (forecast == 'rainy'){
            this.agent.beliefs.undeclare('weather good')
        }
        else if (forecast == 'night'){
            this.agent.beliefs.undeclare('weather good')
        }
        else{
            this.agent.beliefs.undeclare('weather good')
        }
    }
    tiltingStatus(status){
        if(status == 'open')
            this.agent.beliefs.declare('tilting open')
        else
            this.agent.beliefs.undeclare('tilting open')
        
    }

    *exec() {
        let gardenRobotGoals = [];
        let gardenRobotPromis_temp = new Promise(( async res => {
            while(true){
                let status = await this.agent.meteoSensorDevice.notifyChange('temperature');
                this.changeTemp(status)
            }
        }));
        let gardenRobotPromis_forecast = new Promise(( async res => {
            while(true){
                let status = await this.agent.meteoSensorDevice.notifyChange('forecast_today');
                this.changeForecast(status)
            }
        }));
        let gardenRobotPromise_tilting = new Promise(( async res => {
            while(true){
                let waitTiltingChanges = await this.agent.tiltingDevice.notifyChange('status');
                this.tiltingStatus(waitTiltingChanges)
            }
        }));
        let gardenRobotPromise_tilting_request = new Promise(( async res => {
            while(true){
                let status = await this.agent.device.notifyChange('tiltingToBeOpen');
                this.agent.tiltingStatus.set('tilting', status)
            }
        }));

        gardenRobotGoals.push(gardenRobotPromis_temp);
        gardenRobotGoals.push(gardenRobotPromis_forecast);
        gardenRobotGoals.push(gardenRobotPromise_tilting);
        gardenRobotGoals.push(gardenRobotPromise_tilting_request);
        yield Promise.all(gardenRobotGoals)
    }
}

class ManageTiltingGoal extends Goal{}
class ManageTiltingIntention extends Intention{
    static applicable(goal) {
        return goal instanceof ManageTiltingGoal;
    }

    *exec() {
    let gardenRobotGoals = [];
    let gardenRobotPromise = new Promise(( async res => {
        while(true){
            let tiltingState = await this.agent.tiltingStatus.notifyChange('tilting');
            if(tiltingState)
                MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new OpenCloseTiltingGoal(this.agent.tiltingDevice, 'open'));
            else
                MessageDispatcher.authenticate(this.agent).sendTo('houseAgent', new OpenCloseTiltingGoal(this.agent.tiltingDevice, 'close'));

            // need this because when using the Postman one time, it has to be recall to use it again
            this.agent.house.intentions.push(PostmanAcceptAllRequest)
            this.agent.house.postSubGoal(new Postman())
        }
    }));
    gardenRobotGoals.push(gardenRobotPromise);
    yield Promise.all(gardenRobotGoals)
    }
}

class GardenRobotGoal extends Goal{}
class GardenRobotIntention extends Intention{
    static applicable(goal) {
        return goal instanceof GardenRobotGoal;
    }
    *exec({goal_finish_cut, nameDevice}) {
        let goalSuccess = yield this.agent.postSubGoal(new RetryGoal( { goal: new PlanningGoal( { goal: ['switch_on ' + nameDevice] } ) } ) );
        if(goalSuccess)
            goalSuccess = yield this.agent.postSubGoal(new RetryGoal( { goal: new PlanningGoal( { goal: goal_finish_cut } ) } ) );
        if(goalSuccess)
            goalSuccess = yield this.agent.postSubGoal(new RetryGoal( { goal: new PlanningGoal( { goal: ['switch_off ' + nameDevice] } ) } ) );
        else
            this.log("Goal " + goal_finish_cut + " not achieved, switch off is impossible!")
    }
}

module.exports = {GardenRobotAgent, SensorGardenRobotGoal, SensorGardenRobotIntention, ManageTiltingGoal, ManageTiltingIntention, GardenRobotGoal, GardenRobotIntention};