import { useNavigate } from "@tanstack/react-router";
import LogoPath from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { loginAPI } from "@/utils/services/auth";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setUserDetails } from "@/redux/Modules/userlogin";
import { toast } from "sonner";
import Loading from "../core/CommonComponents/Loading";

interface loginProps {
  email: string;
  password: string;
}

const LoginComponent = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate({ from: "/" });

  const { mutate, isError, error } = useMutation({
    mutationFn: async (loginDetails: loginProps) => {
      return await loginAPI(loginDetails);
    },
    onSuccess: (response: any) => {
      setLoading(false);
      const { data } = response?.data;
      const { access_token } = data;
      const exp = new Date().getTime() + 10000;

      Cookies.set("token", access_token, {
        priority: "High",
        expires: exp,
      });

      dispatch(setUserDetails(data));
      toast.success("Logged in Successfully!");
      navigate({
        to: `/users`,
      });
    },
    onError: (error: any) => {
      setLoading(false);
      if (error?.response?.status === 422) {
        setErrors(
          error?.response?.data?.errors || ["Invalid login credentials."]
        );
      } else {
        toast.error("Login failed. Please try again.");
      }
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true); // Start loading when login is submitted
    mutate(loginDetails);
  };

  return (
    <div className="flex justify-center items-center h-screen w-2/3 mx-auto p-20">
      <div className="w-full h-full py-10">
        <div className="relative w-full h-full grid bg-black p-10 rounded-xl">
          <div className="absolute left-0 top-[0px] bg-[url('./img/grow.jpg')] bg-cover bg-no-repeat bg-center w-full h-full"></div>
          <p className="[text-shadow:_0_1px_1px_rgb(255_255_255/_0.8)] text-4xl font-normal tracking-wide leading-[3rem] text-gray-800 relative self-center pt-10 text-center">
            Growing & Sharing with You
          </p>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center space-y-8 relative ml-[-20px] bg-white shadow-xl p-8">
        <div>
          <img
            src={LogoPath}
            alt="logo"
            className="w-[200px] mx-auto animate-in zoom-in-0 duration-1000"
          />
        </div>
        <h1 className="text-3xl font-light">Login</h1>
        <form
          action=""
          className="flex flex-col w-full px-5 space-y-8"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col space-y-1">
            <Label className="font-normal uppercase text-lg" htmlFor="email">
              Email
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              type="email"
              id="email"
              placeholder="Email"
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label className="font-normal uppercase text-lg" htmlFor="password">
              Password
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              type="password"
              id="password"
              placeholder="Password"
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, password: e.target.value })
              }
            />
          </div>
          <div className="self-end font-light text-md text-red-500 underline cursor-pointer">
            Forgot Password?
          </div>
          <Button
            type="submit"
            className="w-full flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </div>
      <Loading loading={loading} />
    </div>
  );
};

export default LoginComponent;
