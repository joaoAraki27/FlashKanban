export type Tag = {
  title: string;
  bg: string;
  text: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  due_date?: string;
  tags?: Tag[];
  assignee_id?: string;
};

export type Column = {
  id: number;
  name: string;
  items: Task[];
  wip_limit?: number | null;
};

export type Columns = {
  [key: string]: Column;
};
