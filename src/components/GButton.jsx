import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
const GoogleButton = () => {
  return (
    <Button variant={"outline"}
    onClick={() => signIn("google")}>
      <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      oogle
    </Button>
  );
};

export default GoogleButton;