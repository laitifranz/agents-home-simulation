//call devices
const CarCharger = require('../devices/carCharger');
const DeicingSystem = require('../devices/deicingSystem')
const HeatPump = require('../devices/heatPump')
const HumidityMeter = require('../devices/humidityMeter')
const InfraredCamera = require('../devices/infraredCamera')
const Light = require('../devices/light')
const SmartAirPurifier = require('../devices/smartAirPurifier')
const SmartLockDoor = require('../devices/smartDoorLock')
const SmartTilting = require('../devices/smartTilting')
const SolarPanel = require('../devices/solarPanel');
const VacuumCleaner = require('../devices/vacuumCleaner');
const Window = require('../devices/window')

//call people
const Person = require('../people/person')

//call observable
const Observable =  require('../utils/Observable')

class House {
    constructor () {
        this.people = {
            john:   new Person(this, 'John'),
            mary:   new Person(this, 'Mary'),
            mario:  new Person(this, 'Mario')
        }
        this.rooms = {
        //ground floor
            entrance:       { name: 'entrance',     doors_to: ['garage', 'living_room', 'hallway']              }, 
            living_room:    { name: 'living_room',  doors_to: ['kitchen', 'entrance']                           },
            kitchen:        { name: 'kitchen',      doors_to: ['living_room']                                   },
            garage:         { name: 'garage',       doors_to: ['entrance']                                      }, 
        //first floor
            hallway:        { name: 'hallway',      doors_to: ['bathroom', 'bedroom', 'baby_room', 'entrance']  },
            bathroom:       { name: 'bathroom',     doors_to: ['hallway', 'bedroom']                            },
            bedroom:        { name: 'bedroom',      doors_to: ['hallway', 'bathroom', 'baby_room']              },
            baby_room:      { name: 'baby_room',    doors_to: ['bedroom', 'hallway']                            },
        }
        this.devices = {
        //ground floor
            //entrance
            entrance_light:     new Light(this, 'entrance_light'),
            entrance_door:      new SmartLockDoor(this, 'entrance_door'),

            //living_room    
            living_room_lights: {
                light1:         new Light(this, 'living_room_light1'), 
                light2:         new Light(this, 'living_room_light2'), 
                light3:         new Light(this, 'living_room_light3') } ,

            //kitchen   
            kitchen_lights:    {
                light1:         new Light(this, 'kitchen_light1'), 
                light2:         new Light(this, 'kitchen_light2'), 
                light3:         new Light(this, 'kitchen_light3') } ,
            kitchen_air_pur:    new SmartAirPurifier(this, 'kitchen_air_pur'),
            kitchen_windows:   {
                window1:        new Window(this, 'kitchen_window1')},

            //garage   
            garage_light:       new Light(this, 'garage_light'),
            garage_pump:        new HeatPump(this, 'garage_pump'),
            garage_car_charger: new CarCharger(this, 'garage_car_charger'),
            garage_tilting:     new SmartTilting(this, 'garage_tilting'),       
            garage_deice_system:new DeicingSystem(this, 'garage_deice_system'),
            infrared_camera:    new InfraredCamera(this, 'garage_camera'),

        //first floor
            //hallway
            hallway_lights: {
                light1:         new Light(this, 'hallway_light1'), 
                light2:         new Light(this, 'hallway_light2') } ,

            //bathroom       
            bathroom_lights:    {
                light1:         new Light(this, 'bathroom_light1'), 
                light2:         new Light(this, 'bathroom_light2'), 
                light3:         new Light(this, 'bathroom_light3') } ,
            bathroom_window:    new Window(this, 'bathroom_window'),
            bathroom_meter:     new HumidityMeter(this, 'bathroom_meter'),

            //bedroom      
            bedroom_lights:    {
                light1:         new Light(this, 'bedroom_light1'), 
                light2:         new Light(this, 'bedroom_light2')},

            //baby_room      
            baby_room_light:    new Light(this, 'babyroom_light'),
            baby_room_door:     new SmartLockDoor(this, 'babyroom_door'),

            //solar_panel
            solar_panel:        new SolarPanel(this, 'solar_panel'),

            //vacuum_cleaner
            vacuum_cleaner:     new VacuumCleaner(this, 'vacuum_cleaner'),
            vacuum_cleaner_1:     new VacuumCleaner(this, 'vacuum_cleaner_2'),
            
        }

        this.utilities = {
            electricity:        new Observable( { consumption: 0 } ),
            water:              new Observable( { consumption: 0 } )
        }
    }
}

module.exports = House;