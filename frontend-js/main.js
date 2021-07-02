import RegistrationForm from "./modules/registrationForm"
import ItemSort from "./modules/itemSort"
import { TestDriveCar } from "./modules/testDriveForm"
import { TestDriveForm } from "./modules/testDriveForm"

if (document.querySelector("#registration-form")) {
  new RegistrationForm()
}

if (document.querySelector("#sort-item")) {
  new ItemSort()
}

if (document.querySelector("#td-form")) {
  new TestDriveForm()
}
