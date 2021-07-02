//Represents test drive car

export default class TestDriveCar {
  constructor(title, price, miles, link) {
    this.title = title
    this.price = parseInt(price)
    this.miles = parseInt(miles)
    this.link = link
  }
}
