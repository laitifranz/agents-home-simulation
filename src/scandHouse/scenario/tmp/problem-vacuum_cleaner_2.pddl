;; problem file: problem-vacuum_cleaner_2.pddl
(define (problem vacuum_cleaner_2)
    (:domain vacuum_cleaner_2)
    (:objects hallway bathroom bedroom baby_room vacuum_cleaner_1)
	(:init (room hallway) (room bathroom) (room bedroom) (room baby_room) (vacuum vacuum_cleaner_1) (adj hallway bathroom) (adj bathroom hallway) (adj bathroom bedroom) (adj bedroom bathroom) (adj bedroom baby_room) (adj baby_room bedroom) (in_room vacuum_cleaner_1 hallway) (switch_off vacuum_cleaner_1))
	(:goal (and (in_room vacuum_cleaner_1 baby_room)))
)
