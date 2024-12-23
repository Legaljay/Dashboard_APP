export interface MemoryTemplate {
  id: string;
  applicationId: string;
  name: string;
  description?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryTEmplate {
  question: string;
  category: string;
  answer: string;
}

export interface MemoryTemplateCreateDTO {
  data: MemoryTEmplate[]
}

export interface MemoryTemplateUpdateDTO {
  data: MemoryTEmplate[]
}

export interface MemoryTemplateState {
  templates: Record<string, MemoryTemplate>;
  loading: boolean;
  error: string | null;
}

export interface MemoryTemplateResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
