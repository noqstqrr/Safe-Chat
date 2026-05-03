const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Putanja do tvog sajta
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// --- TVOJA PODEŠAVANJA ---
let tajnaSifra = "1234"; 
let zabranjeneReci = ["ruzan", "glup", "idiot"]; 
// -------------------------

io.on('connection', (socket) => {
    socket.on('pokusaj_otkljucavanja', (kod) => {
        if (kod === tajnaSifra) {
            socket.emit('otkljucano');
        } else {
            socket.emit('greska', 'Pogrešan kod!');
        }
    });

    socket.on('nova_poruka', (tekst) => {
        let cistTekst = tekst;
        zabranjeneReci.forEach(rec => {
            const regex = new RegExp(rec, "gi");
            cistTekst = cistTekst.replace(regex, "****");
        });
        io.emit('prikazi_poruku', cistTekst);
    });
});

// Render traži ovaj red da bi aplikacija radila
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Aplikacija radi na portu ' + PORT);
});
