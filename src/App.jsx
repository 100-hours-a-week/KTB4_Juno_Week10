import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import BoardLayout from "./components/layout/BoardLayout";
import { ROUTES } from "./constants/routes";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";
import PostListPage from "./pages/PostListPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<Navigate to={ROUTES.posts} replace />} />

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.signup} element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<BoardLayout />}>
          <Route path={ROUTES.posts} element={<PostListPage />} />
          <Route path={ROUTES.postCreate} element={<PostCreatePage />} />
          <Route path={ROUTES.postDetail} element={<PostDetailPage />} />
          <Route path={ROUTES.postEdit} element={<PostEditPage />} />
          <Route path={ROUTES.profileEdit} element={<ProfileEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
