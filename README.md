# FlashKanban

FlashKanban é um sistema de kanban colaborativo multi-board que permite gerenciar tarefas com drag-and-drop, controle de permissões por usuário, histórico de movimentações e feed de atividade em tempo real.

## Figma

[Link do Figma](https://www.figma.com/design/tL646yBUFBNcd2UuIKvDli/Flash?node-id=0-1&t=CbD3P4IPAMvI3Vj2-1)

## Features

- Autenticação JWT com refresh token automático
- Lista de boards com permissão do usuário
- Board com colunas e cards via drag-and-drop
- Observação obrigatória ao mover card entre colunas
- Detalhe do card com histórico completo
- Comentários em cards
- Feed de atividade do board
- Controle de permissão (viewer não pode mover/criar)
- Indicador visual de WIP limit por coluna
- Tratamento de erros com toast notifications
- Interface responsiva (desktop e mobile)

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Estilização | Tailwind CSS |
| Drag and Drop | @hello-pangea/dnd |
| Ícones | react-ionicons |


## Setup

```bash
cd kanban-frontend
npm install
npm run dev
```

## Usuários de teste

| Usuário | Senha | Role | Permissão |
|---------|-------|------|-----------|
| admin | Admin@123 | admin | acesso total |
| alice | Teste@123 | member | editor |
| bob | Teste@123 | member | editor |
| carol | Teste@123 | member | viewer |
| dave | Teste@123 | member | inativo (403) |
