export type Task = {
  name: string;
  description: string;
};

export type Category = {
  name: string;
  tasks: Task[];
};
