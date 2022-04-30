document.querySelector('body').style.backgroundColor='#333'

document.querySelector('#search > form > button').addEventListener('click', (e) => {
  e.preventDefault()
  let searchBy = document.querySelector('#searchby')
  let data = {
    field: searchBy.options[searchBy.selectedIndex].text.toLowerCase(),
    value: document.querySelector('#value').value
  }
  fetch('https://bookstorebackend.ajaybhatta49.repl.co/book/search', {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
  }).then(res => {
    return res.json()
  }).then(res => {
    console.log(res)
    document.querySelector('#search').setAttribute("hidden", "")
    document.querySelector('#results').removeAttribute("hidden")
    res.forEach(obj => {
      document.querySelector('#results').innerHTML += createBookDisplay(obj)
    })
    let orderButton = document.querySelector('#results > div > div > button')
    orderButton.addEventListener('click', (e) => {
      e.preventDefault()
      console.log(orderButton)
      let isbn = orderButton.dataset.isbn
      let title = orderButton.dataset.title
      let quantity = orderButton.dataset.quantity
      console.log(isbn)
      document.querySelector('#results').setAttribute("hidden", "")
      document.querySelector('#order').removeAttribute("hidden")
      document.querySelector('#bookname').textContent = `Book: ${title} (${isbn})`
      document.querySelector('#price').textContent = `Total: ${orderButton.dataset.price}`
      document.querySelector('#order > form > button').addEventListener('click', e => {
        e.preventDefault()
        let data = {
          isbn: isbn,
          custID: document.querySelector('#custID').value,
          inStock: quantity == 0 ? false : true
        }
        fetch('https://bookstorebackend.ajaybhatta49.repl.co/book/order', {
          method: "POST",
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify(data)
        }).then(res => {
          alert("Order placed successfully")
          window.location = '/'
        })
      })
    })
  })
})


function createBookDisplay(book) {
  return `
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Title: ${book.title}</h3>
    <ul>
      <li>Author: ${book.author}</li>
      <li>Publisher: ${book.publisher}</li>
      <li>ISBN: ${book.isbn}</li>
      <li>Categories: ${book.category}</li>
      <li>Shelf Location: ${book.shelfLoc}</li>
      <li>Price: $${book.price}</li>
      <li>Amount in stock: ${book.quantity}</li>
    </ul>
    <button class="btn btn-primary" data-isbn=${book.isbn} data-quantity=${book.quantity} data-price=${book.price} data-title=${book.title}>Order</button>
  </div>
</div>
  `
}