;; problem file: problem-garage_pump.pddl
(define (problem garage_pump)
    (:domain garage_pump)
    (:objects heat_pump solar_panel car_charger window_open)
	(:init (heatpump heat_pump) (solarpanel solar_panel) (carcharger car_charger) (window window_open) (switch_off heat_pump) (notawake car_charger) (notopen window_open) (awake solar_panel))
	(:goal (and (set_temp_high heat_pump)))
)
