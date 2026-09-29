export interface Profile {
  id: string; // UUID from auth.users
  username: string | null;
  full_name: string | null;
  selected_mascot: 'narra' | 'syra' | null;
  created_at: string;
}

export interface Chat {
  id: string;
  user_id: string;
  mascot_name: 'narra' | 'syra';
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'ai';
  content: string;
  image_url: string | null;
  created_at: string;
}
