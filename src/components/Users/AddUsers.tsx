import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import Loading from "../core/Loading";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { userTypes } from "@/utils/constants/userTyps";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { addUsersAPI, getSingleUserAPI } from "@/utils/services/users";
import { errPopper } from "@/utils/helpers/errorPopper";

interface ReportPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  designation: string;
}

const AddUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams({ strict: false });

  const [userData, setUserData] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    designation: "",
  });
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [userType, setUserType] = useState("");

  const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: async (payload: ReportPayload) => {
      return await addUsersAPI(payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({
          to: "/users",
        });
      }
      if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || [""]);
        toast.error(response?.data?.message);
      }
    },
  });

  const addUser = () => {
    const payload = {
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      email: userData?.email,
      password: userData?.password,
      designation: userData?.designation,
      //   ...userData,
      user_type: userType,
    };
    mutate(payload);
  };

  const { isFetching } = useQuery({
    queryKey: ["getSingleUser", userId],
    queryFn: async () => {
      if (!userId) return; // Early return if no userId

      try {
        const response = await getSingleUserAPI(userId);

        if (response.success) {
          const data = response?.data?.data;
          setUserData({
            first_name: data?.first_name,
            last_name: data?.last_name,
            email: data?.email,
            password: data?.password,
            designation: data?.designation,
            user_type: data?.user_type
          });
          setUserType(data?.user_type);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      }
    },
    enabled: Boolean(userId),
  });

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    const updatedValue = value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    setUserData({
      ...userData,
      [name]: updatedValue,
    });
  };

  const handleChangeEmail = (e: any) => {
    let { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const handleChangePassword = (e: any) => {
    let { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const onChangeStatus = (value: string) => {
    setUserType(value);
  };

  return (
    <Card className="p-6 max-w-lg mx-auto shadow-md">
        <h1 className="text-2xl font-bold text-black-600 ml-2">{userId ? "Update User" : "Add User"}</h1>
      <Button
        variant="ghost"
        onClick={() =>
          navigate({
            to: "/users",
          })
        }
        className="mb-4 border-black"
      >
        ← Back
      </Button>

      <div className="space-y-4">
        <div>
          <label htmlFor="FirstName" className="block text-sm font-medium">
            First Name<span className="text-red-500">*</span>
          </label>
          <Input
            id="FirstName"
            placeholder="Enter First Name"
            value={userData.first_name}
            name="first_name"
            onChange={handleInputChange}
          />
          {errorMessages?.first_name && (
            <p style={{ color: "red" }}>{errorMessages.first_name[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name<span className="text-red-500">*</span>
          </label>
          <Input
            id="lastName"
            placeholder="Enter Last Name"
            value={userData.last_name}
            name="last_name"
            onChange={handleInputChange}
          />
          {errorMessages?.last_name && (
            <p style={{ color: "red" }}>{errorMessages.last_name[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email<span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter Email"
            value={userData.email}
            name="email"
            onChange={handleChangeEmail}
          />
          {errorMessages?.email && (
            <p style={{ color: "red" }}>{errorMessages.email[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password<span className="text-red-500">*</span>
          </label>
          <Input
            id="password"
            placeholder="Enter Password"
            value={userData.password}
            name="password"
            onChange={handleChangePassword}
          />
          {errorMessages?.password && (
            <p style={{ color: "red" }}>{errorMessages.password[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="designation" className="block text-sm font-medium">
            Designation<span className="text-red-500">*</span>
          </label>
          <Input
            id="designation"
            placeholder="Enter Designation"
            value={userData.designation}
            name="designation"
            onChange={handleInputChange}
          />
          {errorMessages?.designation && (
            <p style={{ color: "red" }}>{errorMessages.designation[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="panNumber" className="block text-sm font-medium">
            User Type<span className="text-red-500">*</span>
          </label>
          <Popover open={userTypeOpen} onOpenChange={setUserTypeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={userTypeOpen}
                className="w-[200px] justify-between bg-white-700"
              >
                {userType
                  ? userTypes.find((type) => type.value === userType)?.label
                  : "Select Status"}
                <div className="flex">
                  {userType && (
                    <X
                      className="mr-2 h-4 w-4 shrink-0 opacity-50"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onChangeStatus("");
                        setUserTypeOpen(false);
                      }}
                    />
                  )}
                  {userTypeOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 opacity-50" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="max-h-[300px] overflow-y-auto">
                {userTypes?.map((type) => (
                  <Button
                    key={type.value}
                    onClick={() => {
                      onChangeStatus(type.value);
                      setUserTypeOpen(false);
                    }}
                    className="w-full justify-start font-normal bg-white text-violet-600 border border-indigo-600 capitalize mb-2 hover:bg-violet-600  hover:text-white "
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        userType === type.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {type.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {errorMessages?.user_type && (
            <p style={{ color: "red" }}>{errorMessages.user_type[0]}</p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/users",
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit" onClick={addUser}>
            {userId ? "Update": "Add"}
          </Button>
        </div>
        <Loading loading={isPending || isFetching} label="" />
      </div>
    </Card>
  );
};
export default AddUser;
