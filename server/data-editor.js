const fs = require('fs')
const uuid = require('uuid')

class DataEditor {
  constructor(dataFile) {
    this.dataFile = dataFile
    this.data = ''
    this.openDataFile()
  }
  openDataFile() {
    fs.readFile(this.dataFile, (err, data) => {
      if(err) throw err
      this.data = JSON.parse(data)
    })
  }
  save() {
    fs.writeFile(this.dataFile, JSON.stringify(this.data), err => {
      if(err) console.log(err)
    })
  }
  createCustomer(name, addr, phone, interests) {
    let customer = {
      name: name,
      address: addr,
      phoneNumber: phone,
      readingInterests: interests,
      id: Math.floor(Math.random()*99999999),
      orders: []
    }
    this.data.customers.push(customer)
    this.save()
  }
  searchBook(field, value) {
    let resData = []
    this.data.books.forEach(book => {
      if(book[field] == value) resData.push(book)
    })
    return resData
  }
  buyOffShelf(isbn) {
    this.data.books.forEach(book => {
      if(book.isbn == isbn) book.quantity--
    })
  }
  placeOrder(isbn, customer) {
    this.data.sales.push({
      isbn: isbn,
      custID: customer,
      date: Date.now()
    })
    this.save()
  }
  getCustomersByInterest(topic) {
    let output = []
    this.data.customers.forEach(c => {
      if(c.interests.indexOf(topic) != -1) {
        output.push(c)
      }
    })
    return output
  }
  getBookByIsbn(isbn) {
    return this.data.books.filter(book => book.isbn == isbn)[0]
  }
  getSalesFromTimeFrame(start, end) {
    return this.data.sales.filter(sale => sale.date >= start && sale.date <= end)
  }
  getCustomerById(id) {
    return this.data.customers.filter(c => c.id == id)[0]
  }
  clearOldSales() {
    if(!this.data) return
    this.data.sales = this.data.sales.filter(sale => {
      return Date.now() < sale.date + 365*24*60*60*1000
    })
    this.save()
  }
  createOrder(isbn, customerName, address, orderDate, deliveryDate) {
    this.data.orders.push({
      isbn: isbn,
      name: customerName,
      address: address,
      orderDate: orderDate,
      deliveryDate: deliveryDate,
      orderNumber: null
    })
    this.save()
  }
  handleUnfulfilledOrders() {
    let output = []
    this.data.orders.forEach(order => {
      if(!order.orderNumber) {
        order.orderNumber = Math.floor(Math.random()*9999)
        output.push(order)
      }
    })
    this.save()
    return output
  }
}

module.exports = DataEditor
