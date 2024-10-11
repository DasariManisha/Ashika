import { Button } from "@/components/ui/button";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import { CreateReportContext } from "./CreateReportContext";
import { Loader2 } from "lucide-react";
import { useContext } from "react";

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
}

const ActionButtons = ({ onCancel, onSave }: ActionButtonsProps) => {
  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;
  const { isPending, loading } = context;
  return (
    <div className="flex justify-end space-x-4">
      <Button variant="outline" className="w-1/4   h-[30px]" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        variant="default"
        className="w-1/4   h-[30px]"
        onClick={onSave}
        disabled={loading}
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};

export default ActionButtons;
