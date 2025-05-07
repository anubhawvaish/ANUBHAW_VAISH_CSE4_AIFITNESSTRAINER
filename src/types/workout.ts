
export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  equipment?: string;
  illustration?: string; // Path to exercise illustration, will use placeholder if not provided or if path is invalid
  instructions?: string; // Detailed instructions on how to perform the exercise correctly
}

export interface Workout {
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  day?: string; // Which day this workout is recommended for
  focus?: string; // What muscle groups or fitness aspects this workout focuses on
  exercises: Exercise[];
}
