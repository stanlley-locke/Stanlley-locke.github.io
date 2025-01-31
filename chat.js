// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDXfyMFl1Z_FpoS2YXwz2DHaxW1CmJLJy0",
    authDomain: "gitpages-b9241.firebaseapp.com",
    projectId: "gitpages-b9241",
    storageBucket: "gitpages-b9241.firebasestorage.app",
    messagingSenderId: "652265465365",
    appId: "1:652265465365:web:5f05f9f4df3952a36a101c"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Get the current user and the selected user for chat
const currentUser = auth.currentUser;
const selectedUser = JSON.parse(localStorage.getItem('selectedUser'));

// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messagesContainer');
const fileInput = document.getElementById('fileInput');
const logoutBtn = document.getElementById('logout-btn');

// Display the selected user's name and profile picture
document.getElementById('chat-user-name').textContent = selectedUser.username;
document.getElementById('chat-user-img').src = selectedUser.profilePicture;

// Function to log out the current user
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';  // Redirect to login page
    });
});

// Firestore reference for storing messages
const messagesRef = db.collection('chats')
    .doc(currentUser.uid)
    .collection(selectedUser.id);

// Real-time listener for messages
messagesRef.orderBy('timestamp').onSnapshot(snapshot => {
    messagesContainer.innerHTML = '';
    snapshot.forEach(doc => {
        const message = doc.data();
        const messageElem = document.createElement('div');
        messageElem.classList.add('message', message.senderId === currentUser.uid ? 'sent' : 'received');
        messageElem.innerHTML = `
            <div class="message-content">${message.text}</div>
            ${message.image ? `<img src="${message.image}" alt="Image" class="message-image">` : ''}
        `;
        messagesContainer.appendChild(messageElem);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;  // Scroll to bottom
    });
});

// Send message
sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
        sendMessage(text);
    }
});

// Send message function (with or without an image)
function sendMessage(text, imageUrl = null) {
    const messageData = {
        text,
        senderId: currentUser.uid,
        receiverId: selectedUser.id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        image: imageUrl || null
    };

    // Add message to both users' chat collection
    db.collection('chats').doc(currentUser.uid).collection(selectedUser.id).add(messageData);
    db.collection('chats').doc(selectedUser.id).collection(currentUser.uid).add(messageData);

    messageInput.value = ''; // Clear the input field
}

// Image upload
fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const storageRef = storage.ref('chat-images/' + file.name);
        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                sendMessage('', url); // Send the image URL as a message
            });
        });
    }
});
