import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Authentication(props) {
  const { handleCloseModal } = props;
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const { signup, login } = useAuth();

  async function handleAuthenticate() {
    // guard clause
    if (
      !email ||
      !email.trim() || // check for whitespace-only email
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || // stricter email pattern
      !password ||
      password.trim().length < 6 || // remove whitespace padding
      /\s/.test(password) || // disallow spaces in password
      isAuthenticating
    ) {
      setError("Invalid input");
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      if (isRegistering) {
        // register a user
        await signup(email, password);
      } else {
        // login a user
        await login(email, password);
      }
      handleCloseModal();
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <>
      <h2 className="sign-up-text">{isRegistering ? "Sign Up" : "Login"}</h2>
      <p>{isRegistering ? "Create an account" : "Sign in to your account!"}</p>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="********"
        type="password"
      />
      {/* Show error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleAuthenticate}>
        <p>{isAuthenticating ? "Authenticating..." : "Submit"}</p>
      </button>
      <hr />
      <div className="register-content">
        <p>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
          }}
        >
          <p>{isRegistering ? "Sign In" : "Sign Up"}</p>
        </button>
      </div>
    </>
  );
}
