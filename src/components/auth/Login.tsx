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
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { errPopper } from "@/utils/helpers/errorPopper";
interface loginProps {
  email: string;
  password: string;
}
const LoginComponent = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<any>({});
  const [invalidErrors, setInvalidErrors] = useState<string[]>([]);
  const navigate = useNavigate({ from: "/" });
  const { mutate, isError, error } = useMutation({
    mutationFn: async (loginDetails: loginProps) => {
      setLoading(true);

      try {
        const response = await loginAPI(loginDetails);

        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          const { data } = response?.data;
          const { access_token } = data;
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + 300 * 10000);
          Cookies.set("token", access_token, {
            priority: "High",
            expires: expirationDate,
          });

          dispatch(setUserDetails(data));

          navigate({
            to: "/users",
          });
        } else if (response?.status === 422) {
          const errData = response?.data?.errData;
          setErrors(errData);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      } finally {
        setLoading(false);
      }
    },
  });
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    mutate(loginDetails);
  };
  return (
    <div className="flex justify-center items-center h-screen w-2/3 mx-auto p-10">
      <div className="w-full h-full py-8">
        <div className="relative w-full h-full grid bg-black p-8 rounded-xl">
          <div className="absolute left-0 top-[0px] bg-[url('./img/grow.jpg')] bg-cover bg-no-repeat bg-center w-full h-full"></div>
          <p className="[text-shadow:_0_1px_1px_rgb(255_255_255/_0.8)] text-4xl font-normal tracking-wide leading-[3rem] text-gray-800 relative self-center pt-6 text-center">
            Growing & Sharing with You
          </p>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center space-y-6 relative ml-[-20px] bg-white shadow-xl p-6">
        <div>
          <img
            // src={LogoPath}
            src={"/img/Ashika-logo.svg"}
            alt="logo"
            className="w-[180px] mx-auto animate-in zoom-in-0 duration-1000"
          />
        </div>
        <h1 className="text-3xl font-light">Login</h1>
        <form
          action=""
          className="flex flex-col w-full px-5 space-y-6"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col space-y-1">
            <Label className="font-normal capitalize text-lg" htmlFor="email">
              Email
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="email"
              placeholder="Email"
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
            />
            {errors?.email && (
              <p style={{ color: "red" }}>{errors?.email[0]}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Label className="font-normal capitalize text-lg" htmlFor="password">
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
            {errors?.password && (
              <p style={{ color: "red" }}>{errors?.password[0]}</p>
            )}
          </div>
          <div className="flex justify-end">
          <Link
                to="/forgot-password"
                activeProps={{
                  className: "bg-blue-900 text-white",
                }}
                activeOptions={{ exact: true }}
              >
                 <div className="flex flex-col">
                    <span  className="text-blue-500 hover:text-blue-700"  style={{ fontSize: '1.2rem' }}>
                      <sub>Forgot Password?</sub>
                    </span>
                  </div>
              </Link>
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
    </div>
  );
};
export default LoginComponent;
