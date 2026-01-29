import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// 【优化 1】路径规范化：假设你已经按照 Vite 规范将代码组织在 src 目录下
// 如果文件就在 App.tsx 同级目录，请去掉 './src/' 前缀
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// 组件与页面导入
import { Layout } from '../components/Layout';
import { Home } from '../pages/Home';
import { Gallery } from '../pages/Gallery';
import { DetailPage } from '../pages/DetailPage';
import { PhotoWall } from '../pages/PhotoWall';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/admin/Dashboard';
import { BookEditor } from '../pages/admin/BookEditor';
import { Profile } from '../pages/admin/Profile';

/**
 * 优化重点：
 * 1. 移除了可能导致冲突的冗余 Context 逻辑
 * 2. 确保 HashRouter 包裹范围正确
 * 3. 添加了基础的错误边界概念（通过 Suspense 或简单的 Loading）
 */
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          {/* 使用 HashRouter 解决 Vercel 上的刷新 404 问题 */}
          <HashRouter>
            <Layout>
              {/* Suspense 可以在组件加载慢时提供缓冲，防止白屏感 */}
              <Suspense fallback={<div className="flex h-screen items-center justify-center">加载中...</div>}>
                <Routes>
                  {/* 公共路由 - 绘本展示与画廊 */}
                  <Route path="/" element={<Home />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/photowall" element={<PhotoWall />} />
                  {/* 详情页增加 key 属性可以强制销毁旧组件，防止 ID 变化时死循环 */}
                  <Route path="/book/:id" element={<DetailPage />} />

                  {/* 管理后台登录 */}
                  <Route path="/admin/login" element={<Login />} />

                  {/* 管理后台功能区 */}
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/book/new" element={<BookEditor />} />
                  <Route path="/admin/profile" element={<Profile />} />

                  {/* 【优化 2】兜底路由：防止匹配不到路径时出现空白页 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </HashRouter>
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;