;; domain file: domain-vacuum_cleaner_2.pddl
(define (domain vacuum_cleaner_2)
    (:requirements :strips)
    (:predicates
        (vacuum ?obj)
        (room ?before)
        (adj ?before ?after)
        (in_room ?obj ?before)
        (switch_on ?obj)
        (switch_off ?obj)              
    )
    
        (:action Move
            :parameters (?obj ?before ?after)
            :precondition (and
                (vacuum ?obj)
                (room ?before)
                (room ?after)
                (adj ?before ?after)
                (in_room ?obj ?before)
                (adj ?after ?before)
                (switch_on ?obj)
            )
            :effect (and
                (in_room ?obj ?after)
                (not (in_room ?obj ?before))
            )
        )
        
        (:action SwitchOn
            :parameters (?obj)
            :precondition (and
                (vacuum ?obj)
                (switch_off ?obj)
            )
            :effect (and
                (switch_on ?obj)
            )
        )
        
        (:action SwitchOff
            :parameters (?obj)
            :precondition (and
                (vacuum ?obj)
                (switch_on ?obj)
            )
            :effect (and
                (switch_off ?obj)
            )
        )
)