import { useState, useEffect } from "react";
import {
  useOutletContext,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

import "./styles.css";

const Login = () => {
  //@ts-ignore
  const { state, dispatch } = useOutletContext();
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    if (state.user.uid) navigate("/");
  }, [state.user.uid]);

  if (state.user.uid) return null;

  return (
    <div className="Login">
      <GoogleLogin
        theme="filled_black"
        shape="pill"
        ux_mode="popup"
        onSuccess={(response) => {
          fetch(`${process.env.API_URI}/v1/auth/google/success`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              creds: response.credential,
              userType: "medic",
            }),
          })
            .then(async (response) => await response.json())
            .then(async (json) => {
              await dispatch({ type: "RECEIVED_AUTH", data: { ...json } });
              navigate(searchParams.get("redirect_to") || "/");
            });
        }}
      />
      <br />
      {loginError && (
        <h1>There was an error logging you in, please try again</h1>
      )}
    </div>
  );
};

export default Login;
