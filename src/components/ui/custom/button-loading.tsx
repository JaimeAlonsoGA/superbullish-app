import { LoaderCircle } from "lucide-react";
import { Button } from "../button"

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
    state?: boolean;
    label?: string;
    loadingLabel?: string;
}

const ButtonLoading: React.FC<LoadingButtonProps> = ({ state, label, loadingLabel = "", ...props }) => {
    return (
        <Button {...props} disabled={state || props.disabled}>
            <LoaderCircle className={`w-5 h-5 mr-2 animate-spin ${state ? "inline-block" : "hidden"}`} />
            {state ? (label ?? loadingLabel) : props.children}
        </Button>
    )
}

export default ButtonLoading;