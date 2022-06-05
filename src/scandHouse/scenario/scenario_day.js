//call house
const House = require('../house/house')

//call utils
const Clock =  require('../utils/Clock')

//call bdi
const Agent = require('../bdi/Agent')
const {AlarmGoal, AlarmIntention} = require('../intentions/alarm_intention')
const {CarChargerGoal, CarChargerIntention} = require('../intentions/carCharger_intention')
const {humidityMeterGoal, humidityMeterIntention} = require('../intentions/humidityMeter_intention')
const {smartAirPurifierGoal, smartAirPurifierIntention} = require('../intentions/smartAirPurifier_intention')
const {windowGoal, windowIntention} = require('../intentions/windows_intention')
const {infraredCameraGoal, infraredCameraIntention} = require('../intentions/infraredCamera_intention')
const {smartTiltingGoal, smartTiltingIntention} = require('../intentions/smartTilting_intention')
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {LightGoal, LightIntention} = require('../intentions/light_intention')
const {smartDoorLockGoal, smartDoorLockIntention} = require('../intentions/smartDoorLock_intention')

// House, which includes rooms and devices
var myHouse = new House()

// Agents
var houseAgent = new Agent('houseAgent')
var smartAirAgent = new Agent('smartAirAgent')
var humidityAgent = new Agent('humidityAgent')
var infraredCameraAgent = new Agent('infraredCameraAgent')

houseAgent.intentions.push(AlarmIntention)
houseAgent.postSubGoal( new AlarmGoal({hh:5, mm:30}) )

houseAgent.intentions.push(CarChargerIntention);
houseAgent.postSubGoal(new CarChargerGoal(myHouse.devices.garage_car_charger));
houseAgent.intentions.push(smartTiltingIntention)
houseAgent.intentions.push(windowIntention)
houseAgent.intentions.push(smartDoorLockIntention)
houseAgent.intentions.push(PostmanAcceptAllRequest)
houseAgent.postSubGoal(new Postman())

smartAirAgent.intentions.push(smartAirPurifierIntention)
smartAirAgent.intentions.push(PostmanAcceptAllRequest)
smartAirAgent.postSubGoal(new Postman())
smartAirAgent.postSubGoal(new smartAirPurifierGoal(myHouse.devices.kitchen_air_pur, myHouse))

humidityAgent.intentions.push(humidityMeterIntention)
humidityAgent.intentions.push(PostmanAcceptAllRequest)
humidityAgent.postSubGoal(new Postman())
humidityAgent.postSubGoal(new humidityMeterGoal(myHouse.devices.bathroom_meter, myHouse))

infraredCameraAgent.intentions.push(infraredCameraIntention)
infraredCameraAgent.intentions.push(PostmanAcceptAllRequest)
infraredCameraAgent.postSubGoal(new Postman())
infraredCameraAgent.postSubGoal(new infraredCameraGoal(myHouse.devices.infrared_camera, myHouse))

//PDDL Vacuum Cleaner
var PlanningGoal = require('../pddl/PlanningGoal')
const {Move, SwitchOn, SwitchOff,  RetryGoal_vc, RetryFourTimesIntention_vc} = require('../pddl_script/vacuum_pddl')
let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, SwitchOn, SwitchOff])

//ground floor vacuum cleaner
myHouse.devices.vacuum_cleaner.intentions.push(OnlinePlanning)
myHouse.devices.vacuum_cleaner.intentions.push(RetryFourTimesIntention_vc)

myHouse.devices.vacuum_cleaner.beliefs.declare("room entrance")
myHouse.devices.vacuum_cleaner.beliefs.declare("room living_room")
myHouse.devices.vacuum_cleaner.beliefs.declare("room kitchen")
myHouse.devices.vacuum_cleaner.beliefs.declare("vacuum vacuum_cleaner")

myHouse.devices.vacuum_cleaner.beliefs.declare("adj entrance living_room")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj living_room entrance")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj living_room kitchen")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj kitchen living_room")

myHouse.devices.vacuum_cleaner.beliefs.declare("in_room vacuum_cleaner entrance")

myHouse.devices.vacuum_cleaner.beliefs.declare("switch_off vacuum_cleaner")

//first floor vacuum cleaner
myHouse.devices.vacuum_cleaner_1.intentions.push(OnlinePlanning)
myHouse.devices.vacuum_cleaner_1.intentions.push(RetryFourTimesIntention_vc)

myHouse.devices.vacuum_cleaner_1.beliefs.declare("room hallway")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("room bathroom")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("room bedroom")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("room baby_room")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("vacuum vacuum_cleaner_1")

myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj hallway bathroom")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj bathroom hallway")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj bathroom bedroom")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj bedroom bathroom")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj bedroom baby_room")
myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj baby_room bedroom")

myHouse.devices.vacuum_cleaner_1.beliefs.declare("in_room vacuum_cleaner_1 hallway")

myHouse.devices.vacuum_cleaner_1.beliefs.declare("switch_off vacuum_cleaner_1")


//PDDL HeatPump
const {SwitchOn_hp, SwitchOff_hp, setTemp_high, setTemp_low, RetryGoal_hp, RetryFourTimesIntention_hp} = require('../pddl_script/heatpump_pddl')
let {OnlinePlanning: OnlinePlanner1} = require('../pddl/OnlinePlanner')([SwitchOn_hp, SwitchOff_hp, setTemp_high, setTemp_low])

myHouse.devices.garage_pump.intentions.push(OnlinePlanner1)
myHouse.devices.garage_pump.intentions.push(RetryFourTimesIntention_hp)

myHouse.devices.garage_pump.beliefs.declare("heatpump heat_pump")
myHouse.devices.garage_pump.beliefs.declare("solarpanel solar_panel")
myHouse.devices.garage_pump.beliefs.declare("carcharger car_charger")
myHouse.devices.garage_pump.beliefs.declare("window window_open")

myHouse.devices.garage_pump.beliefs.declare("switch_off heat_pump")

myHouse.devices.garage_pump.beliefs.declare("notawake solar_panel")
myHouse.devices.garage_pump.beliefs.declare("notawake car_charger")
myHouse.devices.garage_pump.beliefs.declare("notopen window_open")

// Simulate daily schedule

console.log('- START OF TEST -\n')
myHouse.people.mario.moveTo('baby_room')

Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    if (time.dd==0) {
        if(time.hh==6 && time.mm==0){
            myHouse.devices.infrared_camera.switchOffInfrared()

            myHouse.devices.kitchen_air_pur.dirtyAirDetected()

            myHouse.devices.bedroom_lights.light1.switchOnLight()
            myHouse.devices.bedroom_lights.light2.switchOnLight()

            myHouse.devices.kitchen_lights.light1.switchOnLight()
            myHouse.devices.kitchen_lights.light2.switchOnLight()
            myHouse.devices.kitchen_lights.light3.switchOnLight()

            myHouse.people.john.moveTo('hallway')
            myHouse.people.john.moveTo('entrance')
            myHouse.people.john.moveTo('living_room')
            myHouse.people.john.moveTo('kitchen')

            console.log('\n')
        }
        if(time.hh==6 && time.mm==30){
            myHouse.devices.living_room_lights.light1.switchOnLight()
            myHouse.devices.living_room_lights.light2.switchOnLight()
            myHouse.devices.living_room_lights.light3.switchOnLight()


            console.log('\n')
        }
        if(time.hh==7 && time.mm==45){
            myHouse.devices.solar_panel.energyAvailable()

            houseAgent.postSubGoal(new Postman())
            myHouse.devices.infrared_camera.movementDetected()

            myHouse.devices.garage_car_charger.stopRechargeMin()
            myHouse.devices.garage_car_charger.rechargeMaxPower()

            console.log('\n')
        }
        if(time.hh==8 && time.mm==30){
            myHouse.devices.bedroom_lights.light1.switchOffLight()
            myHouse.devices.bedroom_lights.light2.switchOffLight()

            myHouse.people.mary.moveTo('hallway')
            myHouse.people.mary.moveTo('entrance')
            myHouse.people.mary.moveTo('living_room')
            myHouse.people.mary.moveTo('kitchen')

            myHouse.people.john.moveTo('living_room')
            myHouse.people.john.moveTo('entrance')
            myHouse.people.john.moveTo('garage')

            myHouse.devices.garage_car_charger.stopRechargeMax()
            console.log('\n')
        }    
        if(time.hh==9 && time.mm==0){
            myHouse.people.mary.moveTo('living_room')
            myHouse.people.mary.moveTo('entrance')
            myHouse.people.mary.moveTo('garage')

            myHouse.devices.living_room_lights.light1.switchOffLight()
            myHouse.devices.living_room_lights.light2.switchOffLight()
            myHouse.devices.living_room_lights.light3.switchOffLight()

            myHouse.devices.kitchen_lights.light1.switchOffLight()
            myHouse.devices.kitchen_lights.light2.switchOffLight()
            myHouse.devices.kitchen_lights.light3.switchOffLight()

            myHouse.devices.garage_tilting.closeTilting()

            console.log('\n')
        }
        if(time.hh==9 && time.mm==30){
            myHouse.devices.solar_panel.energyAvailable()
            myHouse.devices.garage_car_charger.stopRechargeMax()
            myHouse.devices.garage_pump.postSubGoal( new RetryGoal_hp( { goal: new PlanningGoal( { goal: ['set_temp_high heat_pump'] } ) } ) )

            console.log('\n')
        }
        if(time.hh==10 && time.mm==30){
            myHouse.devices.vacuum_cleaner.postSubGoal( new RetryGoal_vc( { goal: new PlanningGoal( { goal: ['in_room vacuum_cleaner kitchen'] } ) } ) )
        }
        if(time.hh==11 && time.mm==15){
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.bathroom_meter.humidity = 88
            myHouse.devices.bathroom_meter.checkHumidity()
            
            console.log('\n')
        }
        if(time.hh==12 && time.mm==00){
            myHouse.devices.vacuum_cleaner_1.postSubGoal( new RetryGoal_vc( { goal: new PlanningGoal( { goal: ['in_room vacuum_cleaner_1 baby_room'] } ) } ) )
            
            console.log('\n')
        }
        if(time.hh==16 && time.mm==30){
            myHouse.people.mary.moveTo('entrance')
            myHouse.people.mary.moveTo('living_room')

            console.log('\n')
        }
        if(time.hh==17 && time.mm==45){
            myHouse.devices.solar_panel.noEnergyAvailable()

            myHouse.devices.living_room_lights.light1.switchOnLight()
            myHouse.devices.living_room_lights.light2.switchOnLight()
            myHouse.devices.living_room_lights.light3.switchOnLight()
            
            myHouse.devices.infrared_camera.switchOnInfrared()

            console.log('\n')
        }
        if(time.hh==18 && time.mm==30){
            myHouse.people.john.moveTo('entrance')
            myHouse.people.john.moveTo('living_room')

            myHouse.devices.solar_panel.noEnergyAvailable()
            myHouse.devices.garage_car_charger.rechargeMinPower()
            
            console.log('\n')
        }
        if(time.hh==19 && time.mm==0){
            myHouse.people.john.moveTo('kitchen')
            myHouse.devices.infrared_camera.switchOnInfrared()

            console.log('\n')
        }
        if(time.hh==19 && time.mm==30){
            myHouse.people.john.moveTo('living_room')
            myHouse.devices.vacuum_cleaner.postSubGoal( new RetryGoal_vc( { goal: new PlanningGoal( { goal: ['in_room vacuum_cleaner entrance'] } ) } ) )
            
            console.log('\n')
        }
        if(time.hh==21 && time.mm==30){
            myHouse.devices.bedroom_lights.light1.switchOnLight()
            myHouse.devices.bedroom_lights.light2.switchOnLight()

            console.log('\n')
        }
        if(time.hh==22 && time.mm==0){
            myHouse.people.mary.moveTo('entrance')
            myHouse.people.mary.moveTo('hallway')
            myHouse.people.mary.moveTo('bedroom')

            myHouse.people.john.moveTo('entrance')
            myHouse.people.john.moveTo('hallway')
            myHouse.people.john.moveTo('bedroom')

            console.log('\n')
        }
        if(time.hh==23 && time.mm==00){
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.infrared_camera.movementDetected()
            myHouse.devices.living_room_lights.light1.switchOffLight()
            myHouse.devices.living_room_lights.light2.switchOffLight()
            myHouse.devices.living_room_lights.light3.switchOffLight()

            myHouse.devices.bedroom_lights.light1.switchOffLight()
            myHouse.devices.bedroom_lights.light2.switchOffLight()
            
            console.log('\nAll residents go to sleep')
            console.log('\n')
        }
        if(time.hh==23 && time.mm==45){
            Clock.stopTimer()
            console.log("## REPORT OF CONSUMPTION: ##")
            console.log("\t- Electricity > \t" + (myHouse.utilities.electricity.consumption)/1000 + " kW \t " + ((myHouse.utilities.electricity.consumption)/1000)*0.26 + " €")
            console.log("\t- Water > \t\t" + myHouse.utilities.water.consumption + " L \t\t " + ((myHouse.utilities.water.consumption)/1000)*1.37 + " €")
            console.log('\n\n- END OF TEST -\n')
        }
    }
})

// Start clock
Clock.startTimer()