
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
async function addReview(event) {
  event.preventDefault();
  if (!ProfileNameBox.textContent.trim()) {
    alert("Profile name is empty");
    return;
  }

  try {
    await addDoc(collection(db, "roadratings"), {
      ProfileName: ProfileNameBox.textContent.trim(),
      Rating: RatingBox.value,
      Review: ReviewBox.value,
      Source: SourceBox.value,
      Destination: DestinationBox.value
    });
    alert("Review added successfully");
    displayAllReviews();
  } catch (error) {
    alert("Unsuccessful, error: " + error);
  }
}

async function displayAllReviews() {
  reviewsDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "roadratings"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const reviewHtml = `
      <div class="review-card">
        <div class="review-header">
          <strong>${data.ProfileName}</strong> | ${data.Source} | ${data.Destination}
        </div>
        <div class="review-body">
          <p class="review-rating">Rating: ${data.Rating}</p>
          <p class="review-text">${data.Review}</p>
        </div>
      </div>
    `;
    reviewsDiv.innerHTML += reviewHtml;
  });
}

Insbtn.addEventListener("click", addReview);
displayAllReviews();