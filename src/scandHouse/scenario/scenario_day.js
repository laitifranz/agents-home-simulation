//SCENARIO DAY

const Clock =  require('../utils/Clock')

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

const {Move, SwitchOn, SwitchOff, Clean, ReturnToBase, ExitFromBase} = require('../pddlActions/VacuumPddl')
let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, SwitchOn, SwitchOff, Clean, ReturnToBase, ExitFromBase])

vacuumCleanerAgent.intentions.push(OnlinePlanning)
vacuumCleanerAgent.intentions.push(RetryFourTimesIntention)
vacuumCleanerAgent.intentions.push(VacuumCleanerIntention)
vacuumCleanerAgent.intentions.push(SensorVacuumCleanerIntention)
vacuumCleanerAgent.postSubGoal(new SensorVacuumCleanerGoal())


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


//PDDL GardenRobot
var {GardenRobotAgent, SensorGardenRobotGoal, SensorGardenRobotIntention, ManageTiltingGoal, ManageTiltingIntention, GardenRobotGoal, GardenRobotIntention} = require("../agents/GardenRobotAgent");
var GardenRobot = require("../devices/GardenRobot");

let gardenRobotDevice = new GardenRobot(myHouse, "robot_garden");
let gardenRobotAgent  = new GardenRobotAgent("gardenRobot", gardenRobotDevice, myHouse.devices.meteo_sensor, myHouse.devices.garage_tilting, houseAgent);

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


// Simulate a day

console.log('- START OF TEST -\n')
myHouse.people.mario.moveTo('baby_room')

Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    if (time.dd==0) {
        if(time.hh==0 && time.mm==0){
            //just for putting all the initial beliefs at the beginning of the log
        }
        if(time.hh==0 && time.mm==30){
            console.log('- Simulate the change of temperature > new temperature = -2° -\n')
            myHouse.devices.meteo_sensor.temperature = -2
        }
        if(time.hh==4 && time.mm==30){
            console.log('- Simulate the change of weather > new weather condition = rainy -\n')
            myHouse.devices.meteo_sensor.forecast_today = 'rainy'
        }
        if(time.hh==8 && time.mm==30){
            console.log('- Simulate the change of weather > new weather condition = sunny -\n')
            myHouse.devices.meteo_sensor.forecast_today = 'sunny'
        }
        if(time.hh==16 && time.mm==30){
            myHouse.people.mario.resetVacuumCleaner(vacuumCleanerDevice)
        }
        if(time.hh==16 && time.mm==45){
            myHouse.people.john.resetVacuumCleaner(vacuumCleanerDevice)
        }
        if(time.hh==19 && time.mm==00){
            console.log('- Simulate the change of humidity > new humidity value = 88 % -\n')
            myHouse.devices.bathroom_meter.humidity = 88
        }
        if(time.hh==23 && time.mm==45){
            Clock.stopTimer()
        }
    }
})

// Start clock
Clock.startTimer()