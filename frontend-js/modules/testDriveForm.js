import TestDriveCar from "./testDriveCar"

// Represents test drive form
export default class TestDriveForm {
  constructor() {
    this.form = document.querySelector("#td-form")
    this.title = document.querySelector("#td-title")
    this.price = document.querySelector("#td-price")
    this.miles = document.querySelector("#td-miles")
    this.link = document.querySelector("#td-link")
    this.tdStore = []
    this.list = document.querySelector("#td-list")
    this.events()
  }

  // events
  events() {
    this.form.addEventListener("submit", e => {
      e.preventDefault()
      console.log("Form Submitted")
      this.formSubmitHandler()
    })
  }

  //methods
  formSubmitHandler() {
    /* console.log("formSubmitHandler Ran") */

    //run validation
    if (this.title.value === "" || this.price.value === "" || this.miles.value === "" || this.link.value === "") {
      console.log("Validation Error")
    } else {
      //instantiate car
      const car = new TestDriveCar(this.title.value, this.price.value, this.miles.value, this.link.value)

      //add car to the UI
      UI.displayBooks()

      //add car to Store
      this.tdStore.push(car)

      //show success message
      console.log("Successfully created: " + car)
      console.log(this.tdStore)

      //clear input fields
      this.clearInputFields()
    }
  }

  clearInputFields() {
    this.form.reset()
    this.title.focus()
  }
}
