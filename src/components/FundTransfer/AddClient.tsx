"use client";
import { Button } from "@/components/ui/button";
import { addClientAPI } from "@/utils/services/fundTransfer";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import Loading from "../core/Loading";

const AddClient = () => {
  const navigate = useNavigate();

  const [clientData, setClientData] = useState<any>({});
  const [panNo, setPanNo] = useState<any>("");
  const [accountNo, setAccountNo] = useState<any>("");
  const [dpAccountNo, setDpAccountNo] = useState<any>("");
  const [dpId, setDpId] = useState<any>("");
  const [dueAmount, setDueAmount] = useState<any>();
  const [paidAmount, setPaidAmount] = useState<any>();
  const [errorMessages, setErrorMessages] = useState<any>();
  const [loading, setLoading] = useState(false);

  const addClient = async () => {
    setLoading(true);
    try {
      const payload = {
        dp_type: clientData?.dp_type,
        dp_id: dpId,
        dp_account_no: dpAccountNo,
        pan_no: panNo,
        client_name: clientData?.client_name,
        bank_name: clientData?.bank_name,
        bank_account_no: accountNo,
        amount_due: +dueAmount,
        amount_paid: +paidAmount,
      };
      const response = await addClientAPI(payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Client Added successfully");
        navigate({
          to: "/fund-transfer",
        });
      } else if (response?.status === 422 || response?.status === 409) {
        setErrorMessages(response?.data?.errors);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    const updatedValue = value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    setClientData({
      ...clientData,
      [name]: updatedValue,
    });
  };

  const handlePanNoChange = (e: any) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setPanNo(sanitizedValue);
  };

  const handleAccountNoChange = (e: any) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setAccountNo(sanitizedValue);
  };
  const handleDpAccountNoChange = (e: any) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setDpAccountNo(sanitizedValue);
  };
  const handleDpIdChange = (e: any) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setDpId(sanitizedValue);
  };

  return (
    <Card className="p-6 max-w-lg mx-auto shadow-md">
      <Button
        variant="ghost"
        onClick={() =>
          navigate({
            to: "/fund-transfer",
          })
        }
        className="mb-4 border-black"
      >
        ← Back
      </Button>

      <div className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium">
            Client Name<span className="text-red-500">*</span>
          </label>
          <Input
            id="clientName"
            placeholder="Enter Client Name"
            value={clientData.company_name}
            name="client_name"
            onChange={handleInputChange}
          />
          {errorMessages?.client_name && (
            <p style={{ color: "red" }}>{errorMessages.client_name[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="dpType" className="block text-sm font-medium">
            Dp Type<span className="text-red-500">*</span>
          </label>
          <Input
            id="dpType"
            placeholder="Enter Dp Type"
            value={clientData.dp_type}
            name="dp_type"
            onChange={handleInputChange}
          />
          {errorMessages?.dp_type && (
            <p style={{ color: "red" }}>{errorMessages.dp_type[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="dpId" className="block text-sm font-medium">
            Dp Id<span className="text-red-500">*</span>
          </label>
          <Input
            id="dpId"
            placeholder="Enter Dp Id"
            value={dpId}
            name="dp_id"
            onChange={handleDpIdChange}
          />
          {errorMessages?.dp_id && (
            <p style={{ color: "red" }}>{errorMessages.dp_id[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="dp_no" className="block text-sm font-medium">
            Dp Account Number<span className="text-red-500">*</span>
          </label>
          <Input
            id="dp_no"
            placeholder="Enter Dp Account Number"
            value={dpAccountNo}
            name="dp_account_no"
            onChange={handleDpAccountNoChange}
          />
          {errorMessages?.dp_account_no && (
            <p style={{ color: "red" }}>{errorMessages.dp_account_no[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="bankName" className="block text-sm font-medium">
            Bank Name<span className="text-red-500">*</span>
          </label>
          <Input
            id="bankName"
            placeholder="Enter Bank Name"
            value={clientData.bank_name}
            name="bank_name"
            onChange={handleInputChange}
          />
          {errorMessages?.bank_name && (
            <p style={{ color: "red" }}>{errorMessages.bank_name[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium">
            Client Account Number<span className="text-red-500">*</span>
          </label>
          <Input
            id="accountNumber"
            placeholder="Enter Client Account Number"
            value={accountNo}
            name="bank_account_no"
            onChange={handleAccountNoChange}
          />
          {errorMessages?.bank_account_no && (
            <p style={{ color: "red" }}>{errorMessages.bank_account_no[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="panNumber" className="block text-sm font-medium">
            PAN Number<span className="text-red-500">*</span>
          </label>
          <Input
            id="panNumber"
            placeholder="Enter PAN Number"
            value={panNo}
            name="pan_no"
            onChange={handlePanNoChange}
          />
          {errorMessages?.pan_no && (
            <p style={{ color: "red" }}>{errorMessages.pan_no[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium">
            Due Amount<span className="text-red-500">*</span>
          </label>
          <Input
            id="amount"
            placeholder="Enter Due Amount"
            type="number"
            value={dueAmount}
            name="amount_due"
            onChange={(e) => setDueAmount(e.target.value)}
          />
          {errorMessages?.amount_due && (
            <p style={{ color: "red" }}>{errorMessages.amount_due[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium">
            Paid Amount<span className="text-red-500">*</span>
          </label>
          <Input
            id="amount"
            placeholder="Enter Paid Amount"
            type="number"
            value={paidAmount}
            name="amount_paid"
            onChange={(e) => setPaidAmount(e.target.value)}
          />
          {errorMessages?.amount_paid && (
            <p style={{ color: "red" }}>{errorMessages.amount_paid[0]}</p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/fund-transfer",
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit" onClick={addClient}>
            Save
          </Button>
        </div>
        <Loading loading={loading} label="" />
      </div>
    </Card>
  );
};

export default AddClient;
