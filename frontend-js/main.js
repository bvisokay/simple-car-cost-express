import RegistrationForm from "./modules/registrationForm"
import ItemSort from "./modules/itemSort"

if (document.querySelector("#registration-form")) {
  new RegistrationForm()
}

if (document.querySelector("#sort-item")) {
  new ItemSort()
}