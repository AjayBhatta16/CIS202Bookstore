const express = require('express')
const cors = require('cors')
const fs = require('fs')

const DataEditor = require('./data-editor')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

let books = new DataEditor('./data/books.json')
let customers = new DataEditor('./data/customers.json')
let sales = new DataEditor('./data/sales-history.json')
let orders = new DataEditor('./data/orders.json')

setInterval(() => {
  orders.handleUnfulfilledOrders()
}, 24*60*60*1000)

app.post('/orders/clear', (req,res) => {
  sales.clearOldSales()
})

app.post('/orders/handle', (req,res) => {
  let data = orders.handleUnfulfilledOrders()
  res.json(data)
})

app.post('/customer/create', (req,res) => {
  customers.createCustomer(
    req.body.name,
    req.body.addr,
    req.body.phone,
    req.body.interests
  )
  res.json({
    message: 'customer created successfully'
  })
})

app.post('/book/search', (req,res) => {
  let data = books.searchBook(
    req.body.field,
    req.body.value
  )
  console.log(data)
  res.json(data)
})

app.post('/book/order', (req,res) => {
  if(req.body.inStock == true) {
    books.buyOffShelf(req.body.isbn)
  } else {
    let customer = customers.getCustomerById(req.body.custID)
    orders.createOrder(
      req.body.isbn,
      customer.name,
      customer.address,
      Date.now(),
      Date.now()+7*24*60*60*1000
    )
  }
  sales.placeOrder(
    req.body.isbn,
    req.body.custID
  )
  res.json({
    message: 'order placed successfully'
  })
})

app.post('/query/interests', (req, res) => { 
  res.json(customers.getCustomersByInterest(req.body.interest))
})

app.post('/query/sales', (req,res) => {
  let relSales = sales.getSalesFromTimeFrame(
    req.body.startDate,
    req.body.endDate
  )
  let custSales = {}
  relSales.forEach(sale => {
    if(!custSales[sale.custID]) {
      custSales[sale.custID] = 0 
    }
    custSales[sale.custID] += book.getBookByIsbn(sale.isbn).price
  })
  let validCustomers = []
  for(const key in custSales) {
    if(custSales[key] >= req.body.minPrice && custSales[key] <= req.body.maxPrice) {
      validCustomers.push(key)
    }
  }
  let data = validCustomers.map(id => customers.getCustomerById(id))
  res.json(data)
})

app.listen(3001)