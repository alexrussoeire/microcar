{
  // Set car model to deskpi_microcar
  car.select_model(CarModel.deskpi_microcar);
  basic.pause(1000);

  // Move 5s forward
  car.move(CarMotor.Both, CarDirection.Forward);
  basic.pause(5000);

  // Move 5s backward
  car.move(CarMotor.Both, CarDirection.Backward);
  basic.pause(5000);
}
