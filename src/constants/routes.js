export const ROUTES = {
  root: "/",
  login: "/login",
  signup: "/signup",
  posts: "/posts",
  postCreate: "/posts/new",
  postDetail: "/posts/:postId",
  postEdit: "/posts/:postId/edit",
  profileEdit: "/profile",
};

export const routeLabels = {
  [ROUTES.root]: "로그인으로 이동",
  [ROUTES.login]: "로그인",
  [ROUTES.signup]: "회원가입",
  [ROUTES.posts]: "게시글 목록",
  [ROUTES.postCreate]: "게시글 작성",
  [ROUTES.postDetail]: "게시글 상세",
  [ROUTES.postEdit]: "게시글 수정",
  [ROUTES.profileEdit]: "마이페이지",
};
