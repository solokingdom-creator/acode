const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
    private getAuthHeader(): HeadersInit {
        const token = localStorage.getItem('access_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    }

    // Auth
    async login(email: string, password: string) {
        return this.request<{ user: any; session: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async logout() {
        return this.request<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    }

    async getCurrentUser() {
        return this.request<{ user: any }>('/auth/me');
    }

    // Books
    async getBooks(params?: { type?: string; status?: string; category?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any[]>(`/books${query ? '?' + query : ''}`);
    }

    async getBook(id: string) {
        return this.request<any>(`/books/${id}`);
    }

    async createBook(data: any) {
        return this.request<any>('/books', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateBook(id: string, data: any) {
        return this.request<any>(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteBook(id: string) {
        return this.request<{ message: string }>(`/books/${id}`, {
            method: 'DELETE',
        });
    }

    // Users
    async getUserProfile() {
        return this.request<any>('/users/profile');
    }

    async updateUserProfile(data: any) {
        return this.request<any>('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Upload
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    }
}

export const api = new ApiClient();
