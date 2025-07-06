import { CustomerSchema } from "./schemas/zodSchemas";

// Teste simples para verificar se o schema está funcionando
console.log("Testando CustomerSchema...");

// Teste 1: Dados válidos com todos os campos
console.log("Teste 1 - Dados completos:");
const test1 = CustomerSchema.safeParse({
  name: "João Silva",
  email: "joao@email.com",
  phone: "11999999999",
});
console.log(
  test1.success ? "✓ Sucesso" : "✗ Erro:",
  test1.error?.issues || test1.data,
);

// Teste 2: Dados válidos sem email e phone
console.log("\nTeste 2 - Apenas nome:");
const test2 = CustomerSchema.safeParse({
  name: "Maria Santos",
  email: undefined,
  phone: undefined,
});
console.log(
  test2.success ? "✓ Sucesso" : "✗ Erro:",
  test2.error?.issues || test2.data,
);

// Teste 3: Dados com strings vazias (simulando formulário)
console.log("\nTeste 3 - Strings vazias:");
const test3 = CustomerSchema.safeParse({
  name: "Pedro Costa",
  email: "",
  phone: "",
});
console.log(
  test3.success ? "✓ Sucesso" : "✗ Erro:",
  test3.error?.issues || test3.data,
);

// Teste 4: Email inválido
console.log("\nTeste 4 - Email inválido:");
const test4 = CustomerSchema.safeParse({
  name: "Ana Oliveira",
  email: "email-invalido",
  phone: "11999999999",
});
console.log(
  test4.success ? "✓ Sucesso" : "✗ Erro:",
  test4.error?.issues || test4.data,
);
