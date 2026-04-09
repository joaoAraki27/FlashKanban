export type Tag = {
  title: string;
  bg: string;
  text: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  due_date?: string;
  tags?: Tag[];
  assignee_id?: string;
};

export type Column = {
  id: string;
  name: string;
  items: Task[];
  wip_limit?: number | null;
};

export type Columns = {
  [key: string]: Column;
};
