;; problem file: problem-vacuum_cleaner.pddl
(define (problem vacuum_cleaner)
    (:domain vacuum_cleaner)
    (:objects entrance living_room kitchen vacuum_cleaner)
	(:init (room entrance) (room living_room) (room kitchen) (vacuum vacuum_cleaner) (adj entrance living_room) (adj living_room entrance) (adj living_room kitchen) (adj kitchen living_room) (in_room vacuum_cleaner entrance) (switch_off vacuum_cleaner))
	(:goal (and (in_room vacuum_cleaner kitchen)))
)
