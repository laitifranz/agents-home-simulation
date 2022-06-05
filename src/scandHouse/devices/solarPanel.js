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
        this.house.devices.garage_pump.beliefs.declare("awake solar_panel")
        this.house.devices.garage_pump.beliefs.undeclare("notawake solar_panel")
        console.log('Energy is available from the solar panels')
    }
    noEnergyAvailable () {
        this.status = 'no_green_energy_available'
        this.house.devices.garage_pump.beliefs.declare("notawake solar_panel")
        this.house.devices.garage_pump.beliefs.undeclare("awake solar_panel")
        console.log('Energy is NOT available from the solar panels')
    }
}

module.exports = SolarPanel;