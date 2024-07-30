import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
const GoogleButton = () => {
  return (
    <Button onClick={() => signIn("google")}>
      Sign in with Google
    </Button>
  );
};

export default GoogleButton;