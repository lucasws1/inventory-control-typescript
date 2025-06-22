import prisma from "@/lib/prisma";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCustomer } from "@/app/lib/actions";

type PageProps = {
  id: string;
};

export default async function CustomerPage({ params }: { params: PageProps }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Alterar dados</CardTitle>
          <CardDescription>Última edição em 01/06/2025</CardDescription>
          <CardAction>Deletar</CardAction>
        </CardHeader>
        <CardContent>
          <form action={updateCustomer}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={customer?.email as string | undefined}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
