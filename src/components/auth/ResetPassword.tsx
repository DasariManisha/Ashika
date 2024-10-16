import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordAPI } from "@/utils/services/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/redux/Modules/userlogin";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { errPopper } from "@/utils/helpers/errorPopper";

interface loginProps {
  new_password: string;
  confirm_new_password: string;
  reset_password_token: string;
}
function ResetPassword() {
  const [resetDetails, setResetDetails] = useState({
    new_password: "",
    confirm_new_password: "",
    reset_password_token: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate({ from: "/" });
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  const { mutate, isError, error } = useMutation({
    mutationFn: async (resetDetails: loginProps) => {
      setLoading(true);
      try {
        const payload = {
          ...resetDetails,
          reset_password_token: code ? code : "",
        };
        console.log(payload, "payload");
        const response = await resetPasswordAPI(payload);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          navigate({
            to: "/",
          });
        } else if (response?.status === 422) {
          const errData = response?.data?.errData;
          console.log(response);
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
    mutate(resetDetails);
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
        <div className="flex flex-col space-y-4 w-full">
        <div className="flex flex-col space-y-0.5 w-full">
            <Label className="font-normal uppercase text-lg" htmlFor="newpassword">
              New Password
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="newpassword"
              placeholder="New Password"
              onChange={(e) =>
                setResetDetails({
                  ...resetDetails,
                  new_password: e.target.value,
                })
              }
            />
            {errors?.new_password && (
              <p style={{ color: "red" }}>{errors?.new_password[0]}</p>
            )}
          </div>
          <div className="flex flex-col space-y-0.5 w-full">
            <Label className="font-normal uppercase text-lg" htmlFor="confirm_new_password">
              Re-Enter Password
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="newpassword"
              placeholder="New Password"
              onChange={(e) =>
                setResetDetails({
                  ...resetDetails,
                  confirm_new_password: e.target.value,
                })
              }
            />
            {errors?. confirm_new_password&& (
              <p style={{ color: "red" }}>{errors?.confirm_new_password[0]}</p>
            )}
          </div>
          </div>
          <div className="mt-4">
          <Button
            type="submit"
            className="w-full flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Recover Account"
            )}
          </Button>
          </div>
        </form> 
      </div>
      {/* <Loading loading={loading} /> */}
    </div>
  );
}
export default ResetPassword;
