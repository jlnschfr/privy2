declare interface Task {
  id: string;
  type: "Task";
  data: TaskData;
}

declare interface TaskData {
  text: string;
  isValid: boolean;
}
