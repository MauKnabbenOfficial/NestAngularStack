export interface Course {
  id: number;
  title: string;
}

export interface CreateCourse {
  title: string;
}

export interface UpdateCourse {
  title?: string;
}
