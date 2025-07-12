import {
  CardBody,
  CardWithGridEllipsis,
} from "@/components/CardWithGridEllipsis";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto mt-10 flex h-fit items-center justify-center">
      <div className="flex">
        <CardWithGridEllipsis>
          <CardBody
            userName={session.user.name || "Usuário"}
            userImage={session.user.image || "/defaultUserImage.png"}
          />
        </CardWithGridEllipsis>
      </div>
    </div>
  );
}
