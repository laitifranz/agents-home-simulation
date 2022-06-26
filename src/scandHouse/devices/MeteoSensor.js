const Observable = require('../utils/Observable');

class MeteoSensor extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('temperature', 18)
        this.set('forecast_today', 'night')
    }
    
    applyChange() {
        this.changeTemp()
        this.changeForecast()
        console.log('The temperature outside is ' + this.temperature + '°C')
    }
    changeTemp() {
        if(this.temperature > 0) {
            this.house.devices.garage_deice_system.beliefs.declare('temperature over_zero')
            this.house.devices.garage_deice_system.beliefs.undeclare('temperature under_zero')
            this.house.devices.robot_garden.beliefs.declare('temperature over_zero')
        }
        else{
            this.house.devices.garage_deice_system.beliefs.declare('temperature under_zero')
            this.house.devices.garage_deice_system.beliefs.undeclare('temperature over_zero')
            this.house.devices.robot_garden.beliefs.undeclare('temperature over_zero')
        }    
    }
    changeForecast() {
        if(this.forecast_today == 'sunny') {
            this.house.devices.robot_garden.beliefs.declare('weather good')
            this.house.devices.solar_panel.energyAvailable()
            console.log('The weather is SUNNY')
        }
        else if (this.forecast_today == 'cloudy'){
            this.house.devices.robot_garden.beliefs.declare('weather good')
            this.house.devices.solar_panel.noEnergyAvailable()
            console.log('The weather is CLOUDY')
        }
        else if (this.forecast_today == 'rainy'){
            this.house.devices.robot_garden.beliefs.undeclare('weather good')
            this.house.devices.solar_panel.noEnergyAvailable()
            console.log('The weather is RAINY')
        }
        else if (this.forecast_today == 'night'){
            this.house.devices.robot_garden.beliefs.undeclare('weather good')
            this.house.devices.solar_panel.noEnergyAvailable()
            console.log('The weather is NIGHT')
        }
        else{
            console.log('The weather is UNKNOWN')
            //default
            this.house.devices.robot_garden.beliefs.undeclare('weather good')
            this.house.devices.solar_panel.noEnergyAvailable()
        }
    }
}

module.exports = MeteoSensor;