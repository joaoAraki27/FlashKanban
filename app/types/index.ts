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
  deadline: string;
  image?: string;
  alt?: string;
  tags?: Tag[];
};

export type Column = {
  name: string;
  items: Task[];
};

export type Columns = {
  [key: string]: Column;
};
