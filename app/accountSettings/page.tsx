import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountSettingsForm } from "@/components/forms/AccountSettingsForm";

export default async function AccountSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg p-6 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
        </div>

        <AccountSettingsForm
          user={{
            id: (session.user as any).id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        />
      </div>
    </div>
  );
}
