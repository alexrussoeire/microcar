{
  // Set car model to deskpi_microcar
  car.select_model(car.CarModel.deskpi_microcar);
  basic.pause(1000);

  // Move 5s forward
  car.move(car.CarMotor.Both, car.CarDirection.Forward);
  basic.pause(5000);

  // Move 5s backward
  car.move(car.CarMotor.Both, car.CarDirection.Backward);
  basic.pause(5000);
}
