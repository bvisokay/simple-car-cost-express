// Car Class:  Represents test drive car

export class TestDriveCar {
  constructor(title, price, miles) {
    this.title = title.trim()
    this.price = parseInt(price, 10)
    this.miles = parseInt(miles, 10)
    // other items not directly defined by user
    this.useful_miles = 150000
    this.monthly_miles = 1250
    this.nrm = Math.round(parseFloat((this.useful_miles - this.miles) / this.monthly_miles))
    this.cprm = parseFloat((parseFloat(this.price, 10) / parseFloat((this.useful_miles - this.miles) / this.monthly_miles)).toFixed(0))
    this.createdDate = new Date()
    this.uniqueId = Math.round(Math.random() * 10000)
  }
}

// Represents test drive form
export class TestDriveForm {
  constructor() {
    this.form = document.querySelector("#td-form")
    this.title = document.querySelector("#td-title")
    this.price = document.querySelector("#td-price")
    this.miles = document.querySelector("#td-miles")
    this.list = document.querySelector("#td-list")
    this.events()
  }

  // EVENTS
  events() {
    // DisplayExistingCars
    document.addEventListener("DOMContentLoaded", this.displayCars())

    // Listen and Handle Form Submit
    this.form.addEventListener("submit", e => {
      e.preventDefault()
      this.formSubmitHandler()
    })

    // Delete a Car
    this.list.addEventListener("click", e => {
      e.preventDefault()
      // remove from Store/Local Storage
      this.removeCar(e.target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"))
      //remove from UI
      this.deleteCar(e.target)
    })
  }

  // METHODS

  deleteCar(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.parentElement.parentElement.remove()
      this.showAlertMsg("Car Deleted", "success")
    } else {
    }
  }

  displayCars() {
    const cars = this.getCars()

    cars.forEach(car => {
      this.addCarToList(car)
    })
  }

  formSubmitHandler() {
    // run simple validation
    if (this.title.value === "" || this.price.value === "" || this.miles.value === "") {
      console.log("Validation Error")
      this.showAlertMsg("Please fill in all fields.", "danger")
    } else {
      // instantiate car
      let car = new TestDriveCar(this.title.value.trim(), this.price.value, this.miles.value)

      // add car to the UI and show sucess message
      this.addCarToList(car)
      this.showAlertMsg("Car Added.", "success")

      // add car to Store
      this.addCar(car)

      // clear input fields
      this.clearInputFields()
    }
  }

  clearInputFields() {
    this.form.reset()
    this.title.focus()
  }

  showAlertMsg(messageToSend, className) {
    const div = document.createElement("div")
    div.className = `alertMsg alert alert-${className}`
    div.appendChild(document.createTextNode(messageToSend))
    const container = document.querySelector(".container--test-drive")
    const form = this.form
    container.insertBefore(div, form)
    // Vanish in 3 Seconds
    setTimeout(() => document.querySelector(".alertMsg").remove(), 3000)
  }

  addCarToList(car) {
    const div = document.createElement("div")
    div.innerHTML = `
    <div class="card mt-5" data-id="${car.uniqueId}">
      <div class="list-group">
        <div class="list-group-item list-group-item-primary">${car.title}<a href="https://${car.link}" target="_blank" class="text-primary mr-2"><i class="ml-2 fas fa-external-link-alt"></i></a><span class="float-right">
        <a href="#" class="btn btn-danger btn-sm delete">X</a>
        </span>
        </div>
        <div class="list-group-item list-group-flush">Price: $${car.price.toLocaleString("en-US")}</div>
        <div class="list-group-item list-group-flush">Miles: ${car.miles.toLocaleString("en-US")}</div>
        <div class="list-group-item list-group-flush">Remaining Months: ${car.nrm}</div>
        <div class="list-group-item list-group-flush">Cost Per Remaining Months: $${car.cprm.toLocaleString("en-US")}</div>
      </div>
    </div>
  `
    /* was this.list.appendChild(div) */
    this.list.insertAdjacentElement("afterbegin", div)
  }

  // Store cars in local storage
  getCars() {
    let cars
    if (localStorage.getItem("cars") === null) {
      cars = []
    } else {
      cars = JSON.parse(localStorage.getItem("cars"))
    }

    return cars
  }

  addCar(car) {
    const cars = this.getCars()
    cars.push(car)
    localStorage.setItem("cars", JSON.stringify(cars))
  }

  removeCar(uniqueId) {
    const cars = this.getCars()

    cars.forEach((car, idx) => {
      if (car.uniqueId.toString() === uniqueId.toString()) {
        cars.splice(idx, 1)
      }
    })
    localStorage.setItem("cars", JSON.stringify(cars))
  }
}
