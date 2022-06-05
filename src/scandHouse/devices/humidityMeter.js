const Observable = require('../utils/Observable');

class HumidityMeter extends Observable {
    constructor (house, name) {
        super(house, name); 
        this.house = house;
        this.name = name;
        this.set('status', 'low_humidity') 
        this.set('humidity', 60)
    }
    humidityDetected () {
        this.status = 'high_humidity'
        console.log('High humidity detected in the bathroom')
    }
    humidityNotDetected () {
        this.status = 'low_humidity'
        console.log('Low humidity in the bathroom')
    }
    checkHumidity(){
        if (this.humidity > 85) {
            console.log('Humidity: ' + this.humidity + '%')
            this.humidityDetected()
        }
        else{
            this.humidityNotDetected()
        }
    }
}

module.exports = HumidityMeter;