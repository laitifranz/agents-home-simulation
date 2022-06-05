//call house
const House = require('../house/house')

//call utils
// const Observable =  require('../utils/Observable')
const Clock =  require('../utils/Clock')

//call bdi
// const Beliefset =  require('../bdi/Beliefset')
const Agent = require('../bdi/Agent')
// const Goal = require('../bdi/Goal')
//const Intention = require('../bdi/Intention')
const {AlarmGoal, AlarmIntention} = require('../intentions/alarm_intention')
const {CarChargerGoal, CarChargerIntention} = require('../intentions/carCharger_intention')
const {humidityMeterGoal, humidityMeterIntention} = require('../intentions/humidityMeter_intention')
const {smartAirPurifierGoal, smartAirPurifierIntention} = require('../intentions/smartAirPurifier_intention')
const {windowGoal, windowIntention} = require('../intentions/windows_intention')
const {infraredCameraGoal, infraredCameraIntention} = require('../intentions/infraredCamera_intention')
const {smartTiltingGoal, smartTiltingIntention} = require('../intentions/smartTilting_intention')
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');


// House, which includes rooms and devices
var myHouse = new House()

// Agents
var houseAgent = new Agent('houseAgent')
var smartAirAgent = new Agent('smartAirAgent')
var humidityAgent = new Agent('humidityAgent')
var infraredCameraAgent = new Agent('infraredCameraAgent')
//var alarmAget = new Agent('alarmAgent')

houseAgent.intentions.push(AlarmIntention)
houseAgent.postSubGoal( new AlarmGoal({hh:5, mm:30}) )

houseAgent.intentions.push(CarChargerIntention);
houseAgent.postSubGoal(new CarChargerGoal(myHouse.devices.garage_car_charger));
//houseAgent.intentions.push(humidityMeterIntention)
houseAgent.intentions.push(smartTiltingIntention)
//houseAgent.postSubGoal(new humidityMeterGoal(myHouse.devices.bathroom_meter))
houseAgent.intentions.push(windowIntention)
//houseAgent.postSubGoal(new windowGoal(myHouse.devices.bathroom_window, myHouse))
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
//infraredCameraAgent.postSubGoal(new AlarmGoal({hh:9, mm:0}))
// alarmAget.intentions.push(AlarmIntention)
// alarmAget.intentions.push(PostmanAcceptAllRequest)
// alarmAget.postSubGoal(new Postman())
// alarmAget.postSubGoal(new AlarmGoal({hh:22, mm:0}))

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
//myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj bedroom hallway")
//myHouse.devices.vacuum_cleaner_1.beliefs.declare("adj hallway bedroom")

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


// Simulate planning and intentions

Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    //if (time.dd>=0 && time.dd <=1) { //workdays
    if (time.dd==0) {
        if(time.hh==0 && time.mm==0){
            //just for putting all the initial beliefs at the beginning of the log
        }
        if(time.hh==0 && time.mm==30){
            console.log('- PLANNING TEST -\n')
            console.log('- Vacuum cleaner agent -\n')
            console.log('- Vacuum cleaner ground floor -\n')
            console.log('GOAL: clean all room from the entrance to the kitchen\n')
            myHouse.devices.vacuum_cleaner.postSubGoal( new RetryGoal_vc( { goal: new PlanningGoal( { goal: ['in_room vacuum_cleaner kitchen'] } ) } ) )
        }
        if(time.hh==4 && time.mm==00){
            console.log('- Vacuum cleaner first floor -\n')
            console.log('GOAL: clean all room from the hallway to the bathroom')
            myHouse.devices.vacuum_cleaner_1.postSubGoal( new RetryGoal_vc( { goal: new PlanningGoal( { goal: ['in_room vacuum_cleaner_1 baby_room'] } ) } ) )
        }
        if(time.hh==8 && time.mm==00){
            console.log('- Heatpump agent -\n')
            console.log('GOAL: set the temperature of the heat pump high. It will FAIL because the solar panels are not awake\n')
            myHouse.devices.garage_pump.postSubGoal( new RetryGoal_hp( { goal: new PlanningGoal( { goal: ['set_temp_high heat_pump'] } ) } ) )
        }
        if(time.hh==12 && time.mm==00){
            myHouse.devices.solar_panel.energyAvailable()
            console.log('GOAL: set the temperature of the heat pump high. It will DO the plan because the solar panels are now awake\n')
            //myHouse.devices.garage_pump.postSubGoal( new RetryGoal_hp( { goal: new PlanningGoal( { goal: ['set_temp_high heat_pump'] } ) } ) )
        }    
        if(time.hh==16 && time.mm==0){
            console.log('- INTENTION TEST -\n')

            console.log('- Smart air purifier agent -\n')
            console.log('GOAL: switch on the air purifier and open the kitchen window\n')
            myHouse.devices.kitchen_air_pur.dirtyAirDetected()
        }
        if(time.hh==9 && time.mm==00){
            console.log('- Infrared camera agent -\n')
            console.log('GOAL: open the smart tilting when a movement is detected between the 8.00 am and 10.00 am\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.infrared_camera.movementDetected()
        }
        if(time.hh==23 && time.mm==30){
            console.log('- Humidity meter agent -\n')
            console.log('GOAL: open the bathroom window when humidity percentage goes over 85%\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.bathroom_meter.humidity = 88
            myHouse.devices.bathroom_meter.checkHumidity()
        }
}
})

// Start clock
Clock.startTimer()