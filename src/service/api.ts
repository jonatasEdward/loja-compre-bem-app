export const SERVIDOR_URL = "http://localhost:8080";
const API_URL = `${SERVIDOR_URL}/api/v1`;


async function requisitar<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    // Só quem manda corpo (POST e PUT) precisa avisar que o corpo é JSON.
    headers: options?.body ? { 'Content-Type': 'application/json' } : undefined,
  });
  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }
  // O DELETE responde sem corpo: nesse caso não há JSON para ler.
  const texto = await response.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  return requisitar<T>(endpoint, { method: 'GET' });
}

export async function post<T>(endpoint: string, body: any): Promise<T> {
  return requisitar<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
}

export async function put<T>(endpoint: string, body: any): Promise<T> {
  return requisitar<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
}

export async function del(endpoint: string): Promise<void> {
  return requisitar<void>(endpoint, { method: 'DELETE' });
}


