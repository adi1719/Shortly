document.getElementById("pasteBtn").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("urlInput").value = text;
  } catch (err) {
    console.error("Failed to read clipboard:", err);
  }
});

document.getElementById("urlForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.getElementById("urlInput").value;
  console.log("URL to shorten:", url);
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
let isMenuOpen = false;

hamburger.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;
  navLinks.classList.toggle("active");
  hamburger.querySelector(".material-icons").textContent = isMenuOpen
    ? "close"
    : "menu";
});

document.addEventListener("click", (e) => {
  if (
    isMenuOpen &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    isMenuOpen = false;
    navLinks.classList.remove("active");
    hamburger.querySelector(".material-icons").textContent = "menu";
  }
});

// Close mobile menu when clicking navigation links
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (isMenuOpen) {
      isMenuOpen = false;
      navLinks.classList.remove("active");
      hamburger.querySelector(".material-icons").textContent = "menu";
    }
  });
});

// Contact Form Handling
document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {
    name: e.target.querySelector('input[type="text"]').value,
    email: e.target.querySelector('input[type="email"]').value,
    message: e.target.querySelector("textarea").value,
  };
  console.log("Form submitted:", formData);
  // Here you would typically send the data to your backend
  alert("Thank you for your message! We will get back to you soon.");
  e.target.reset();
});
