const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Observable = require('../utils/Observable');

class SolarPanel extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house; 
        this.name = name;
        this.set('status', 'no_green_energy_available') 
    }
    energyAvailable () {
        this.status = 'green_energy_available'
        console.log('Energy is available from the solar panels')
    }
    noEnergyAvailable () {
        this.status = 'no_green_energy_available'
        console.log('Energy is NOT available from the solar panels')
    }
}
class solarPanelGoal extends Goal {
    constructor(solarPanel, house) {
      super(solarPanel);
  
      /** @type {solarPanel} solarPanel */
      this.solarPanel = solarPanel;
      /** @type {myHouse} house */
      this.house = house;
    }
  }
  
class solarPanelIntention extends Intention {
    constructor(agent, goal) {
        super(agent, goal);

        /** @type {solarPanel} solarPanel */
        this.solarPanel = this.goal.solarPanel;
        /** @type {myHouse} house */
        this.house = this.goal.house;

    }

    static applicable(goal) {
        return goal instanceof solarPanelGoal;
    }

    *exec() {
        var solarPanelGoals = [];
        let solarPanelPromise = new Promise(( async res => {
            while(true){
                let forecast = await this.house.devices.meteo_sensor.notifyAnyChange()
                if(isNaN(forecast)){
                    if(forecast == 'sunny')
                        this.solarPanel.energyAvailable();
                    else
                        this.solarPanel.noEnergyAvailable();
                    }
            }
        }));

        solarPanelGoals.push(solarPanelPromise);
        yield Promise.all(solarPanelGoals)
        }
}
module.exports = {SolarPanel, solarPanelGoal, solarPanelIntention};