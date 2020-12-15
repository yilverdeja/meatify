const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("loginBtn");
const profileBtn = document.getElementById("profileBtn");

// result.html
const chickenBreastFunFact = document.getElementById("chickenBreastFunFact"); //span tag
const recipeOfTheDay = document.getElementById("recipeOfTheDay"); //a tag

// loading.html
const loadingText = document.getElementById("loadingText"); // span tag

const provider = new firebase.auth.GoogleAuthProvider();

loginBtn.onclick = () => {
    const signInString = "<strong>Sign In</strong>";
    const signOutString = "<strong>Sign Out</strong>";

    // if === doesn't work, try localeCompare
    if (loginBtn.innerHTML === signInString) {
        auth.signInWithPopup(provider);
    } else if (loginBtn.innerHTML === signOutString) {
        auth.signOut();
    }
}

auth.onAuthStateChanged(user => {
    if (user){
        // AUTH
        // change "Sign In" to "Sign out"
        loginBtn.innerHTML = "<strong>Sign Out</strong>"
        // change "Try now" to "Profile"
        profileBtn.innerHTML = "<strong>Profile</strong>"

        // only auth can access profile.html which is specific for user
    } else {
        // AUTH
        // change loginBtn to "Sign In"
        loginBtn.innerHTML = "<strong>Sign In</strong>"
        // change profileBtn to "Try Now"
        profileBtn.innerHTML = "<strong>Try Now</strong>"
    }
})