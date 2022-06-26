//call house
const House = require('../house/House')

//call utils
const Clock =  require('../utils/Clock')
const PlanningGoal = require('../pddl/PlanningGoal')

//call bdi
const Agent = require('../bdi/Agent')
const {CarChargerGoal, CarChargerIntention} = require('../intentions/carCharger_intention')
const {humidityMeterGoal, humidityMeterIntention} = require('../intentions/humidityMeter_intention')
const {smartAirPurifierGoal, smartAirPurifierIntention} = require('../intentions/smartAirPurifier_intention')
const {windowGoal, windowIntention} = require('../intentions/windows_intention')
const {infraredCameraGoal, infraredCameraIntention} = require('../intentions/infraredCamera_intention')
const {smartTiltingGoal, smartTiltingIntention} = require('../intentions/smartTilting_intention')
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {smartDoorLockGoal, smartDoorLockIntention} = require('../intentions/smartDoorLock_intention')
const {meteoSensorGoal, meteoSensorIntention} = require('../intentions/meteoSensor_intention')
const {RetryGoal, RetryFourTimesIntention}  = require('../utils/RetryGoal')
const {smartDoorLockGoal_lock, smartDoorLockIntention_lock} = require('../intentions/smartDoorLock_intention_lock')

// House, which includes rooms and devices
var myHouse = new House()

// Agents
var houseAgent = new Agent('houseAgent')
var smartAirAgent = new Agent('smartAirAgent')
var infraredCameraAgent = new Agent('infraredCameraAgent')

houseAgent.intentions.push(CarChargerIntention);
houseAgent.postSubGoal(new CarChargerGoal(myHouse.devices.garage_car_charger));
houseAgent.intentions.push(meteoSensorIntention)
houseAgent.postSubGoal(new meteoSensorGoal(myHouse.devices.meteo_sensor));
houseAgent.intentions.push(meteoSensorIntention)
houseAgent.postSubGoal(new meteoSensorGoal(myHouse.devices.meteo_sensor));
houseAgent.intentions.push(smartTiltingIntention)
houseAgent.postSubGoal(new smartTiltingGoal(myHouse.devices.garage_tilting, myHouse));
houseAgent.intentions.push(windowIntention)
houseAgent.intentions.push(humidityMeterIntention)
houseAgent.postSubGoal(new humidityMeterGoal(myHouse.devices.bathroom_meter, myHouse))
houseAgent.intentions.push(smartDoorLockIntention)
houseAgent.intentions.push(smartDoorLockIntention_lock)
houseAgent.postSubGoal(new smartDoorLockGoal(myHouse.devices.baby_room_door, myHouse))
houseAgent.postSubGoal(new smartDoorLockGoal(myHouse.devices.entrance_door, myHouse))
houseAgent.postSubGoal(new smartDoorLockGoal(myHouse.devices.garage_door_lock, myHouse))
houseAgent.intentions.push(PostmanAcceptAllRequest)
houseAgent.postSubGoal(new Postman())

smartAirAgent.intentions.push(smartAirPurifierIntention)
smartAirAgent.intentions.push(PostmanAcceptAllRequest)
smartAirAgent.postSubGoal(new Postman())
smartAirAgent.postSubGoal(new smartAirPurifierGoal(myHouse.devices.kitchen_air_pur, myHouse))

infraredCameraAgent.intentions.push(infraredCameraIntention)
infraredCameraAgent.intentions.push(PostmanAcceptAllRequest)
infraredCameraAgent.postSubGoal(new Postman())
infraredCameraAgent.postSubGoal(new infraredCameraGoal(myHouse.devices.infrared_camera, myHouse))

//PDDL Vacuum Cleaner
const {Move, SwitchOn, SwitchOff, Clean, CleanAll, ReturnToBase, ExitFromBase, LastTask} = require('../pddl_script/VacuumPddl')
let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, SwitchOn, SwitchOff, Clean, CleanAll, ReturnToBase, ExitFromBase, LastTask])

myHouse.devices.vacuum_cleaner.intentions.push(OnlinePlanning)
myHouse.devices.vacuum_cleaner.intentions.push(RetryFourTimesIntention)

myHouse.devices.vacuum_cleaner.beliefs.declare("room hallway")
myHouse.devices.vacuum_cleaner.beliefs.declare("room bathroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("room bedroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("room baby_room")

myHouse.devices.vacuum_cleaner.beliefs.declare("room1 hallway")
myHouse.devices.vacuum_cleaner.beliefs.declare("room2 bathroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("room3 bedroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("room4 baby_room")

myHouse.devices.vacuum_cleaner.beliefs.declare("vacuum vacuum_cleaner")

myHouse.devices.vacuum_cleaner.beliefs.declare("adj hallway bathroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj bathroom hallway")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj hallway bedroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj bedroom hallway")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj hallway baby_room")
myHouse.devices.vacuum_cleaner.beliefs.declare("adj baby_room hallway")

myHouse.devices.vacuum_cleaner.beliefs.declare("not_cleaned hallway")
myHouse.devices.vacuum_cleaner.beliefs.declare("not_cleaned bathroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("not_cleaned bedroom")
myHouse.devices.vacuum_cleaner.beliefs.declare("not_cleaned baby_room")
myHouse.devices.vacuum_cleaner.beliefs.declare("in_base vacuum_cleaner")
myHouse.devices.vacuum_cleaner.beliefs.declare("in_room vacuum_cleaner hallway")

myHouse.devices.vacuum_cleaner.beliefs.declare("switch_off vacuum_cleaner")


//PDDL HeatPump
const {SwitchOn_hp, SwitchOff_hp, setTempHigh, setTempLow} = require('../pddl_script/HeatPumpPddl')
let {OnlinePlanning: OnlinePlanner_hp} = require('../pddl/OnlinePlanner')([SwitchOn_hp, SwitchOff_hp, setTempHigh, setTempLow])

myHouse.devices.garage_pump.intentions.push(OnlinePlanner_hp)
myHouse.devices.garage_pump.intentions.push(RetryFourTimesIntention)

myHouse.devices.garage_pump.beliefs.declare("heatpump heat_pump")
myHouse.devices.garage_pump.beliefs.declare("solarpanel solar_panel")
myHouse.devices.garage_pump.beliefs.declare("carcharger car_charger")
myHouse.devices.garage_pump.beliefs.declare("window window_open")

myHouse.devices.garage_pump.beliefs.declare("switch_off heat_pump")

myHouse.devices.garage_pump.beliefs.declare("notawake solar_panel")
myHouse.devices.garage_pump.beliefs.declare("notawake car_charger")
myHouse.devices.garage_pump.beliefs.declare("notopen window_open")

//PDDL DeicingMachine
const {TurnOn, TurnOff} = require('../pddl_script/DeicingPddl')
let {OnlinePlanning: OnlinePlanner_ds} = require('../pddl/OnlinePlanner')([TurnOn, TurnOff])

myHouse.devices.garage_deice_system.intentions.push(OnlinePlanner_ds)
myHouse.devices.garage_deice_system.intentions.push(RetryFourTimesIntention)

myHouse.devices.garage_deice_system.beliefs.declare('deicing deicing_system')
myHouse.devices.garage_deice_system.beliefs.declare('off deicing_system')
myHouse.devices.garage_deice_system.beliefs.declare('state under_zero')
myHouse.devices.garage_deice_system.beliefs.declare('temperature over_zero')

//PDDL GarderRobot
const {Move_gr, SwitchOn_gr, SwitchOff_gr, CutGrass, CutAll, ReturnToBase_gr, ExitFromBase_gr, LastTask_gr} = require('../pddl_script/RobotGardenPddl')
let {OnlinePlanning: OnlinePlanner_gr} = require('../pddl/OnlinePlanner')([Move_gr, SwitchOn_gr, SwitchOff_gr, CutGrass, CutAll, ReturnToBase_gr, ExitFromBase_gr, LastTask_gr])

myHouse.devices.robot_garden.intentions.push(OnlinePlanner_gr)
myHouse.devices.robot_garden.intentions.push(RetryFourTimesIntention)

myHouse.devices.robot_garden.beliefs.declare("field garage")
myHouse.devices.robot_garden.beliefs.declare("field entrance")
myHouse.devices.robot_garden.beliefs.declare("field living_room")
myHouse.devices.robot_garden.beliefs.declare("field kitchen")

myHouse.devices.robot_garden.beliefs.declare("field1 garage")
myHouse.devices.robot_garden.beliefs.declare("field2 entrance")
myHouse.devices.robot_garden.beliefs.declare("field3 living_room")
myHouse.devices.robot_garden.beliefs.declare("field4 kitchen")

myHouse.devices.robot_garden.beliefs.declare("gardenrobot robot_garden")

myHouse.devices.robot_garden.beliefs.declare("adj garage entrance")
myHouse.devices.robot_garden.beliefs.declare("adj entrance garage")
myHouse.devices.robot_garden.beliefs.declare("adj entrance kitchen")
myHouse.devices.robot_garden.beliefs.declare("adj kitchen entrance")
myHouse.devices.robot_garden.beliefs.declare("adj kitchen living_room")
myHouse.devices.robot_garden.beliefs.declare("adj living_room kitchen")
myHouse.devices.robot_garden.beliefs.declare("adj living_room garage")
myHouse.devices.robot_garden.beliefs.declare("adj garage living_room")

myHouse.devices.robot_garden.beliefs.declare("not_cut entrance")
myHouse.devices.robot_garden.beliefs.declare("not_cut garage")
myHouse.devices.robot_garden.beliefs.declare("not_cut kitchen")
myHouse.devices.robot_garden.beliefs.declare("not_cut living_room")

myHouse.devices.robot_garden.beliefs.declare("in_base robot_garden")
myHouse.devices.robot_garden.beliefs.declare("in_field robot_garden garage")

myHouse.devices.robot_garden.beliefs.declare("switch_off robot_garden")

myHouse.devices.robot_garden.beliefs.declare("weather good")
myHouse.devices.robot_garden.beliefs.declare("status_weather good")

myHouse.devices.robot_garden.beliefs.declare('state over_zero')

// Simulate planning and no planning agents

console.log('- START OF TEST -\n')
myHouse.people.mario.moveTo('baby_room')

Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    if (time.dd==0) {
        if(time.hh==0 && time.mm==0){
            //just for putting all the initial beliefs at the beginning of the log
        }
        if(time.hh==0 && time.mm==15){
            myHouse.devices.meteo_sensor.forecast_today = 'sunny' //otherwise the garden robot cannot find a valid plan, same for the heat pump
        }
        if(time.hh==0 && time.mm==30){
            console.log('- PLANNING TEST -\n')
            console.log('- Vacuum cleaner agent -\n')
            console.log('GOAL: clean all rooms and return to the base\n')
            myHouse.devices.vacuum_cleaner.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['finish_clean vacuum_cleaner'] } ) } ) )
        }
        if(time.hh==8 && time.mm==30){
            console.log('- Garden robot agent -\n')
            console.log('GOAL: cut all grass and return to the base\n')
            //myHouse.devices.meteo_sensor.forecast_today = 'rainy'
            myHouse.devices.robot_garden.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['finish_cut robot_garden'] } ) } ) )
        }
        if(time.hh==16 && time.mm==00){
            console.log('- Heatpump agent -\n')
            console.log('GOAL: set the temperature of the heat pump high\n')
            //myHouse.devices.meteo_sensor.forecast_today = 'rainy'
            myHouse.devices.garage_pump.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['temp_high heat_pump'] } ) } ) )
        }
        if(time.hh==18 && time.mm==00){
            console.log('- Deicing system agent -\n')
            console.log('GOAL: turn on the deicing system\n')
            myHouse.devices.meteo_sensor.temperature = -2
            myHouse.devices.garage_deice_system.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['on deicing_system'] } ) } ) )
        }    
        if(time.hh==20 && time.mm==0){
            console.log('- NO PLANNING TEST -\n')
            console.log('- Smart air purifier agent -\n')
            console.log('GOAL: switch on the air purifier and open the kitchen window\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.kitchen_air_pur.status = 'dirty_air'
        }
        if(time.hh==21 && time.mm==00){
            console.log('- Infrared camera agent -\n')
            console.log('GOAL: lock the door of the garage\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.infrared_camera.status = 'move_detect'
        }
        if(time.hh==22 && time.mm==00){
            console.log('- Humidity meter agent -\n')
            console.log('GOAL: open the bathroom window when humidity percentage goes over 85%\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.bathroom_meter.humidity = 88
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