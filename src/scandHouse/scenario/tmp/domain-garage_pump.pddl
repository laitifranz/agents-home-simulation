;; domain file: domain-garage_pump.pddl
(define (domain garage_pump)
    (:requirements :strips)
    (:predicates
        (heatpump ?obj)
        (switch_off ?obj)
        (switch_on ?obj)
        (solarpanel ?obj2)
        (carcharger ?obj3)
        (window ?obj4)
        (awake ?obj2)
        (notawake ?obj3)
        (notopen ?obj4)
        (set_temp_high ?obj)
        (set_temp_low ?obj)              
    )
    
        (:action SwitchOn_hp
            :parameters (?obj)
            :precondition (and
                (heatpump ?obj)
                (switch_off ?obj)
            )
            :effect (and
                (switch_on ?obj)
            )
        )
        
        (:action SwitchOff_hp
            :parameters (?obj)
            :precondition (and
                (heatpump ?obj)
                (switch_on ?obj)
            )
            :effect (and
                (switch_off ?obj)
            )
        )
        
        (:action setTemp_high
            :parameters (?obj ?obj2 ?obj3 ?obj4)
            :precondition (and
                (heatpump ?obj)
                (solarpanel ?obj2)
                (carcharger ?obj3)
                (window ?obj4)
                (awake ?obj2)
                (notawake ?obj3)
                (notopen ?obj4)
                (switch_on ?obj)
            )
            :effect (and
                (set_temp_high ?obj)
            )
        )
        
        (:action setTemp_low
            :parameters (?obj ?obj2 ?obj3 ?obj4)
            :precondition (and
                (heatpump ?obj)
                (set_temp_high ?obj)
            )
            :effect (and
                (set_temp_low ?obj)
            )
        )
)