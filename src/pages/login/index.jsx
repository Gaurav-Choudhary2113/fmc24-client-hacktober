import React, { useState, useEffect } from "react";
import {
  GoogleOAuthProvider,
  useGoogleOneTapLogin,
  GoogleLogin,
} from "@react-oauth/google";
import Classes from "./login.module.css";
import Header from "../landingpage/Header";
import Router from "next/router";
import axios from "axios";
import Image from "next/image";
import getConfig from "next/config";
import { BeatLoader } from "react-spinners";
const LogIn = () => {
  const [clicked, setClicked] = React.useState(false);
  const { publicRuntimeConfig } = getConfig();

  const clientId = publicRuntimeConfig.GOOGLE_CLIENT_ID;

  const backendURL = publicRuntimeConfig.NEXT_PUBLIC_REACT_APP_BACKEND_URI;
  // console.log(backendURL)

  console.log("backendURL : " + backendURL);

  const handleFailure = (error) => {
    console.log("Authentication failed", error);
  };

  const handleLogin = async (credentialResponse) => {
    try {
      // console.log(credentialResponse.getBasicProfile)
      console.log("handleLogin invoked", credentialResponse);
      const idToken = credentialResponse.credential;
      const info = await fetch(
        "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + idToken
      );
      console.log(idToken);
      console.log("info", info);
      const data = await info.json();
      console.log(data);
      sessionStorage.setItem("img", data.picture);
      setClicked(true);
      console.log(credentialResponse.credential);
      sessionStorage.setItem("token", credentialResponse.credential);
      const response = await axios.post(backendURL + "/api/google-login", {
        token: credentialResponse.credential,
        audience: clientId,
      });
      console.log("axios data", response);

      // const response1 = await fetch(backendURL+"/api/google-login", {
      //     method: 'POST',
      //     headers: {
      //         Authorization: `Bearer ${credentialResponse.credential}`,
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //         token: credentialResponse.credential,
      //         audience: clientId,
      //     }),
      // });
      //    console.log("fetch",response1)
      if (response.status === 200) {
        // const data = await response.data.json();
        // console.log(data);

        // sessionStorage.setItem('token', credentialResponse.credential);
        const isNewUser = response.data.message === "New user log in";
        console.log(response);
        console.log(response.data.message);
        sessionStorage.setItem("isNewUser", isNewUser);
        if (isNewUser) {
          Router.push("/register");
        } else {
          Router.push("/dashboard");
        }
      } else {
        console.error("Authentication failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <>
      <section
        class="flex min-h-screen w-screen "
        style={{
          backgroundImage: `url(${require("./static/loginbg.png")})`,
          backgroundSize: "cover", // Adjust as needed
          backgroundPosition: "center", // Adjust as needed
          position: "relative",
        }}
      >
        <div className=" top-0">
          <Header />
        </div>
        {isSmallScreen ? (
          <div className="flex justify-center items-center w-[100%] h-screen">
            <div class="flex w-[60%] bg-white rounded-3xl shadow-2xl">
              <div class="p-10 text-4xl w-full">
                <h1 class="flex my-10 font-bold text-center text-black tracking-normal">
                  Login
                </h1>
                <div className="flex w-full justify-center items-center">
                  <div className={Classes.authenticateButton}>
                    <GoogleOAuthProvider
                      auto_select
                      clientId={clientId}
                      className={Classes.gButton}
                    >
                      {/* <BeatLoader size={15} color={'#123abc'} loading={true} /> */}
                      {/*Loader action on onclick */}

                      <GoogleLogin
                        onSuccess={handleLogin}
                        onFailure={handleFailure}
                        cookiePolicy="single_host_origin"
                        useOneTap
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center w-[100%] h-screen">
            <div class="flex w-[full] md:max-w-[55%] bg-white rounded-3xl shadow-2xl">
              <div class="flex flex-col md:flex-row w-[0%] md:w-[50%]">
                <Image
                  src={require("./static/clip.png")}
                  width={100}
                  height={100}
                  className=" h-auto w-screen rounded-l-3xl"
                  alt="signup"
                />
                <div className="absolute flex flex-col justify-center items-center">
                  <h1 class="xl:text-5xl lg:text-4xl lg:py-32 py-20 px-10 md:text-2xl text-xl w-7 text-white font-semibold tracking-wide">
                    Login to your Account
                  </h1>
                </div>
              </div>
              <div class="flex items-center justify-center p-4 sm:p-12 w-[50%]">
                <div class="w-full mb-20">
                  <h1 class="flex my-10 lg:text-5xl md:text-3xl font-bold text-center text-black tracking-normal">
                    Login
                  </h1>
                  <div className={Classes.authenticateButton}>
                    <GoogleOAuthProvider
                      auto_select
                      clientId={clientId}
                      className={Classes.gButton}
                    >
                      {/* <BeatLoader size={15} color={'#123abc'} loading={true} /> */}
                      {/*Loader action on onclick */}

                      <GoogleLogin
                        onSuccess={handleLogin}
                        onFailure={handleFailure}
                        cookiePolicy="single_host_origin"
                        useOneTap
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default LogIn;
