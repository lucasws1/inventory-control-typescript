export type TableColumns = {
  col1?: string;
  col2?: string;
  col3?: string;
  col4?: string;
};

export const columnsConfig: Record<string, TableColumns> = {
  "/": {
    col1: "Data",
    col2: "Nome",
    col3: "Item",
    col4: "Valor",
  },
  "/customers": {
    col1: "Nome",
    col2: "Vendas",
    col3: "Pendente",
    col4: "Total mês",
  },
  "/products": {
    col1: "Nome",
    col2: "Preço",
    col3: "Estoque",
    col4: "Valor",
  },
};
