export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  type?: string;
  monthly_limit?: number;
  usage?: number;
}

export interface KeyType {
  id: 'production' | 'development';
  name: string;
  description: string;
  disabled?: boolean;
}
