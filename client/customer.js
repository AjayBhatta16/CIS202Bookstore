document.querySelector('button').addEventListener('click', (e) => {
  e.preventDefault()
  let data = {
    name: document.querySelector('#name').value,
    addr: document.querySelector('#address').value,
    phone: document.querySelector('#phone').value,
    interests: document.querySelector('#readinginterests').value
  }
  fetch('https://bookstorebackend.ajaybhatta49.repl.co/customer/create', {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
  }).then(res => {
    alert("Customer created successfully")
    window.location = '/'
  })
})