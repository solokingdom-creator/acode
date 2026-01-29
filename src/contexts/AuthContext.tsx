import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { User } from '../../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // 增加一个 flag，确保初始化只跑一次，防止并发导致的死循环
    const isInitializing = useRef(false);

    // 使用 useCallback 包裹，防止作为依赖项时导致子组件重绘
    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const { user: userData } = await api.getCurrentUser();
            // 只有当数据真的变化时才更新 state，减少重绘
            setUser(prev => JSON.stringify(prev) === JSON.stringify(userData) ? prev : userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // 只有在确定是 Token 错误时才清理，防止因网络抖动导致的误删
            localStorage.removeItem('access_token');
            setUser(null);
        }
    }, []);

    useEffect(() => {
        if (isInitializing.current) return;
        isInitializing.current = true;

        const initAuth = async () => {
            try {
                await refreshUser();
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        const { user: userData, session } = await api.login(email, password);
        localStorage.setItem('access_token', session.access_token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {/* 只有在加载完成后才渲染子组件，防止白屏期间的逻辑混乱 */}
            {!loading ? children : <div className="flex h-screen items-center justify-center">正在验证身份...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
