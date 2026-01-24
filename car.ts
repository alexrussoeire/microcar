/**
  * Model Types of car
  * Single model for deskpi_microcar supported
  */
enum CarModel
{
    deskpi_microcar
}

/**
  * Enumeration of motors.
  */
enum CarMotor
{
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="both"
    Both
}

/**
  * Enumeration of forward/reverse directions
  */
enum CarDirection
{
    //% block="forward"
    Forward,
    //% block="backward"
    Backward
}

/**
  * Enumeration of directions.
  */
enum CarTurnDirection
{
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
  * Enumeration of the line sensors.
  */
enum CarLineSensor
{
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
 * Custom blocks
 */
//% weight=50 color=#e7660b icon="\uf1b9"
//% groups='["Motors", "Sensors", "Advanced"]'
namespace car
{

/////

    // Definition of the default car model
    let _model = CarModel.deskpi_microcar

    // Definition of the IO pings used for the motors
    let pin_motor_left_pos: DigitalPin
    let pin_motor_left_neg: DigitalPin
    let pin_motor_right_pos: DigitalPin
    let pin_motor_right_neg: DigitalPin

    // Definition of the ultrasonic sensor pins
    let pin_ultrasonic_trigger: DigitalPin
    let pin_ultrasonic_echo: DigitalPin

    // Definition of the line sensor pins
    let pin_line_sensor_left: AnalogPin = AnalogPin.P1
    let pin_line_sensor_right: AnalogPin = AnalogPin.P2

    // Definition of the distance (in cm) to time (in ms) conversion factor
    let cm_to_time_factor = 85 // Adjust this value based on calibration

    // Definition of the angle (in degree) to time (in ms) conversion factor
    let degree_to_time_factor = 6 // Adjust this value based on calibration

    // Definition of the grey scale analog value to detect black line
    let black_tape_threshold = 300 // Adjust this value based on calibration

    // Default to deskpi_microcar
    select_model(CarModel.deskpi_microcar)


// Blocks for selecting car Model

    /**
      * Force the car model (determines pins used)
      * @param model Model of car; deskpi_microcar
      */
    //% blockId="car_model" block="select car model%model"
    //% weight=2
    //% subcategory=Advanced
    export function select_model(model: CarModel): void
    {
        if(model==CarModel.deskpi_microcar)
        {
            _model = model;
            if (_model == CarModel.deskpi_microcar)
            {
                // Define motor pins for deskpi_microcar
                pin_motor_left_pos = DigitalPin.P13
                pin_motor_left_neg = DigitalPin.P14
                pin_motor_right_pos = DigitalPin.P15
                pin_motor_right_neg = DigitalPin.P16

                // Define ultrasonic sensor pins for deskpi_microcar
                pin_ultrasonic_trigger = DigitalPin.P12
                pin_ultrasonic_echo = DigitalPin.P9
            }
        }
    }

// Motor Blocks

    // Private helper function to stop the car
    function stop(): void
    {
        pins.digitalWritePin(pin_motor_left_pos, 0)
        pins.digitalWritePin(pin_motor_left_neg, 0)
        pins.digitalWritePin(pin_motor_right_pos, 0)
        pins.digitalWritePin(pin_motor_right_neg, 0)
    }

    // Private helper function to move the car forward or backward for a selected duration
    function move_for_ms(direction: CarDirection, milliseconds: number): void
    {
        let pin_pos_direction = 0
        let pin_neg_direction = 0

        if (CarDirection.Forward == direction)
        {
            pin_pos_direction = 0
            pin_neg_direction = 1
        }
        else
        {
            pin_pos_direction = 1
            pin_neg_direction = 0
        }

        pins.digitalWritePin(pin_motor_right_pos, pin_pos_direction)
        pins.digitalWritePin(pin_motor_right_neg, pin_neg_direction)
        pins.digitalWritePin(pin_motor_left_pos, pin_pos_direction)
        pins.digitalWritePin(pin_motor_left_neg, pin_neg_direction)

        // Wait for the specified duration
        basic.pause(milliseconds)

        // Stop the car after moving
        stop()
    }

    // Private helper function to turn the car left or right for a selected duration
    function turn_for_ms(direction: CarTurnDirection, milliseconds: number): void
    {
        let pin_pos_direction = 0
        let pin_neg_direction = 1

        if (CarTurnDirection.Left == direction)
        {
            // Rotate right wheel forward
            pins.digitalWritePin(pin_motor_right_pos, pin_pos_direction)
            pins.digitalWritePin(pin_motor_right_neg, pin_neg_direction)

            // Rotate left wheel backward
            pins.digitalWritePin(pin_motor_left_pos, pin_neg_direction)
            pins.digitalWritePin(pin_motor_left_neg, pin_pos_direction)
        }
        else
        {
            // Rotate right wheel backward
            pins.digitalWritePin(pin_motor_right_pos, pin_neg_direction)
            pins.digitalWritePin(pin_motor_right_neg, pin_pos_direction)

            // Rotate left wheel forward
            pins.digitalWritePin(pin_motor_left_pos, pin_pos_direction)
            pins.digitalWritePin(pin_motor_left_neg, pin_neg_direction)
        }

        // Wait for the specified duration
        basic.pause(milliseconds)

        // Stop the car after moving
        stop()
    }

    /**
     * Black tape threshold value
     * @param black_tape is the threshold value for detecting black tape, eg: 300
     */
    //% blockId="car_line_black_tape_threshold" block="init line black tape threshold %black_tape"
    //% weight=2
    //% subcategory=Advanced
    export function line_black_tape_threshold(black_tape: number) {
        black_tape_threshold = black_tape
    }

    /**
     * Distance to time conversion factor
     * @param factor is the conversion factor from cm to time in ms, eg: 82
     */
    //% blockId="car_distance_to_time_factor" block="init distance to time factor %factor"
    //% weight=1
    //% subcategory=Advanced
    export function distance_to_time_factor(factor: number) {
        cm_to_time_factor = factor
    }

    /**
     * Angle to time conversion factor
     * @param factor is the conversion factor from angle to time in ms, eg: 6
     */
    //% blockId="car_angle_to_time_factor" block="init angle to time factor %factor"
    //% weight=0
    //% subcategory=Advanced
    export function angle_to_time_factor(factor: number) {
        degree_to_time_factor = factor
    }

    /**
      * Move motor(s) forward or backward for a selected duration
      * @param direction select forwards or backwards
      * @param milliseconds duration in milliseconds to drive forward for, then stop. eg: 1000
      */
    //% blockId="Move_Duration" block="move%direction|for%duration|ms"
    //% weight=100
    //% subcategory=Motors
    export function move_duration(direction: CarDirection, milliseconds: number): void
    {
        move_for_ms(direction, milliseconds)
    }

    /**
      * Move motor(s) forward or backward for a selected distance in cm
      * @param direction select forwards or backwards
      * @param distance distance in centimeters to drive forward for, then stop. eg: 10
      */
    //% blockId="Move_Distance" block="move%direction|for%distance|cm"
    //% weight=99
    //% subcategory=Motors
    export function move_distance(direction: CarDirection, distance: number): void
    {
        move_for_ms(direction, distance * cm_to_time_factor)
    }

    /**
      * Turn the car left or right for a selected duration
      * @param direction select left or right
      * @param milliseconds duration in milliseconds to turn the car left or right for, then stop. eg: 500
      */
    //% blockId="Turn_Duration" block="turn%direction|for%duration|ms"
    //% weight=98
    //% subcategory=Motors
    export function turn_duration(direction: CarTurnDirection, milliseconds: number): void
    {
        turn_for_ms(direction, milliseconds)
    }

    /**
      * Turn the car left or right for a selected angle in degrees
      * @param direction select left or right
      * @param angle angle in degrees to turn the car left or right for, then stop. eg: 90
      */
    //% blockId="Turn_Angle" block="turn%direction|for%angle|degrees"
    //% weight=97
    //% subcategory=Motors
    export function turn_angle(direction: CarTurnDirection, angle: number): void
    {
        turn_for_ms(direction, angle * degree_to_time_factor)
    }

// Sensor Blocks

    /**
      * Line sensor black line detection
      * @param line_sensor select left or right
      * @returns true if black line detected, false otherwise
      */
    //% blockId="Get_Line_Detection" block="get line detection%line_sensor"
    //% weight=88
    //% subcategory=Sensors
    export function get_line_detection(line_sensor: CarLineSensor): boolean
    {
        let detection = false

        if (line_sensor == CarLineSensor.Left) {
            let left_line = pins.analogReadPin(pin_line_sensor_left)
            detection = left_line > black_tape_threshold
        } else {
            let right_line = pins.analogReadPin(pin_line_sensor_right)
            detection = right_line > black_tape_threshold
        }

        return detection
    }

    /**
      * Get distance from ultrasonic sensor in cm
      * @returns distance in cm
      */
    //% blockId="Get_Distance_CM" block="get distance in cm"
    //% weight=89
    //% subcategory=Sensors
    export function get_distance_cm(): number
    {
        let distance_cm = sonar.ping(pin_ultrasonic_trigger, pin_ultrasonic_echo, PingUnit.Centimeters)
        return distance_cm
    }
}
