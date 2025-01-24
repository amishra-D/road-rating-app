import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVZ3kQQlXCqFNF8n95CnSucIILjrJKw6Q",
  authDomain: "rorad-ad3f3.firebaseapp.com",
  projectId: "rorad-ad3f3",
  storageBucket: "rorad-ad3f3.appspot.com",
  messagingSenderId: "12253847049",
  appId: "1:12253847049:web:e9184a6f1532875724a2d8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ProfileNameBox = document.getElementById("profile-name");
const RatingBox = document.getElementById("RatingBox");
const ReviewBox = document.getElementById("ReviewBox");
const SourceBox = document.getElementById("SourceBox");
const DestinationBox = document.getElementById("DestinationBox");
const Insbtn = document.getElementById("Insbtn");
const reviewsDiv = document.getElementById("reviews");

// Add Review
async function addReview(event) {
  event.preventDefault();
  const profileName = ProfileNameBox.textContent.trim();
  const profilePicture = localStorage.getItem("profilePicture");
  const rating = parseFloat(RatingBox.value.trim());

  if (!profileName) {
    alert("Profile name is empty");
    return;
  }

  if (isNaN(rating) || rating < 1.0 || rating > 5.0 || !/^\d(\.\d)?$|^[1-4](\.\d)?$|^5(\.0)?$/.test(rating.toString())) {
    alert("Rating must be a number between 1.0 and 5.0, with at most one decimal place.");
    return;
  }

  try {
    await addDoc(collection(db, "roadratings"), {
      ProfileName: profileName,
      ProfilePicture: profilePicture,
      Rating: rating.toFixed(1), // Ensure the format is 0.1f
      Review: ReviewBox.value.trim(),
      Source: SourceBox.value.trim(),
      Destination: DestinationBox.value.trim()
    });
    alert("Review added successfully");
    displayAllReviews();
  } catch (error) {
    alert("Unsuccessful, error: " + error);
  }
}

// Delete Review
async function deleteReview(docId) {
  try {
    await deleteDoc(doc(db, "roadratings", docId));
    alert("Review deleted successfully");
    displayAllReviews();
  } catch (error) {
    alert("Error deleting review: " + error);
  }
}

// Display All Reviews
async function displayAllReviews() {
  reviewsDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "roadratings"));
  const profileName = ProfileNameBox.textContent.trim();

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const isUserReview = data.ProfileName === profileName;
    const reviewHtml = `
      <div class="review-card">
        <div class="review-header">
          <img src="${data.ProfilePicture || 'default-profile-pic.png'}" alt="Profile Picture" class="profile-picture">
          <strong>${data.ProfileName}</strong> | ${data.Source} | ${data.Destination}
          ${
            isUserReview
              ? `<img src="Assets/bin.png" alt="Delete" class="delete-icon" onclick="deleteReview('${doc.id}')">`
              : ""
          }
        </div>
        <div class="review-body">
          <p class="review-rating">Rating: ${parseFloat(data.Rating).toFixed(1)}</p>
          <p class="review-text">${data.Review}</p>
        </div>
      </div>
    `;
    reviewsDiv.innerHTML += reviewHtml;
  });
}

// Attach Event Listeners
Insbtn.addEventListener("click", addReview);
window.deleteReview = deleteReview;
displayAllReviews();
