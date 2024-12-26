// Handle room booking form submission
document.getElementById('adding_guest').addEventListener('submit', function (e) {
    fetch('http://localhost:3307/api/add-guest')

    e.preventDefault(); 
    const firstName = document.getElementById('firstname').value;
        const lastName = document.getElementById('lastname').value;
        const email = document.getElementById('guestemail').value;
        const phoneNumber = document.getElementById('phonenumber').value;

        const guestData = {
            firstName,
            lastName,
            email,
            phoneNumber,
          
        };


    // Send booking data to server
    fetch('http://localhost:3307/api/add-guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestData),
    })
        .then((response) => response.json())
        .then((data) => {
            alert('Guest Added successfully!');
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
//--------------------------------------


// Fetch rooms when the button is clicked
document.getElementById('loadRoomsBtn').addEventListener('click', function () {
    fetch('http://localhost:3307/api/get-rooms')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((rooms) => {
            console.log(rooms); 
            const roomsTable = document.getElementById('roomsTable').getElementsByTagName('tbody')[0];
            roomsTable.innerHTML = ''; 
            rooms.forEach((room) => {
                const row = roomsTable.insertRow();
                row.insertCell(0).textContent = room.room_number;
                row.insertCell(1).textContent = room.room_type;
                row.insertCell(2).textContent = room.price_per_night;
                row.insertCell(3).textContent = room.is_available ? 'Available' : 'Booked';
            });
        })
        .catch((error) => {
            console.error('Error fetching rooms:', error);
        });
});



