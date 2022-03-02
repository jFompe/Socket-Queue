const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl()


const socketController = (socket) => {
    
    socket.emit('last-ticket', ticketControl.last)
    socket.emit('current-state', ticketControl.last4)
    socket.emit('pending-tickets', ticketControl.tickets.length)

    socket.on('next-ticket', ( payload, callback ) => {
        
        const next = ticketControl.next()
        callback(next)
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length)

    })

    socket.on('handle-ticket', ({ desktop }, callback) => {
        if (!desktop) {
            return callback({
                ok: false,
                msg: 'Desktop is mandatory'
            })
        }
        
        const ticket = ticketControl.handleTicket(desktop)

        // Notify change in last 4
        socket.broadcast.emit('current-state', ticketControl.last4)
        socket.emit('pending-tickets', ticketControl.tickets.length)
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length)

        if (!ticket) {
            return callback({
                ok: false,
                msg: 'No pending tickets'
            })
        }

        callback({
            ok: true,
            ticket
        })
    })

}



module.exports = {
    socketController
}

