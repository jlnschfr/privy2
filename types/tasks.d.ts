declare interface Task {
  id: string;
  type: "task";
  data: TaskData;
}

declare interface TaskData {
  text: string;
  isValid: boolean;
}
