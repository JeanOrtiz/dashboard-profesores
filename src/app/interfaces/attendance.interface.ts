export interface Attendance {
    _id: string;
    date: string;
    students: Array<{
        studentId: string;
        present: boolean;
    }>;
}