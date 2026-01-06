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
//% groups='["car_model", "Motors"]'
namespace car
{

/////

    let _model = CarModel.deskpi_microcar

    let motor_left_pos_pin: DigitalPin
    let motor_left_neg_pin: DigitalPin
    let motor_right_pos_pin: DigitalPin
    let motor_right_neg_pin: DigitalPin


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
      * Move individual motors forward or backward
      * @param motor motor to drive
      * @param direction select forwards or backwards
      */
    //% blockId="BBMove" block="move%motor|motor(s)%direction|\\%"
    //% weight=50
    //% subcategory=Motors
    export function move(motor: CarMotor, direction: CarDirection): void
    {
        let pos_pin_direction = 0
        let neg_pin_direction = 0

        if (CarDirection.Forward == direction)
        {
            let pos_pin_direction = 0
            let neg_pin_direction = 1
        }
        else
        {
            let pos_pin_direction = 1
            let neg_pin_direction = 0
        }

        if (motor == CarMotor.Left)
        {
            pins.digitalWritePin(motor_left_pos_pin, pos_pin_direction)
            pins.digitalWritePin(motor_left_neg_pin, neg_pin_direction)
        }

        if (motor == CarMotor.Right)
        {
            pins.digitalWritePin(motor_right_pos_pin, pos_pin_direction)
            pins.digitalWritePin(motor_right_neg_pin, neg_pin_direction)
        }

        if (motor == CarMotor.Both)
        {
            pins.digitalWritePin(motor_right_pos_pin, pos_pin_direction)
            pins.digitalWritePin(motor_right_neg_pin, neg_pin_direction)
            pins.digitalWritePin(motor_left_pos_pin, pos_pin_direction)
            pins.digitalWritePin(motor_left_neg_pin, neg_pin_direction)
        }
    }
}
