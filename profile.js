import { auth } from "./firebase-config.js";  // Import Firebase Auth
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const saveProfileBtn = document.getElementById('saveProfileBtn');
const profilePicInput = document.getElementById('profilePicInput');
const profileImage = document.getElementById('profileImage');
const about = document.getElementById('about');

// Get Firebase Storage and Firestore instances
const storage = getStorage();
const db = getFirestore();

// Fetch user's profile data from Firestore when they visit the profile page
const fetchProfileData = async () => {
    try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profilePicture) {
                profileImage.src = userData.profilePicture;  // Set profile picture
            }
            if (userData.about) {
                about.value = userData.about;  // Set About Me text
            }
        }
    } catch (error) {
        console.error("Error fetching user data: ", error);
    }
};

// Handle Profile Picture Upload
profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const storageRef = ref(storage, 'profile_pictures/' + auth.currentUser.uid);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // You can track upload progress here if needed
            },
            (error) => {
                console.log("Error uploading image: ", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    profileImage.src = downloadURL;  // Update profile image preview
                    saveProfileBtn.disabled = false;  // Enable Save button after image is uploaded
                });
            }
        );
    }
});

// Save Profile Info (Profile Picture and About Me) to Firestore
saveProfileBtn.addEventListener('click', async () => {
    const aboutText = about.value.trim();

    // Save Profile Picture URL and About Info in Firestore
    const userRef = doc(db, 'users', auth.currentUser.uid);

    try {
        await setDoc(userRef, {
            profilePicture: profileImage.src,  // Save profile image URL
            about: aboutText  // Save about text
        }, { merge: true });  // Use merge to preserve other data if any

        alert("Profile saved successfully!");
        window.location.href = "users.html";  // Redirect to chat page after saving profile
    } catch (error) {
        console.error("Error saving profile: ", error);
    }
});

// Call fetchProfileData when the page loads
fetchProfileData();
