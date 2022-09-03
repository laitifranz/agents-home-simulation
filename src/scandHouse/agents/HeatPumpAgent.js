const Agent = require('../bdi/Agent');
const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');

class HeatPumpAgent extends Agent {
    constructor (name, heatPumpDevice, carChargerDevice, solarPanelDevice, windowDevice) {
        super(name);
        this.device = heatPumpDevice;
        this.carChargerDevice = carChargerDevice;
        this.solarPanelDevice = solarPanelDevice;
        this.windowDevice = windowDevice;
    }
}

class SensingHeatPumpGoal extends Goal{}
class SensingHeatPumpIntention extends Intention{
    static applicable(goal) {
        return goal instanceof SensingHeatPumpGoal;
    }

    *exec() {
        let heatPumpGoals = [];
        let heatPumpPromise_carcharger = new Promise(( async res => {
            while(true){
                let status = await this.agent.carChargerDevice.notifyChange('status');
                if(status == 'plugged_max' || status == 'plugged_min'){
                    this.agent.beliefs.undeclare("notawake car_charger")
                }
                else if(status == 'unplugged'){
                    this.agent.beliefs.declare("notawake car_charger")
                }
            }
        }));
        let heatPumpPromise_solarpanel = new Promise(( async res => {
            while(true){
                let status = await this.agent.solarPanelDevice.notifyChange('status');
                if(status == 'no_green_energy_available'){
                    this.agent.beliefs.undeclare("awake solar_panel")
                }
                else{
                    this.agent.beliefs.declare("awake solar_panel")
                }
            }
        }));
        let heatPumpPromise_window = new Promise(( async res => {
            while(true){
                let status = await this.agent.windowDevice.notifyChange('status');
                if(status == 'open'){
                    this.agent.beliefs.undeclare("notopen window_open")
                }
                else{
                    this.agent.beliefs.declare("notopen window_open")
                }
            }
        }));
        heatPumpGoals.push(heatPumpPromise_carcharger);
        heatPumpGoals.push(heatPumpPromise_solarpanel);
        heatPumpGoals.push(heatPumpPromise_window);
        yield Promise.all(heatPumpGoals)
        }
}


module.exports = {HeatPumpAgent, SensingHeatPumpIntention, SensingHeatPumpGoal};