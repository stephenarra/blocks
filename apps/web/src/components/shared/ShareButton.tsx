import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { useState } from "react";

const BUTTON_TEXT = {
  default: "Copy link",
  success: "Link copied!",
};

export default function ShareButton() {
  const url = window.location.href;
  const [buttonText, setButtonText] = useState(BUTTON_TEXT.default);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Share</Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={10}>
        <div>
          <Label>Share Url</Label>
          <Input readOnly value={url} />
          <Button
            variant="subtle"
            onClick={() => {
              navigator.clipboard.writeText(url);
              setButtonText(BUTTON_TEXT.success);
              setTimeout(() => {
                setButtonText(BUTTON_TEXT.default);
              }, 2000);
            }}
            className="w-full mt-4"
          >
            {buttonText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
