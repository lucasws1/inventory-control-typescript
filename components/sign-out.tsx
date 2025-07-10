import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className="w-full cursor-pointer">
        Sign Out
      </button>
    </form>
  );
}
