{
  // Set car model to deskpi_microcar
  car.select_model(CarModel.deskpi_microcar);
  basic.pause(1000);

  // Move 5s forward
    car.move_duration(CarDirection.Forward, 1000);
  basic.pause(5000);

  // Move 5s backward
    car.move_duration(CarDirection.Backward, 1000);
  basic.pause(5000);
}
