import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotAPI } from "@/utils/services/auth";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { errPopper } from "@/utils/helpers/errorPopper";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
interface loginProps {
  email: string;
}
function ForgotComponent() {
  const [loading, setLoading] = useState(false);
  const [forgotDetails, setForgotDetails] = useState({ email: "" });
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { mutate, isError, error } = useMutation({
    mutationFn: async (forgotDetails: loginProps) => {
      setLoading(true);
      try {
        const response = await forgotAPI(forgotDetails);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          const { data } = response?.data;
          // //   const { access_token } = data;
          // //   const expirationDate = new Date();
          // //   expirationDate.setTime(expirationDate.getTime() + 30 * 10000);
          // //   Cookies.set("token", access_token, {
          // //     priority: "High",
          // //     expires: expirationDate,
          // //   });
          //   // dispatch(setUserDetails(data));
          //   // navigate({
          //   //   to: "/users",
          //   // });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    mutate(forgotDetails);
  };

  const handleBack = async () => {
    navigate({
      to: "/",
    });
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
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1 w-full">
            <h3 className="mb-2">
              Forgot your account’s password? Enter your email address and we’ll
              send you a recovery link.
            </h3>
            <Label className="font-normal capitalize text-lg" htmlFor="email">
              Email
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="email"
              placeholder="Email"
              onChange={(e) =>
                setForgotDetails({ ...forgotDetails, email: e.target.value })
              }
            />
            {errors?.email && (
              <p style={{ color: "red" }}>{errors?.email[0]}</p>
            )}
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full flex justify-center items-center"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Send recovery email"
              )}
            </Button>
          </div>
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleBack}
              className="w-full flex justify-center items-center"
            >
              Back
            </Button>
          </div>
        </form>
      </div>
      {/* <Loading loading={loading} /> */}
    </div>
  );
}

export default ForgotComponent;
