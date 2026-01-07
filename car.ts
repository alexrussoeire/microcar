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
 * Custom blocks
 */
//% weight=50 color=#e7660b icon="\uf1b9"
//% groups='["Motors", "Advanced"]'
namespace car
{

/////

    // Definition of the default car model
    let _model = CarModel.deskpi_microcar

    // Definition of the IO pings used for the motors
    let motor_left_pos_pin: DigitalPin
    let motor_left_neg_pin: DigitalPin
    let motor_right_pos_pin: DigitalPin
    let motor_right_neg_pin: DigitalPin

    // Definition of the distance (in cm) to time (in ms) conversion factor
    let cm_to_time_factor = 85 // Adjust this value based on calibration

    // Definition of the angle (in degree) to time (in ms) conversion factor
    let degree_to_time_factor = 6 // Adjust this value based on calibration

    // Default to deskpi_microcar
    select_model(CarModel.deskpi_microcar)


// Blocks for selecting car Model

    /**
      * Force the car model (determines pins used)
      * @param model Model of car; deskpi_microcar
      */
    //% blockId="car_model" block="select car model%model"
    //% weight=0
    //% subcategory=Advanced
    export function select_model(model: CarModel): void
    {
        if(model==CarModel.deskpi_microcar)
        {
            _model = model;
            if (_model == CarModel.deskpi_microcar)
            {
                motor_left_pos_pin = DigitalPin.P13
                motor_left_neg_pin = DigitalPin.P14
                motor_right_pos_pin = DigitalPin.P15
                motor_right_neg_pin = DigitalPin.P16
            }
        }
    }

// Motor Blocks

    // Private helper function to stop the car
    function stop(): void
    {
        pins.digitalWritePin(motor_left_pos_pin, 0)
        pins.digitalWritePin(motor_left_neg_pin, 0)
        pins.digitalWritePin(motor_right_pos_pin, 0)
        pins.digitalWritePin(motor_right_neg_pin, 0)
    }

    // Private helper function to move the car forward or backward for a selected duration
    function move_for_ms(direction: CarDirection, milliseconds: number): void
    {
        let pos_pin_direction = 0
        let neg_pin_direction = 0

        if (CarDirection.Forward == direction)
        {
            pos_pin_direction = 0
            neg_pin_direction = 1
        }
        else
        {
            pos_pin_direction = 1
            neg_pin_direction = 0
        }

        pins.digitalWritePin(motor_right_pos_pin, pos_pin_direction)
        pins.digitalWritePin(motor_right_neg_pin, neg_pin_direction)
        pins.digitalWritePin(motor_left_pos_pin, pos_pin_direction)
        pins.digitalWritePin(motor_left_neg_pin, neg_pin_direction)

        // Wait for the specified duration
        basic.pause(milliseconds)

        // Stop the car after moving
        stop()
    }

    // Private helper function to turn the car left or right for a selected duration
    function turn_for_ms(direction: CarTurnDirection, milliseconds: number): void
    {
        let pos_pin_direction = 0
        let neg_pin_direction = 1

        if (CarTurnDirection.Left == direction)
        {
            // Rotate right wheel forward
            pins.digitalWritePin(motor_right_pos_pin, pos_pin_direction)
            pins.digitalWritePin(motor_right_neg_pin, neg_pin_direction)

            // Rotate left wheel backward
            pins.digitalWritePin(motor_left_pos_pin, neg_pin_direction)
            pins.digitalWritePin(motor_left_neg_pin, pos_pin_direction)
        }
        else
        {
            // Rotate right wheel backward
            pins.digitalWritePin(motor_right_pos_pin, neg_pin_direction)
            pins.digitalWritePin(motor_right_neg_pin, pos_pin_direction)

            // Rotate left wheel forward
            pins.digitalWritePin(motor_left_pos_pin, pos_pin_direction)
            pins.digitalWritePin(motor_left_neg_pin, neg_pin_direction)
        }

        // Wait for the specified duration
        basic.pause(milliseconds)

        // Stop the car after moving
        stop()
    }

    /**
     * Distance to time conversion factor
     * @param factor is the conversion factor from cm to time in ms, eg: 82
     */
    //% blockId="car_distance_to_time_factor" block="init distance to time factor %factor"
    //% weight=100
    //% subcategory=Advanced
    export function distance_to_time_factor(factor: number) {
        cm_to_time_factor = factor
    }

    /**
     * Angle to time conversion factor
     * @param factor is the conversion factor from angle to time in ms, eg: 6
     */
    //% blockId="car_angle_to_time_factor" block="init angle to time factor %factor"
    //% weight=100
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
}
