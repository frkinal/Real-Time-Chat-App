import React, { useState } from "react";
import { Button, Input } from "../../components";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage }: { isSignInPage?: boolean }) => {
  const [data, setData] = useState<{
    email: string;
    password: string;
    fullName?: string;
  }>({
    email: "",
    password: "",
    ...(!isSignInPage && { fullName: "" }),
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // console.log("data", data);
    e.preventDefault();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Credentials", "true");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS,DELETE,PUT"
    );
    const res = await fetch(
      `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      }
    );
    if (res.status === 400) {
      alert("Invalid credentials");
    } else {
      const resData = await res.json();
      if (resData.token) {
        localStorage.setItem("user:token", resData.token);
        localStorage.setItem("user:detail", JSON.stringify(resData.user));
        navigate("/");
      }
    }
  };

  return (
    <div className="bg-light h-screen flex items-center justify-center">
      <div className="bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="text-4xl font-extrabold">
          Welcome {isSignInPage && "Back"}
        </div>
        <div className="text-xl font-light mb-14">
          {isSignInPage ? "Sign in to get explore" : "Sign up to get started"}
        </div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={handleSubmit}
        >
          {!isSignInPage && (
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              className="w-[75%] mb-6"
              value={data.fullName}
              onChange={(e: any) =>
                setData({ ...data, fullName: e.target.value })
              }
              required
            />
          )}
          <Input
            label="Email address"
            name="email"
            placeholder="Enter your email"
            className="w-[75%] mb-6"
            value={data.email}
            onChange={(e: any) => setData({ ...data, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            name="password"
            placeholder="Enter your password"
            className="w-[75%] mb-14"
            value={data.password}
            onChange={(e: any) =>
              setData({ ...data, password: e.target.value })
            }
            required
          />
          <Button
            label={isSignInPage ? "Sign In" : "Sign Up"}
            type="submit"
            className="w-[75%] mb-2"
          />
        </form>
        <div>
          {isSignInPage ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() =>
              navigate(`/users/${!isSignInPage ? "sign_in" : "sign_up"}`)
            }
            className="text-primary cursor-pointer underline"
          >
            {!isSignInPage ? "Sign In" : "Sign Up"}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Form;
