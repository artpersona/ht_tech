import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useAuthContext } from "../../../shared/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";

function Login() {
  // Context
  const { registerUser, loginWithEmail, loggedUser } = useAuthContext();
  //  Refs
  const containerRef = useRef(null);
  const registEye = useRef(null);
  const loginEye = useRef(null);
  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);
  // State

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) navigate("/patients");
  }, [loggedUser]);

  const [registPasswordType, setRegistPasswordType] = useState("password");
  const [loginPasswordType, setLoginPasswordType] = useState("password");
  const [userType, setUserType] = useState("local-center");
  const [site, setSite] = useState("matina");

  const displayLogin = () => {
    containerRef.current.classList.add("sign-up-mode");
    console.log("pota");
  };

  const displayRegister = () => {
    containerRef.current.classList.remove("sign-up-mode");
  };

  const handleLoginPassword = () => {
    let type = loginPasswordType === "password" ? "text" : "password";
    setLoginPasswordType(type);
    loginEye.current.classList.toggle("fa-eye-slash");
  };

  const handleRegistPassword = () => {
    let type = registPasswordType === "password" ? "text" : "password";
    setRegistPasswordType(type);
    registEye.current.classList.toggle("fa-eye-slash");
  };

  const handleUserRegistration = (data) => {
    const { email, password } = data;
    registerUser(email, password, userType, site)
      .then(() => {
        console.log("accont creation success");
      })
      .catch((err) => console.log("account creation failed: ", err));
  };

  const handleLogin = (data) => {
    const { lemail, lpassword } = data;
    loginWithEmail(lemail, lpassword);
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="forms-container">
        <div className="signin-signup">
          <form action className="sign-in-form">
            <h2 className="title">Login</h2>
            <div className="input-field">
              <i className="fas fa-user" />
              <input
                type="email"
                placeholder="Email"
                required="yes"
                {...register("lemail", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email is invalid",
                  },
                })}
                name="lemail"
              />
            </div>

            {errors.lemail && (
              <ErrorMessage
                errors={errors}
                name="lemail"
                render={({ message }) => (
                  <p style={{ color: "red" }}>{message}</p>
                )}
              />
            )}
            <div className="input-field">
              <i className="fas fa-lock" />
              <input
                type="password"
                name="lpassword"
                required="yes"
                {...register("lpassword", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
                placeholder="Password"
              />
              <i
                className="far fa-eye"
                id="togglePassword"
                style={{ cursor: "pointer" }}
                onClick={handleLoginPassword}
                ref={loginEye}
              />
            </div>
            {errors.lpassword && (
              <ErrorMessage
                errors={errors}
                name="lpassword"
                render={({ message }) => (
                  <p style={{ color: "red" }}>{message}</p>
                )}
              />
            )}
            <input
              type="submit"
              defaultValue="Sign in"
              className="btn solid"
              onClick={handleSubmit(handleLogin)}
            />
          </form>

          <form action className="sign-up-form">
            <h2 className="title">Register</h2>
            <div className="input-field">
              <i className="fas fa-user" />
              <select
                placeholder="Select User Type"
                className="bg-color"
                onChange={(event) => setUserType(event.target.value)}
                required
              >
                <option value="local-center">Local Health Center</option>
                <option value="city-center">City Health Center</option>
              </select>
            </div>

            {userType === "local-center" && (
              <div className="input-field">
                <i className="fas fa-house" />
                <select
                  placeholder="Select Community Site"
                  className="bg-color"
                  onChange={(event) => setSite(event.target.value)}
                  required
                >
                  <option value="matina">Matina</option>
                  <option value="maa">Maa</option>
                  <option value="catalunan">Catalunan</option>
                </select>
              </div>
            )}

            <div className="input-field">
              <i className="fas fa-envelope" />
              <input
                type="email"
                placeholder="Email"
                required="yes"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email is invalid",
                  },
                })}
                name="email"
              />
            </div>
            {errors.email && (
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <p style={{ color: "red" }}>{message}</p>
                )}
              />
            )}
            <div className="input-field">
              <i className="fas fa-lock" />
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
                placeholder="Password"
                id="id_reg"
                required="yes"
                name="password"
                type={registPasswordType}
              />

              <i
                className="far fa-eye"
                id="toggleReg"
                style={{ cursor: "pointer" }}
                ref={registEye}
                onClick={handleRegistPassword}
              />
            </div>

            {errors.password && (
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => (
                  <p style={{ color: "red" }}>{message}</p>
                )}
              />
            )}

            <input
              type="submit"
              defaultValue="Create account"
              className="btn solid"
              onClick={handleSubmit(handleUserRegistration)}
            />
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>You don't have an account?</h3>
            <p>Create your account right now to start administrative tasks</p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={displayLogin}
            >
              Register
            </button>
          </div>
          {/* <img src="img/log.svg" className="image" alt /> */}
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Already have an account?</h3>
            <p>Login to start administrative tasks</p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={displayRegister}
            >
              Sign in
            </button>
          </div>
          {/* <img src="img/regis ter.svg" className="image" alt /> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
