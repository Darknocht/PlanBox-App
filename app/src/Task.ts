import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done"; //a Task has a status between this 3 String values
    date: Dayjs | null;
    time: Dayjs | null;
}