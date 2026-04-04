import { Columns } from "../types";

export const Board: Columns = {
  backlog: {
    name: "Backlog",
    items: [
      {
        id: 1,
        title: "Configurar ambiente",
        description: "Instalar dependências e configurar o projeto",
        priority: "low",
        deadline: "2026-04-10",
        tags: [{ title: "Setup", bg: "#fef9c3", text: "#854d0e" }],
      },
    ],
  },
  emAndamento: {
    name: "Em Andamento",
    items: [
      {
        id: 2,
        title: "Criar tela de login",
        description: "Desenvolver a tela de autenticação",
        priority: "high",
        deadline: "2026-04-15",
        tags: [{ title: "Frontend", bg: "#fee2e2", text: "#991b1b" }],
      },
    ],
  },
  emRevisao: {
    name: "Em Revisão",
    items: [
      {
        id: 3,
        title: "Integrar API",
        description: "Conectar o frontend com o backend",
        priority: "medium",
        deadline: "2026-04-20",
        tags: [{ title: "API", bg: "#dbeafe", text: "#1e40af" }],
      },
    ],
  },
  concluido: {
    name: "Concluído",
    items: [],
  },
};
