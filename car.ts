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
//% groups='["Motors", "car_model"]'
namespace car
{

/////

    let _model = CarModel.deskpi_microcar

    let motor_left_pos_pin: DigitalPin
    let motor_left_neg_pin: DigitalPin
    let motor_right_pos_pin: DigitalPin
    let motor_right_neg_pin: DigitalPin

    // Default to deskpi_microcar
    select_model(CarModel.deskpi_microcar)


// Blocks for selecting car Model

    /**
      * Force the car model (determines pins used)
      * @param model Model of car; deskpi_microcar
      */
    //% blockId="car_model" block="select car model%model"
    //% weight=100
    //% subcategory=car_model
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

    /**
      * Move motor(s) forward or backward
      * @param direction select forwards or backwards
      */
    //% blockId="Move" block="move%direction|"
    //% weight=50
    //% subcategory=Motors
    export function move(direction: CarDirection): void
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
    }

    /**
      * Turn the car left or right by driving motors in opposite directions
      * @param direction select left or right
      */
    //% blockId="Turn" block="turn%direction|"
    //% weight=60
    //% subcategory=Motors
    export function turn(direction: CarTurnDirection): void
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
    }

    /**
      * Stop the car by stopping both motors
      */
    //% blockId="Stop" block="stop car"
    //% weight=50
    //% subcategory=Motors
    export function stop(): void
    {
        pins.digitalWritePin(motor_left_pos_pin, 0)
        pins.digitalWritePin(motor_left_neg_pin, 0)
        pins.digitalWritePin(motor_right_pos_pin, 0)
        pins.digitalWritePin(motor_right_neg_pin, 0)
    }
}
