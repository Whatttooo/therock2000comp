import Link from "next/link"
import { SigninForm } from './SigninForm'

export default async function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 md:items-center justify-center">
          <div className="w-full max-w-md">
            <SigninForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/rock-signup.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent"></div>
      </div>
    </div>
  );
}
