const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;

// ---------- toast ----------

const toast = document.getElementById("toast");
let toastTimer;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

// ---------- show / hide password ----------

document.querySelectorAll(".eye").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const shown = input.type === "password";
    input.type = shown ? "text" : "password";
    btn.classList.toggle("is-shown", shown);
    btn.setAttribute("aria-label", shown ? "Hide password" : "Show password");
  });
});

// ---------- validation helpers ----------

function setInvalid(input, invalid) {
  input.closest(".field").classList.toggle("is-invalid", invalid);
  return !invalid;
}

// remove error as soon as user starts typing
document.querySelectorAll(".input").forEach((input) => {
  input.addEventListener("input", () => setInvalid(input, false));
});

// ---------- sign in ----------

const signinForm = document.getElementById("signin-form");

if (signinForm) {
  const login = signinForm.login;
  const password = signinForm.password;
  const remember = signinForm.remember;

  // restore remembered login
  const saved = localStorage.getItem("lighthouse-login");
  if (saved) {
    login.value = saved;
    remember.checked = true;
  }

  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = login.value.trim();

    const ok = [
      setInvalid(login, !(EMAIL_RE.test(value) || PHONE_RE.test(value))),
      setInvalid(password, password.value.length === 0),
    ].every(Boolean);

    if (!ok) return;

    if (remember.checked) {
      localStorage.setItem("lighthouse-login", value);
    } else {
      localStorage.removeItem("lighthouse-login");
    }

    showToast(`Welcome back, ${value}!`);
    password.value = "";
  });

  document.getElementById("forgot").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Password reset link has been sent");
  });
}

// ---------- sign up ----------

const signupForm = document.getElementById("signup-form");

if (signupForm) {
  const { fullname, email, password, confirm, agree } = signupForm;
  const agreeLabel = document.getElementById("agree-label");

  agree.addEventListener("change", () => agreeLabel.classList.remove("is-invalid"));

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const agreed = agree.checked;
    agreeLabel.classList.toggle("is-invalid", !agreed);

    const ok = [
      setInvalid(fullname, fullname.value.trim().length < 2),
      setInvalid(email, !EMAIL_RE.test(email.value.trim())),
      setInvalid(password, password.value.length < 8),
      setInvalid(confirm, confirm.value !== password.value || confirm.value === ""),
      agreed,
    ].every(Boolean);

    if (!ok) return;

    showToast(`Account for ${fullname.value.trim()} created!`);
    signupForm.reset();
  });
}

// ---------- google button ----------

document.querySelectorAll(".js-google").forEach((btn) => {
  btn.addEventListener("click", () => showToast("Google sign-in is not connected yet"));
});
