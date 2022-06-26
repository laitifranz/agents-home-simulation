const Observable = require('../utils/Observable');

class CarCharger extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name
        this.set('status', 'unplugged') 
    }

    rechargeMaxPower () {
        if (this.status != 'plugged_max'){
            this.house.utilities.electricity.consumption += 21000;
            this.status = 'plugged_max'
            this.house.devices.garage_pump.beliefs.declare("awake car_charger")
            this.house.devices.garage_pump.beliefs.undeclare("notawake car_charger")
            console.log('Start charging car at MAX power')
        }
        else
            console.log('Car is already charging at MAX power')
    }
    rechargeMinPower () {
        if (this.status != 'plugged_min'){
            this.house.utilities.electricity.consumption += 14000;
            this.status = 'plugged_min'
            this.house.devices.garage_pump.beliefs.declare("awake car_charger")
            this.house.devices.garage_pump.beliefs.undeclare("notawake car_charger")
            console.log('Start charging car at MIN power')
        }
        else
            console.log('Car is already charging at MIN power')
    }
    stopRecharge () {
        this.status = 'unplugged'
        this.house.devices.garage_pump.beliefs.declare("notawake car_charger")
        this.house.devices.garage_pump.beliefs.undeclare("awake car_charger")
        console.log('Recharge car has been stopped')
    }
}

module.exports = CarCharger;