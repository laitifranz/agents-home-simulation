const Observable = require('../utils/Observable');

class CarCharger extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name
        this.set('status', 'unplugged_min') 
    }
    rechargeMaxPower () {
        if (this.status != 'plugged_max')
            this.house.utilities.electricity.consumption += 21;
        this.status = 'plugged_max'
        this.house.devices.garage_pump.beliefs.declare("awake car_charger")
        this.house.devices.garage_pump.beliefs.undeclare("notawake car_charger")
        console.log('Recharge car at maximum power started')
    }
    stopRechargeMax () {
        this.status = 'unplugged_max'
        this.house.devices.garage_pump.beliefs.declare("notawake car_charger")
        this.house.devices.garage_pump.beliefs.undeclare("awake car_charger")
        console.log('Recharge car at maximum power stopped')
    }
    rechargeMinPower () {
        if (this.status != 'plugged_min')
            this.house.utilities.electricity.consumption += 15;
        this.status = 'plugged_min'
        this.house.devices.garage_pump.beliefs.declare("notawake car_charger")
        this.house.devices.garage_pump.beliefs.undeclare("awake car_charger")
        console.log('Recharge car at minimum power started')

    }
    stopRechargeMin () {
        this.status = 'unplugged_min'
        this.house.devices.garage_pump.beliefs.declare("notawake car_charger")
        this.house.devices.garage_pump.beliefs.undeclare("awake car_charger")
        console.log('Recharge car at minimum power stopped')
    }

}

module.exports = CarCharger;