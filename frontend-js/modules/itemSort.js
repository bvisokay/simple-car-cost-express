import axios from "axios"

export default class ItemSort {
  // select Dom elements and keep track of any useful data
  constructor() {
    this.selectBox = document.querySelector("#sort-item")

    this.listGroup = document.querySelector(".list-group")
    this.items = document.querySelectorAll(".card")
    this.itemsArr = []
    this.events()
  }

  // events
  events() {
    this.selectBox.addEventListener("change", () => {
      if (this.selectBox.value == "created_date_asc") {
        this.newest_first()
      }
      if (this.selectBox.value == "cost_per_asc") {
        this.lowest_cost_per_first()
      }
      if (this.selectBox.value == "cost_per_desc") {
        this.highest_cost_per_first()
      }
      if (this.selectBox.value == "mos_remain_asc") {
        this.lowest_months_rem_first()
      }
      if (this.selectBox.value == "mos_remain_desc") {
        this.highest_months_rem_first()
      }
      if (this.selectBox.value == "cost_asc") {
        this.lowest_price_first()
      }
      if (this.selectBox.value == "cost_desc") {
        this.highest_price_first()
      }
      if (this.selectBox.value == "miles_asc") {
        this.lowest_miles_first()
      }
      if (this.selectBox.value == "miles_desc") {
        this.highest_miles_first()
      }
    }) // closes change event listener
  } // closes events block

  // methods

  // 1.)
  newest_first() {
    console.log(this.items)
    console.log(this.selectBox.value)
    location.reload()
  } // closes newest first function

  // 2.)
  lowest_cost_per_first() {
    //console.log("lowest_cost_per_first function ran")
    //console.log(this.items[0].children[4].children[0].innerHTML)

    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[4].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[4].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[4].children[0].innerHTML.replace(/,/g, "")) > parseFloat(b.children[4].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes lowest_cost_per_first function

  // 3.)
  highest_cost_per_first() {
    //console.log("lowest_cost_per_first function ran")
    //console.log(this.items[0].children[4].children[0].innerHTML)

    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[4].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[4].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[4].children[0].innerHTML.replace(/,/g, "")) < parseFloat(b.children[4].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes highest_cost_per_first function

  // 4.)
  lowest_months_rem_first() {
    //console.log("lowest_cost_per_first function ran")
    //console.log(this.items[0].children[4].children[0].innerHTML)

    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[3].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[3].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[3].children[0].innerHTML.replace(/,/g, "")) > parseFloat(b.children[3].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes lowest_months_rem_first function

  // 5.)
  highest_months_rem_first() {
    //console.log("lowest_cost_per_first function ran")
    //console.log(this.items[0].children[4].children[0].innerHTML)

    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[3].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[3].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[3].children[0].innerHTML.replace(/,/g, "")) < parseFloat(b.children[3].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes highest_months_rem_first function

  // 6.)
  lowest_price_first() {
    //console.log("lowest_cost_per_first function ran")
    //console.log(this.items[0].children[4].children[0].innerHTML)

    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[1].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[1].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[1].children[0].innerHTML.replace(/,/g, "")) > parseFloat(b.children[1].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes lowest_price_first function

  // 7.)
  highest_price_first() {
    //console.log("lowest_cost_per_first function ran")
    //console.log(this.items[0].children[4].children[0].innerHTML)

    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[1].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[1].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[1].children[0].innerHTML.replace(/,/g, "")) < parseFloat(b.children[1].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes highest_price_first function

  // 8.)
  lowest_miles_first() {
    // console.log("lowest_miles_first function ran")
    // console.log(this.items[0].children[2].children[0].innerHTML)

    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[2].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[2].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[2].children[0].innerHTML.replace(/,/g, "")) > parseFloat(b.children[2].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes lowest miles first function

  // 9.)
  highest_miles_first() {
    // push card items into ItemsArr and get rid of the whitespace text nodes
    this.items.forEach(x => {
      if (x.nodeType == 1) {
        this.itemsArr.push(x)
      }
    })

    // sort cards in itemsArr
    // parseFloat to number, dig through dom to find value
    // convert 1,500 to 1500 so sort works as expected
    this.itemsArr.sort(function (a, b) {
      return parseFloat(a.children[2].children[0].innerHTML.replace(/,/g, "")) == parseFloat(b.children[2].children[0].innerHTML.replace(/,/g, "")) ? 0 : parseFloat(a.children[2].children[0].innerHTML.replace(/,/g, "")) < parseFloat(b.children[2].children[0].innerHTML.replace(/,/g, "")) ? 1 : -1
    })

    // actually swap out dom
    this.itemsArr.forEach(x => {
      this.listGroup.appendChild(x)
    })
  } // closes highest miles first function
} // Closes ItemSort Object
