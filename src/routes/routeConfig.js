import { ROUTES } from "@/constants/routes";
import LoginPage from "@/pages/LoginPage";
import PostCreatePage from "@/pages/PostCreatePage";
import PostDetailPage from "@/pages/PostDetailPage";
import PostEditPage from "@/pages/PostEditPage";
import PostListPage from "@/pages/PostListPage";
import ProfileEditPage from "@/pages/ProfileEditPage";
import SignupPage from "@/pages/SignupPage";

export const routeConfig = [
  {
    path: ROUTES.login,
    Component: LoginPage,
    public: true,
  },
  {
    path: ROUTES.signup,
    Component: SignupPage,
    public: true,
  },
  {
    path: ROUTES.posts,
    Component: PostListPage,
  },
  {
    path: ROUTES.postCreate,
    Component: PostCreatePage,
  },
  {
    path: ROUTES.postDetail,
    Component: PostDetailPage,
  },
  {
    path: ROUTES.postEdit,
    Component: PostEditPage,
  },
  {
    path: ROUTES.profileEdit,
    Component: ProfileEditPage,
  },
];

export const protectedRoutePaths = [
  ROUTES.posts,
  ROUTES.postCreate,
  ROUTES.postDetail,
  ROUTES.postEdit,
  ROUTES.profileEdit,
];

export const publicOnlyRoutePaths = [ROUTES.login, ROUTES.signup];
