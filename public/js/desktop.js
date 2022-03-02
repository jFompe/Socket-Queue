// References HTML
const lblDesktop = document.querySelector('h1')
const btnHandle = document.querySelector('button')
const lblTicket = document.querySelector('small')
const divAlert = document.querySelector('.alert')
const lblPending = document.querySelector('#lblPendientes')


const searchParams = new URLSearchParams(window.location.search)

if (!searchParams.has('desktop')) {
  window.location = 'index.html'
  throw new Error('Desktop is mandatory')
}

const desktop = searchParams.get('desktop')
lblDesktop.innerText = desktop

divAlert.style.display = 'none'


const socket = io();



socket.on('connect', () => {
  btnHandle.disabled = false;
});


socket.on('disconnect', () => {
  btnHandle.disabled = true
});

socket.on('pending-tickets', (pending) => {
  if (!pending) {
    lblPending.style.display = 'none'
    return
  }
  
  lblPending.style.display = ''
  lblPending.innerText = pending
})

btnHandle.addEventListener( 'click', () => {

  socket.emit('handle-ticket', { desktop }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = 'Noone'
      divAlert.style.display = ''
      return
    }

    lblTicket.innerText = `Ticket ${ticket.number}`
  })


  // socket.emit('next-ticket', null, ( ticket ) => {
  //     console.log('Desde el server', ticket );
  //     lblNewTicket.innerText = ticket
  // });

});