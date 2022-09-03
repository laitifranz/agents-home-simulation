//SCENARIO PLANNING INTENTION

const Clock =  require('../utils/Clock')
const PlanningGoal = require('../pddl/PlanningGoal')

const {SolarPanel, solarPanelGoal, solarPanelIntention} = require('../devices/SolarPanel')
const {CarCharger, CarChargerGoal, CarChargerIntention} = require('../devices/CarCharger')
const {HumidityMeter, humidityMeterGoal, humidityMeterIntention} = require('../devices/HumidityMeter')
const {Window, windowGoal, windowIntention} = require('../devices/Window')
const {OpenCloseTiltingGoal, OpenCloseTiltingIntention} = require('../devices/SmartTilting')
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../utils/messagedispatcher');
const {SmartLockDoor, smartDoorLockGoal, smartDoorLockIntention, smartDoorLockGoal_lock, smartDoorLockIntention_lock} = require('../devices/SmartDoorLock')
const {MeteoSensor, meteoSensorGoal, meteoSensorIntention} = require('../devices/MeteoSensor')
const {RetryGoal, RetryFourTimesIntention}  = require('../utils/RetryGoal')
const {DeicingSystem, DeicingSystemGoal, DeicingSystemIntention} = require('../devices/DeicingSystem')

// House, which includes rooms and devices
const House = require('../house/House')
var myHouse = new House()

// NO PLANNING AGENTS
// House agent
const HouseAgent = require('../agents/HouseAgent')
var houseAgent = new HouseAgent('houseAgent', myHouse)

houseAgent.intentions.push(CarChargerIntention);
houseAgent.postSubGoal(new CarChargerGoal(myHouse.devices.garage_car_charger));
houseAgent.intentions.push(meteoSensorIntention)
houseAgent.postSubGoal(new meteoSensorGoal(myHouse.devices.meteo_sensor));
houseAgent.intentions.push(OpenCloseTiltingIntention)
houseAgent.intentions.push(windowIntention)
houseAgent.intentions.push(humidityMeterIntention)
houseAgent.postSubGoal(new humidityMeterGoal(myHouse.devices.bathroom_meter, myHouse))
houseAgent.intentions.push(smartDoorLockIntention)
houseAgent.intentions.push(smartDoorLockIntention_lock)
houseAgent.postSubGoal(new smartDoorLockGoal(myHouse.devices.baby_room_door, myHouse))
houseAgent.postSubGoal(new smartDoorLockGoal(myHouse.devices.entrance_door, myHouse))
houseAgent.postSubGoal(new smartDoorLockGoal(myHouse.devices.garage_door_lock, myHouse))
houseAgent.intentions.push(solarPanelIntention)
houseAgent.postSubGoal(new solarPanelGoal(myHouse.devices.solar_panel, myHouse))
houseAgent.intentions.push(DeicingSystemIntention)
houseAgent.postSubGoal(new DeicingSystemGoal(myHouse.devices.garage_deice_system, myHouse))
houseAgent.intentions.push(PostmanAcceptAllRequest)
houseAgent.postSubGoal(new Postman())

// Smart Air Purifier Agent
var {SmartAirAgent, smartAirPurifierGoal, smartAirPurifierIntention, OpenWindowGoal, OpenWindowIntention} = require('../agents/SmartAirAgent')
let smartAirAgent = new SmartAirAgent('smartAirAgent', myHouse.devices.kitchen_air_pur, myHouse)

smartAirAgent.intentions.push(smartAirPurifierIntention)
smartAirAgent.intentions.push(OpenWindowIntention)
smartAirAgent.intentions.push(PostmanAcceptAllRequest)
smartAirAgent.postSubGoal(new Postman())
smartAirAgent.postSubGoal(new smartAirPurifierGoal())
smartAirAgent.postSubGoal(new OpenWindowGoal())

// Infrared Camera Agent
var {InfraCameraAgent, infraredCameraGoal, infraredCameraIntention, LockDoorGoal, LockDoorIntention} = require('../agents/InfraCameraAgent')
var infraredCameraAgent = new InfraCameraAgent('infraredCameraAgent', myHouse.devices.infrared_camera, myHouse)

infraredCameraAgent.intentions.push(infraredCameraIntention)
infraredCameraAgent.intentions.push(PostmanAcceptAllRequest)
infraredCameraAgent.intentions.push(LockDoorIntention)
infraredCameraAgent.postSubGoal(new Postman())
infraredCameraAgent.postSubGoal(new infraredCameraGoal(myHouse.devices.infrared_camera, myHouse))
infraredCameraAgent.postSubGoal(new LockDoorGoal())


// PLANNING AGENTS
// Vacuum Cleaner

var {VacuumCleanerAgent, VacuumCleanerGoal, VacuumCleanerIntention, SensorVacuumCleanerGoal, SensorVacuumCleanerIntention} = require("../agents/VacuumCleanerAgent");
var VacuumCleaner = require("../devices/VacuumCleaner");

let vacuumCleanerDevice = new VacuumCleaner(myHouse, "vacuum_cleaner");
let vacuumCleanerAgent  = new VacuumCleanerAgent("vacuumCleaner", vacuumCleanerDevice);
const nameVacuumCleaner = vacuumCleanerDevice.name

const {Move, SwitchOn, SwitchOff, Clean, ReturnToBase, ExitFromBase} = require('../pddlActions/VacuumPddl')
let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, SwitchOn, SwitchOff, Clean, ReturnToBase, ExitFromBase])

vacuumCleanerAgent.intentions.push(OnlinePlanning)
vacuumCleanerAgent.intentions.push(RetryFourTimesIntention)
vacuumCleanerAgent.intentions.push(VacuumCleanerIntention)
vacuumCleanerAgent.intentions.push(SensorVacuumCleanerIntention)
vacuumCleanerAgent.postSubGoal(new SensorVacuumCleanerGoal())

vacuumCleanerAgent.beliefs.declare("room hallway")
vacuumCleanerAgent.beliefs.declare("room bathroom")
vacuumCleanerAgent.beliefs.declare("room bedroom")
vacuumCleanerAgent.beliefs.declare("room baby_room")
vacuumCleanerAgent.beliefs.declare("base hallway")
vacuumCleanerAgent.beliefs.declare("vacuum " + nameVacuumCleaner)
vacuumCleanerAgent.beliefs.declare("adj hallway bathroom")
vacuumCleanerAgent.beliefs.declare("adj bathroom hallway")
vacuumCleanerAgent.beliefs.declare("adj hallway bedroom")
vacuumCleanerAgent.beliefs.declare("adj bedroom hallway")
vacuumCleanerAgent.beliefs.declare("adj hallway baby_room")
vacuumCleanerAgent.beliefs.declare("adj baby_room hallway")
vacuumCleanerAgent.beliefs.declare("not_cleaned hallway")
vacuumCleanerAgent.beliefs.declare("not_cleaned bathroom")
vacuumCleanerAgent.beliefs.declare("not_cleaned bedroom")
vacuumCleanerAgent.beliefs.declare("not_cleaned baby_room")
vacuumCleanerAgent.beliefs.declare("in_base " + nameVacuumCleaner)
vacuumCleanerAgent.beliefs.declare("in_room " + nameVacuumCleaner + " hallway")
vacuumCleanerAgent.beliefs.declare("switch_off " + nameVacuumCleaner)
vacuumCleanerAgent.beliefs.declare("state_water full")
vacuumCleanerAgent.beliefs.declare("state_garbage empty")

const GoalRoomToClean = ['cleaned hallway', 'cleaned bedroom', 'cleaned bathroom', 'cleaned baby_room']


//PDDL HeatPump
var {HeatPumpAgent, SensingHeatPumpIntention, SensingHeatPumpGoal} = require("../agents/HeatPumpAgent");
var HeatPump = require("../devices/HeatPump");

let heatPumpDevice = new HeatPump(myHouse, "heat_pump");
let heatPumpAgent  = new HeatPumpAgent("heatPump", heatPumpDevice, myHouse.devices.garage_car_charger, myHouse.devices.solar_panel, myHouse.devices.kitchen_windows);

const {SwitchOn_hp, SwitchOff_hp, setTempHigh, setTempLow} = require('../pddlActions/HeatPumpPddl')
let {OnlinePlanning: OnlinePlanner_hp} = require('../pddl/OnlinePlanner')([SwitchOn_hp, SwitchOff_hp, setTempHigh, setTempLow])

heatPumpAgent.intentions.push(OnlinePlanner_hp)
heatPumpAgent.intentions.push(RetryFourTimesIntention)
heatPumpAgent.intentions.push(SensingHeatPumpIntention)
heatPumpAgent.postSubGoal(new SensingHeatPumpGoal())

heatPumpAgent.beliefs.declare("heatpump heat_pump")
heatPumpAgent.beliefs.declare("solarpanel solar_panel")
heatPumpAgent.beliefs.declare("carcharger car_charger")
heatPumpAgent.beliefs.declare("window window_open")
heatPumpAgent.beliefs.declare("switch_off heat_pump")

const GoalHeatPump = ['temp_high heat_pump']


//PDDL GardenRobot
var {GardenRobotAgent, SensorGardenRobotGoal, SensorGardenRobotIntention, ManageTiltingGoal, ManageTiltingIntention, GardenRobotGoal, GardenRobotIntention} = require("../agents/GardenRobotAgent");
var GardenRobot = require("../devices/GardenRobot");

let gardenRobotDevice = new GardenRobot(myHouse, "robot_garden");
let gardenRobotAgent  = new GardenRobotAgent("gardenRobot", gardenRobotDevice, myHouse.devices.meteo_sensor, myHouse.devices.garage_tilting, houseAgent);
const nameGardenRobot = gardenRobotDevice.name

const {Move_gr, SwitchOn_gr, SwitchOff_gr, CutGrass, ReturnToBase_gr, ExitFromBase_gr} = require('../pddlActions/RobotGardenPddl')
let {OnlinePlanning: OnlinePlanner_gr} = require('../pddl/OnlinePlanner')([Move_gr, SwitchOn_gr, SwitchOff_gr, CutGrass, ReturnToBase_gr, ExitFromBase_gr])

gardenRobotAgent.intentions.push(OnlinePlanner_gr)
gardenRobotAgent.intentions.push(RetryFourTimesIntention)
gardenRobotAgent.intentions.push(SensorGardenRobotIntention)
gardenRobotAgent.postSubGoal(new SensorGardenRobotGoal())
gardenRobotAgent.intentions.push(ManageTiltingIntention)
gardenRobotAgent.postSubGoal(new ManageTiltingGoal())
gardenRobotAgent.intentions.push(GardenRobotIntention)
gardenRobotAgent.intentions.push(PostmanAcceptAllRequest)
gardenRobotAgent.postSubGoal(new Postman())

gardenRobotAgent.beliefs.declare("field garage")
gardenRobotAgent.beliefs.declare("field entrance")
gardenRobotAgent.beliefs.declare("field living_room")
gardenRobotAgent.beliefs.declare("field kitchen")
gardenRobotAgent.beliefs.declare("base garage")
gardenRobotAgent.beliefs.declare("gardenrobot " + nameGardenRobot)
gardenRobotAgent.beliefs.declare("adj garage entrance")
gardenRobotAgent.beliefs.declare("adj entrance garage")
gardenRobotAgent.beliefs.declare("adj entrance kitchen")
gardenRobotAgent.beliefs.declare("adj kitchen entrance")
gardenRobotAgent.beliefs.declare("adj kitchen living_room")
gardenRobotAgent.beliefs.declare("adj living_room kitchen")
gardenRobotAgent.beliefs.declare("adj living_room garage")
gardenRobotAgent.beliefs.declare("adj garage living_room")
gardenRobotAgent.beliefs.declare("not_cut entrance")
gardenRobotAgent.beliefs.declare("not_cut garage")
gardenRobotAgent.beliefs.declare("not_cut kitchen")
gardenRobotAgent.beliefs.declare("not_cut living_room")
gardenRobotAgent.beliefs.declare("in_base " + nameGardenRobot)
gardenRobotAgent.beliefs.declare("in_field " + nameGardenRobot + " garage")
gardenRobotAgent.beliefs.declare("switch_off " + nameGardenRobot)
gardenRobotAgent.beliefs.declare("state_tilting open")

const GoalFieldToCut = ['cut entrance', 'cut kitchen', 'cut garage']


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
            //myHouse.devices.meteo_sensor.temperature = 18
        }
        if(time.hh==0 && time.mm==30){
            console.log('- PLANNING TEST -\n')
            console.log('- Vacuum cleaner agent -\n')
            console.log('GOAL: clean all rooms and return to the base\n')
            vacuumCleanerAgent.postSubGoal( new VacuumCleanerGoal({goal_finish_clean: GoalRoomToClean, nameDevice: nameVacuumCleaner}) )
        }
        if(time.hh==8 && time.mm==30){
            console.log('- Garden robot agent -\n')
            console.log('GOAL: cut all grass and return to the base\n')
            //myHouse.devices.meteo_sensor.forecast_today = 'rainy'
            gardenRobotAgent.postSubGoal( new GardenRobotGoal({goal_finish_cut: GoalFieldToCut, nameDevice: nameGardenRobot}) )
        }
        if(time.hh==16 && time.mm==00){
            console.log('- Heatpump agent -\n')
            console.log('GOAL: set the temperature of the heat pump high\n')
            //myHouse.devices.meteo_sensor.forecast_today = 'rainy'
            heatPumpAgent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: GoalHeatPump } ) } ) )
        }
        if(time.hh==18 && time.mm==00){
            console.log('- NO PLANNING TEST -\n')
            console.log('- Smart air purifier agent -\n')
            console.log('GOAL: switch on the air purifier and open the kitchen window\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.kitchen_air_pur.status = 'dirty_air'
        }    
        if(time.hh==20 && time.mm==0){
            console.log('- Infrared camera agent -\n')
            console.log('GOAL: lock the door of the garage\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.infrared_camera.status = 'move_detect'
        }
        if(time.hh==21 && time.mm==00){
            console.log('- House agent -\n')
            console.log('- 1. Deicing system -\n')
            console.log('GOAL: turn on the deicing system\n')
            myHouse.devices.meteo_sensor.temperature = -2
        }
        if(time.hh==22 && time.mm==00){
            console.log('- 2. Humidity meter -\n')
            console.log('GOAL: open the bathroom window when humidity percentage goes over 85%\n')
            houseAgent.postSubGoal(new Postman())
            myHouse.devices.bathroom_meter.humidity = 88
        }
        if(time.hh==23 && time.mm==45){
            Clock.stopTimer()
            console.log("## CONSUMPTION REPORT ##")
            console.log("\t- Electricity > \t" + (myHouse.utilities.electricity.consumption)/1000 + " kW \t " + ((myHouse.utilities.electricity.consumption)/1000)*0.26 + " €")
            console.log("\t- Water > \t\t" + myHouse.utilities.water.consumption + " L \t\t " + ((myHouse.utilities.water.consumption)/1000)*1.37 + " €")
            console.log('\n\n- END OF TEST -\n')
        }
    }
})

// Start clock
Clock.startTimer()