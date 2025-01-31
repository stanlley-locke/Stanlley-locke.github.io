import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { auth } from "./firebase-config.js";  // Import Firebase Auth

const db = getFirestore();
const usersListDiv = document.getElementById('usersList');
const searchInput = document.getElementById('searchInput');
let allUsers = [];

// Fetch all users from Firestore and display them
const fetchUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            if (doc.id !== auth.currentUser.uid) { // Don't display the current user
                const userItem = document.createElement('div');
                userItem.classList.add('user-item');
                userItem.textContent = user.email || `User ${doc.id}`;
                userItem.addEventListener('click', () => {
                    // Redirect to the chat page with the selected user's ID
                    window.location.href = `chat.html?userId=${doc.id}`;
                });
                usersListDiv.appendChild(userItem);
                allUsers.push({ id: doc.id, ...user });
            }
        });
    } catch (error) {
        console.error("Error fetching users: ", error);
    }
};

// Filter users based on search input
const filterUsers = (searchText) => {
    const filteredUsers = allUsers.filter(user => 
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    
    // Clear the users list before adding the filtered users
    usersListDiv.innerHTML = '';
    
    // Recreate the filtered list of users
    filteredUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        userItem.textContent = user.email || `User ${user.id}`;
        userItem.addEventListener('click', () => {
            // Redirect to the chat page with the selected user's ID
            window.location.href = `chat.html?userId=${user.id}`;
        });
        usersListDiv.appendChild(userItem);
    });
};

// Event listener for the search input
searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.trim();
    filterUsers(searchText);
});

// Call fetchUsers when the page loads
fetchUsers();
