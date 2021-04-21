import axios from "axios"

export default class RegistrationForm {
  constructor() {
    this._csrf = document.querySelector('[name="_csrf"]').value
    this.form = document.querySelector("#registration-form")
    this.allFields = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    this.username = document.querySelector("#username-register")
    this.username.previousValue = ""
    this.email = document.querySelector("#email-register")
    this.email.previousValue = ""
    this.password = document.querySelector("#password-register")
    this.password.previousValue = ""
    this.username.isUnique = false
    this.email.isUnique = false
    this.events()
  }

  // Events
  events() {
    // listen for form being submitted
    this.form.addEventListener("submit", e => {
      e.preventDefault()
      this.formSubmitHandler()
    })

    // listen for keyup events on the form fields
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.usernameHandler)
    })
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler)
    })
    this.password.addEventListener("keyup", () => {
      this.isDifferent(this.password, this.passwordHandler)
    })
    // listen for blur events on the form fields
    // blur runs when you "exit off of" or a field loses focus
    // this is needed to prevent bug where special charctaer can be typed
    // and then tab key hit very quickly to advance
    // leaving not enough time for validation message
    this.username.addEventListener("blur", () => {
      this.isDifferent(this.username, this.usernameHandler)
    })
    this.email.addEventListener("blur", () => {
      this.isDifferent(this.email, this.emailHandler)
    })
    this.password.addEventListener("blur", () => {
      this.isDifferent(this.password, this.passwordHandler)
    })
  }

  // Methods

  // before we let form submit make sure validation checks have run
  // manually run all validation checks
  formSubmitHandler() {
    this.usernameImmediately()
    this.usernameAfterDelay()
    this.emailAfterDelay()
    this.passwordImmediately()
    this.passwordAfterDelay()

    //if everything is perfect then let the form submit
    if (this.username.isUnique && !this.username.errors && this.email.isUnique && !this.email.errors && !this.password.errors) {
      this.form.submit()
    } else {
    }
  }

  isDifferent(el, handler) {
    //if previous value doesn't equal current value then call the handler
    if (el.previousValue != el.value) {
      // calling handler() points this to global object
      // fix by adding .call(this)
      handler.call(this)
    }
    //update previous value with current value
    el.previousValue = el.value
  }

  // runs after every keystroke that changes field's value
  usernameHandler() {
    // start with clear slate; clear any existing errors on start
    this.username.errors = false
    // call a function that runs validation checks immediately
    this.usernameImmediately()
    // Restart a timer after every keystroke changes the field's value
    clearTimeout(this.username.timer)
    // set a new timer property on the username property
    // set it to a timeout function that runs a function after delay
    this.username.timer = setTimeout(() => this.usernameAfterDelay(), 800)
  }

  // runs after every keystroke that changes field's value
  passwordHandler() {
    // start with clear slate; clear any existing errors on start
    this.password.errors = false
    // call a function that runs validation checks immediately
    this.passwordImmediately()
    // call a function that runs validation checks immediately
    clearTimeout(this.password.timer)
    // set a new timer property on the password property
    // set it to a timeout function that runs a function after delay
    this.password.timer = setTimeout(() => this.passwordAfterDelay(), 800)
  }

  passwordImmediately() {
    if (this.password.value.length > 50) {
      this.showValidationError(this.password, "Password cannot exceed 50 character.")
    }

    if (!this.password.errors) {
      this.hideValidationError(this.password)
    }
  }

  passwordAfterDelay() {
    if (this.password.value.length < 12) {
      this.showValidationError(this.password, "Password must be at least 12 characters.")
    }
  }

  // runs after every keystroke that changes field's value
  emailHandler() {
    // start with clear slate; clear any existing errors on start
    this.email.errors = false
    // call a function that runs validation checks immediately
    clearTimeout(this.email.timer)
    // set a new timer property on the email property
    // set it to a timeout function that runs a function after delay
    this.email.timer = setTimeout(() => this.emailAfterDelay(), 800)
  }

  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "You must provide a valid email address.")
    }
    if (!this.email.errors) {
      axios
        .post("/doesEmailExist", { _csrf: this._csrf, email: this.email.value })
        .then(response => {
          if (response.data) {
            this.email.isUnique = false
            this.showValidationError(this.email, "That email is already being used.")
          } else {
            this.email.isUnique = true
            this.hideValidationError(this.email)
          }
        })
        .catch(() => {
          console.log("Please try again later")
        })
    }
  }

  usernameImmediately() {
    // if the field is not blank
    // and is not an alphanumeric character (is a special character) show error
    if (this.username.value != "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
      this.showValidationError(this.username, "Username can only contain letters and numbers.")
    }

    // if the field is over 30 characters show error
    if (this.username.length > 30) {
      this.showValidationError(this.username, "Username cannot exceed 30 characters.")
    }

    // if there are no errors then run a function to hide the error rectangle
    // pass this function the field or element we are talking about
    if (!this.username.errors) {
      this.hideValidationError(this.username)
    }
  }

  //remove class
  hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidateMessage--visible")
  }

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message
    el.nextElementSibling.classList.add("liveValidateMessage--visible")
    // create a boolean to help remove error if the user removes the special character
    // this is set to true at first and then set to false before validation check begins
    el.errors = true
  }

  // run username validation checks that give the users some time to type
  usernameAfterDelay() {
    // check that it is at least 3 characters
    if (this.username.value.length < 3) {
      this.showValidationError(this.username, "Username must be at least 3 characters.")
    }

    // run axios request if no other errors
    if (!this.username.errors) {
      axios
        .post("/doesUsernameExist", { _csrf: this._csrf, username: this.username.value })
        .then(response => {
          if (response.data) {
            this.showValidationError(this.username, "That username is already taken.")
            // helps prevent form submit if all checks are not met
            this.username.isUnique = false
          } else {
            this.username.isUnique = true
          }
        })
        .catch(() => {
          console.log("Please try again later.")
        }) // closes catch
    } // closes axios if stmt
  } // closes username after delay

  insertValidationElements() {
    this.allFields.forEach(function (el) {
      el.insertAdjacentHTML("afterend", '<div class="alert alert-danger small liveValidateMessage"></div>')
    })
  }
} // closes Registration Form Object
