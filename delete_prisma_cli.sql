

-- Deletar todos os clientes de um usuário específico
-- Como Customer tem onDelete: Cascade, os invoices serão deletados automaticamente
-- Mas como estamos usando SQL direto, vamos fazer manualmente para garantir
DELETE FROM "InvoiceItem" 
WHERE "invoiceId" IN (
    SELECT i.id FROM "Invoice" i 
    INNER JOIN "Customer" c ON i."customerId" = c.id 
    WHERE c."userId" = 'cmcyvm61e000lxl0vgc2mplxx'
);

DELETE FROM "Invoice" 
WHERE "customerId" IN (
    SELECT id FROM "Customer" WHERE "userId" = 'cmcyvm61e000lxl0vgc2mplxx'
);

DELETE FROM "Customer" WHERE "userId" = 'cmcyvm61e000lxl0vgc2mplxx';

-- Para deletar todos os invoices de TODOS os usuários (use com cuidado):
-- DELETE FROM "InvoiceItem";
-- DELETE FROM "Invoice";
