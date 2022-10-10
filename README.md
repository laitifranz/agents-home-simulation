# Autonomous Software Agents 

## Project - Academic Year 2021/2022
## Scandinavian House

University of Trento - Trento, 2022

Francesco Laiti - francesco.laiti@studenti.unitn.it

---
## Introduction
The house proposed is a Scandinavian house, a particular house style inspired by Nordic houses. It is simple, efficient, and environmental-friendly with its 3 solar panels. This type of house is a trendy structure for new houses, due to its minimalism.

The house is based on two levels, a so-called *two-story house*, ideal for new parents, composed as follow:

1. __Ground floor__: 1 garage, 1 living room, 1 entrance, and 1 kitchen.
2. **First floor**: 1 bedroom, 1 bathroom, 1 baby room, and 1 hallway.

The house is designed to be a *smart home*, focusing on the user experience, the automation of the devices inside the home, and helping residents for a better life. Not all the devices are supposed to be smart, but just the most important ones that provide a great experience for the residents.

This project aims is to implement user-friendly devices, based on real products available on the market and functions already applicable.

The simulation developed in this project shows different interactions between the agents, how they control devices, their planning, and intentions.

## Installation
1. Install ```node``` from the [official website](https://nodejs.org/it/)
2. Open the terminal and navigate to the folder ```src```
3. Install the required dependencies for the project by running
 ```sh
  npm install
  ```

## Usage
Run one of the two scenarios available in the [scenario](./src/scandHouse/scenario) folder:
1. *Scenario_day* simulates an entire day by changing manually what sensors perceive to see how agents react
 ```sh
  node src/scandHouse/scenario/scenario_day.js
  ```
2. *Scenario_planning_intention* simulates how planning and no-planning agents perform
  ```sh
  node src/scandHouse/scenario/scenario_planning_intention.js
  ```