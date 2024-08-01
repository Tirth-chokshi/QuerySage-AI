'use server'

import { signIn, signOut } from "next-auth/react";

export async function doSocialLogin(formData) {
    const action = formData.get('action');
    await signIn(action, { redirectTo: "/home" });
}

export async function doLogout() {
    await signOut({ redirectTo: "/" });
}
