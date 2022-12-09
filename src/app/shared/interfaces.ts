export interface ImageObject {
  image: string | null;
}

export interface Token {
  access_token: string;
  expires_in: number;
  token_type: string;
}
