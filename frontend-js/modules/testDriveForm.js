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
    this.allFields = document.querySelectorAll("#td-form .form-control")
    this.insertValidationElements()
    this.title = document.querySelector("#td-title")
    this.price = document.querySelector("#td-price")
    this.miles = document.querySelector("#td-miles")
    this.title.previousValue = ""
    this.miles.previousValue = ""
    this.price.previousValue = ""
    this.list = document.querySelector("#td-list")
    this.events()
  }

  // EVENTS
  events() {
    // Listen and Handle Form Submit
    this.form.addEventListener("submit", e => {
      e.preventDefault()
      this.formSubmitHandler()
    })

    // DisplayExistingCars
    document.addEventListener("DOMContentLoaded", this.displayCars())

    // Listen to Description Field
    this.title.addEventListener("keyup", () => {
      this.isDifferent(this.title, this.titleCheck)
    })

    // Listen to Price Field
    this.price.addEventListener("keyup", () => {
      this.isDifferent(this.price, this.priceCheck)
    })

    // Listen to Miles Field
    this.miles.addEventListener("keyup", () => {
      this.isDifferent(this.miles, this.milesCheck)
      console.log("keyup ran")
    })

    // Listen to Description Field
    this.title.addEventListener("blur", () => {
      this.isDifferent(this.title, this.titleCheck)
    })

    // Listen to Price Field
    this.price.addEventListener("blur", () => {
      this.isDifferent(this.price, this.priceCheck)
    })

    // Listen to Miles Field
    /*  this.miles.addEventListener("blur", () => {
      this.isDifferent(this.miles, this.milesCheck)
      console.log("blur ran")
    }) */

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

  // triggers recheck after field changes
  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this)
    }
    el.previousValue = el.value
  }

  // logic for field triggering error message
  titleCheck() {
    this.title.errors = false
    this.titleImmediately()
    //clear timeout
    clearTimeout(this.title.timer)
    this.title.timer = setTimeout(() => this.titleAfterDelay(), 800)
  }

  titleImmediately() {
    if (!this.title.errors) {
      this.hideValidationError(this.title)
    }
    if (this.title.value.length > 40) {
      this.showValidationError(this.title, "Description Cannot Exceed 40 characters.")
    }
  }

  titleAfterDelay() {
    if (this.title.value.length != "" && this.title.value.length < 1) {
      this.showValidationError(this.title, "Please provide a description.")
    }
  }

  priceCheck() {
    this.price.errors = false
    this.priceImmediately()
    clearTimeout(this.price.timer)
    this.price.timer = setTimeout(() => {
      this.priceAfterDelay()
    }, 800)
  }

  priceImmediately() {
    if (!this.price.errors) {
      this.hideValidationError(this.price)
    }
    if (this.price.value > 149999) {
      this.showValidationError(this.price, "The price cannot exceed 149,999")
    }
  }

  priceAfterDelay() {
    if (this.price.value != "" && this.price.value <= 0) {
      this.showValidationError(this.price, "Please provide a price greater than 0.")
    }
    if (this.price.value != "" && this.price.value.length < 1) {
      this.showValidationError(this.price, "Please provide a price.")
    }
  }

  milesCheck() {
    this.miles.errors = false
    this.milesImmediately()
    //clear timeout
    clearTimeout(this.miles.timer)
    this.miles.timer = setTimeout(() => this.milesAfterDelay(), 800)
  }

  milesImmediately() {
    if (!this.miles.errors) {
      this.hideValidationError(this.miles)
    }
    if (this.miles.value > 149999) {
      this.showValidationError(this.miles, "Miles Cannot Exceed 149,999.")
    }
  }

  milesAfterDelay() {
    /* if (this.miles.value == "") {
      this.showValidationError(this.miles, "Please provide a value for the miles.")
    } */
    if (this.miles.value != "" && this.miles.value <= 0) {
      this.showValidationError(this.miles, "Please provide a value greater than 0.")
    }
    if (this.miles.value.length != "" && this.miles.value.length < 1) {
      this.showValidationError(this.miles, "Please provide a value.")
    }
  }

  /* More Methods */

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message
    el.nextElementSibling.classList.add("liveValidateMessage--visible")
    el.errors = true
  }

  hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidateMessage--visible")
    el.errors = false
  }

  // Add actual error message
  insertValidationElements() {
    this.allFields.forEach(function (el) {
      el.insertAdjacentHTML("afterend", '<div class="alert alert-danger small liveValidateMessage"></div>')
    })
  }

  deleteCar(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.parentElement.parentElement.remove()
      this.showAlertMsg("Car Succesfully Deleted", "success")
    } else {
    }
  }

  displayCars() {
    const cars = this.getCars()

    cars.forEach(car => {
      this.addCarToList(car)
    })
  }

  // before we let form submit make sure validation checks have run
  // manually run all validation checks
  formSubmitHandler() {
    this.titleImmediately()
    this.titleAfterDelay()
    this.priceImmediately()
    this.priceAfterDelay()
    this.milesImmediately()
    this.milesAfterDelay()

    // if everything is perfect then create the car
    if (!this.title.errors && !this.price.errors && !this.miles.errors) {
      // cleanup miles field if left blank
      if (this.title.value == "") {
        this.title.value = "Example Title (Field Left Blank)"
      }
      if (this.price.value == "") {
        this.price.value = Math.round(Math.random() * 150000)
      }
      if (this.miles.value == "") {
        this.miles.value = Math.round(Math.random() * 150000)
      }

      // instantiate car
      let car = new TestDriveCar(this.title.value.trim(), this.price.value, this.miles.value)

      // add car to the UI and show sucess message
      this.addCarToList(car)
      this.showAlertMsg("Car Added.", "success")

      // add car to Store
      this.addCar(car)

      // reset validation
      this.title.previousValue = ""
      this.miles.previousValue = ""
      this.price.previousValue = ""

      // clear input fields
      this.clearInputFields()
    } else {
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
    <div class="card test-drive-card mt-5" data-id="${car.uniqueId}">
      <div class="list-group">
        <div class="list-group-item list-group-item-primary">${car.title}<span>
        <a href="#" class="btn btn-danger btn-sm delete">X</i></a>
        </span>
        </div>
        <div class="list-group-item list-group-flush">Price: $${car.price.toLocaleString("en-US")}</div>
        <div class="list-group-item list-group-flush">Miles: ${car.miles.toLocaleString("en-US")}</div>
        <div class="list-group-item list-group-flush">Remaining Months: ${car.nrm} <span class="text-muted small">~${(car.nrm / 12).toFixed(1)} Years</span></div>
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
