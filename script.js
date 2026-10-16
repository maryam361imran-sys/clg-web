// 1. Firebase Configuration (Aapka Asli Data)
const firebaseConfig = {
    apiKey: "AIzaSyDpot5YRJpWll6qGWtNl5YEOnhDUENVdzQ",
    authDomain: "://firebaseapp.com",
    databaseURL: "https://firebaseio.com",
    projectId: "college-portal-695c0",
    storageBucket: "college-portal-695c0.firebasestorage.app",
    messagingSenderId: "557644866574",
    appId: "1:557644866574:web:b6bad6548c60128ffe085f"
};

// 2. Firebase ko Initialize aur Database connect karein
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// State management (Local Join Status)
let isJoined = false;

// 3. Join / Follow Website Button ka Function
function toggleJoin() {
    isJoined = !isJoined;
    const statusText = document.getElementById("joinStatus");
    const joinBtn = document.getElementById("joinBtn");

    if (isJoined) {
        statusText.innerText = "Status: Joined 🎉 (You will receive updates)";
        statusText.style.color = "green";
        joinBtn.innerText = "Unfollow";
    } else {
        statusText.innerText = "Status: Not Joined";
        statusText.style.color = "red";
        joinBtn.innerText = "Join / Follow Website";
    }
    
    // Status badalne par messages ko dobara check karein
    listenForMessages();
}

// 4. Admin Panel - Internet (Firebase) par message bhejna
function broadcastMessage() {
    const messageInput = document.getElementById("adminInput");
    const messageText = messageInput.value.trim();

    if (messageText === "") {
        alert("Please type a message first!");
        return;
    }

    // Firebase database ke 'announcements' folder me message save karna
    database.ref('announcements').push({
        text: messageText,
        timestamp: Date.now()
    }).then(() => {
        messageInput.value = ""; // Message box ko khali karein
        alert("Message Broadcasted Globally! 📢");
    }).catch((error) => {
        console.error("Error sending message: ", error);
        alert("Database connection error! Check if Test Mode is enabled.");
    });
}

// 5. Live Notices - Firebase se real-time messages uthana aur dikhana
function listenForMessages() {
    const noticeBoard = document.getElementById("noticeBoard");
    
    // Agar user ne website join nahi ki toh message block karo
    if (!isJoined) {
        noticeBoard.innerHTML = "<p style='color: red; font-weight: bold;'>⚠️ Please JOIN the website above to see the official messages/announcements.</p>";
        return;
    }

    // Firebase se live data har waqt sunna (Real-time update)
    database.ref('announcements').on('value', (snapshot) => {
        const data = snapshot.val();
        
        if (!data) {
            noticeBoard.innerHTML = "<p>No new announcements yet.</p>";
            return;
        }

        let htmlContent = "<ul>";
        // Loop chalakar saare messages ulte order (newest first) me convert karna
        Object.values(data).reverse().forEach(msg => {
            htmlContent += `<li style="margin-bottom: 10px; font-size: 16px;">📢 ${msg.text}</li>`;
        });
        htmlContent += "</ul>";
        
        noticeBoard.innerHTML = htmlContent;
    });
}

// 6. Online Attendance ki temporary screen update
function markAttendance() {
    document.getElementById("attendanceStatus").innerText = "✅ Attendance marked successfully for today!";
}

// Website khulte hi messages sunna shuru karein
listenForMessages();
