<p align="center">
  <img
    width="128"
    height="128"
    alt="favicon"
    src="https://github.com/user-attachments/assets/58d5d1a4-bbe1-4984-b9fc-2462057f19ab"
  />
</p>

# 마라보자 Frontend (See Mara)

마라보자는 마라탕이나 훠궈를 먹을 때 찍어 먹는 다양한 소스 조합을 사용자들이 직접 작성하고 모아볼 수 있는 커뮤니티 서비스입니다.

[마라보자 백엔드 레포지토리 바로가기](https://github.com/100-hours-a-week/KTB4_Juno_Week8)

## 1. 프로젝트 소개

마라탕/훠궈 소스는 사람마다 취향이 강하게 갈리고, 같은 재료라도 비율이나 조합에 따라 맛이 크게 달라집니다. 마라보자는 이런 개인의 소스 조합을 게시글로 공유하고, 다른 사용자가 검색과 정렬, 북마크를 통해 다시 찾아볼 수 있도록 만든 서비스입니다.

### 기술 선택 이유

- React: 게시글 목록, 검색어, 정렬, 북마크 상태처럼 사용자 인터랙션에 따라 자주 바뀌는 UI를 컴포넌트 단위로 관리하기 위해 사용했습니다.
- Vite: 빠른 개발 서버 실행과 간단한 빌드 설정을 통해 프론트엔드 개발 속도를 높이기 위해 선택했습니다.
- React Router: 로그인/회원가입, 게시글 목록, 상세, 작성, 북마크, 프로필 수정 등 페이지 흐름을 명확하게 분리하기 위해 사용했습니다.
- Tailwind CSS: 별도 CSS 파일을 과하게 늘리지 않고, 컴포넌트 안에서 화면 스타일을 빠르게 조정하기 위해 사용했습니다.
- Fetch 기반 API 클라이언트: 인증 헤더, JSON 파싱, 에러 처리를 한 곳에서 관리해 API 호출 코드의 중복을 줄였습니다.


### 추후 추가 예정 기능

- 1:1 채팅: 마음에 드는 소스 조합을 작성한 사용자에게 직접 질문하거나, 재료 비율을 더 자세히 물어볼 수 있는 채팅 기능을 웹소켓을 활용하여 추가하고 싶습니다.

## 2. 주요 핵심 기능

### 1. 게시글 정렬

#### Why

사용자는 상황에 따라 보고 싶은 소스 조합의 기준이 다릅니다. 새로 올라온 조합을 보고 싶을 수도 있고, 많은 사람이 저장하거나 조회한 검증된 조합을 먼저 보고 싶을 수도 있습니다. 그래서 목록을 고정된 최신순으로만 보여주지 않고, 사용자가 탐색 기준을 직접 선택할 수 있도록 정렬 기능을 구현했습니다.

#### How

게시글 목록 페이지에서는 정렬 기준을 `sort` 상태로 관리합니다. 사용자가 정렬 옵션을 변경하면 현재 페이지를 0으로 초기화하고, 변경된 정렬 값을 API 요청 파라미터에 담아 다시 게시글을 불러옵니다.

```jsx
const [sort, setSort] = useState("latest");
const [page, setPage] = useState(0);

const handleSortChange = (nextSort) => {
  setSort(nextSort);
  setPage(0);
  setIsSortOpen(false);
};
```

```js
params.set("sort", sort);
params.set("page", String(page));
params.set("size", String(size));
```

북마크 목록은 사용자가 저장한 글만 받아온 뒤 클라이언트에서 정렬합니다. 조회수나 댓글 수가 같은 경우 작성일을 보조 기준으로 사용해 같은 데이터에서도 목록 순서가 안정적으로 유지되도록 했습니다.

#### What

- 전체 게시글 정렬: 최신순, 북마크순, 조회순, 댓글순
- 북마크 게시글 정렬: 최근 저장순, 최신순, 조회순, 댓글순
- 정렬 변경 시 첫 페이지로 이동
- 정렬 기준, 페이지네이션, API 요청 상태 연결

### 2. 제목 + 본문 검색

#### Why

소스 조합은 제목보다 본문에 핵심 정보가 들어가는 경우가 많습니다. 사용자는 가게 이름, 재료, 맛 표현처럼 기억나는 단서 하나만으로 글을 찾으려 하기 때문에 제목과 본문을 함께 검색할 수 있는 흐름이 필요했습니다.

#### How

입력 중인 검색어와 실제 API 요청에 사용되는 검색어를 분리했습니다. 사용자가 타이핑할 때마다 요청하지 않고, 검색 제출 시점에 공백을 제거한 값을 `submittedKeyword`로 저장해 게시글 목록을 다시 불러옵니다.

```jsx
const [searchInput, setSearchInput] = useState("");
const [submittedKeyword, setSubmittedKeyword] = useState("");
const [searchRequestCount, setSearchRequestCount] = useState(0);

const handleSearchSubmit = () => {
  const nextKeyword = searchInput.trim();

  if (!nextKeyword) {
    return;
  }

  setSubmittedKeyword(nextKeyword);
  setPage(0);
  setSearchRequestCount((current) => current + 1);
};
```

검색어는 게시글 조회 API의 `keyword` 파라미터로 전달합니다. 검색 초기화 시에는 입력값과 제출된 키워드를 모두 비워 전체 목록으로 돌아갈 수 있게 했습니다.

```js
if (keyword.trim()) {
  params.set("keyword", keyword.trim());
}
```

#### What

- 제목과 본문 기준 키워드 검색
- 공백 검색 방지
- 검색 제출 시 첫 페이지로 초기화
- 검색 결과 없음, 로딩, 에러 상태 분리
- 검색 초기화 버튼 제공

### 3. 북마크 기능

#### Why

마라보자에서 북마크는 단순 반응 버튼보다 "다음에 먹어볼 소스 저장함"에 가깝습니다. 사용자가 마음에 드는 소스 조합을 저장하고, 나중에 다시 찾아볼 수 있어야 서비스의 재방문 가치가 생긴다고 생각했습니다.

#### How

게시글 상세 페이지에서는 현재 북마크 상태에 따라 북마크 추가 또는 삭제 API를 호출합니다. 요청 중에는 `isBookmarkProcessing` 상태로 버튼을 비활성화해 중복 요청을 막았습니다.

```jsx
const response = previousBookmarked
  ? await postApi.unbookmarkPost(post.id)
  : await postApi.bookmarkPost(post.id);
```

서버 응답에 `bookmarked`, `bookmark_count`가 있으면 그 값을 우선 반영하고, 없을 때도 사용자의 클릭 결과를 기반으로 화면을 갱신할 수 있도록 fallback 값을 계산했습니다.

```jsx
const fallbackBookmarked = !previousBookmarked;
const fallbackBookmarkCount = previousBookmarked
  ? Math.max(previousBookmarkCount - 1, 0)
  : previousBookmarkCount + 1;
```

북마크가 새로 추가되면 `localStorage`와 `CustomEvent`로 하단 내비게이션에 읽지 않은 북마크 상태를 전달합니다. 북마크 페이지에 진입하면 읽음 처리해 사용자가 저장한 소스가 있다는 신호를 자연스럽게 확인할 수 있도록 했습니다.

#### What

- 게시글 상세 북마크 추가/삭제
- 북마크 수 즉시 갱신
- 요청 중 중복 클릭 방지
- 내 북마크 목록 조회
- 북마크 저장 알림 상태 관리
- 북마크 페이지 진입 시 읽음 처리

## 3. 기술 스택

| 구분 | 기술 |
| --- | --- |
| Language | JavaScript |
| Framework / Library | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 |
| API | Fetch API |
| Lint | ESLint 10 |
| Runtime | Node.js 20 권장 |
| Deploy Runtime | Docker, Nginx |

## 4. 빠른 시작

### 사전 요구 사항

- Node.js 20 이상 권장
- npm
- 백엔드 API 서버
- Docker 실행 시 프론트엔드 프로젝트와 같은 상위 폴더에 백엔드 프로젝트 `KTB4_Juno_Week8` 필요

### 설치 방법

```bash
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 API 서버 주소를 설정합니다.

```env
VITE_API_BASE_URL=/api
```

개발 서버에서는 Vite proxy 설정에 따라 `/api` 요청이 `http://localhost:8080`으로 전달됩니다.

### 사용 방법

개발 서버 실행:

```bash
npm run dev
```

프로덕션 빌드:

```bash
npm run build
```

빌드 결과 미리보기:

```bash
npm run preview
```

린트 검사:

```bash
npm run lint
```

Docker Compose 실행:

```bash
docker compose up --build
```

## 5. 디렉토리 구조

```text
src
├── api              # API 요청 모듈
├── assets           # 기본 이미지 등 정적 리소스
├── components       # 공통 UI, 레이아웃 컴포넌트
├── constants        # 라우트, 설정, 카테고리 스타일 상수
├── features         # auth, posts, categories, profile 도메인 컴포넌트
├── hooks            # 이미지 미리보기 등 커스텀 훅
├── pages            # 라우트 단위 페이지
├── routes           # 보호 라우트, 공개 전용 라우트
└── utils            # 인증, 포맷팅, 정규화, 이벤트 유틸
```

## 6. 아키텍처 개요

```text
사용자
  ↓
React Router
  ↓
Page Components
  ↓
Feature Components / Common Components
  ↓
API Modules
  ↓
Fetch API Client
  ↓
Backend API
```

- `App.jsx`에서 공개 페이지와 인증이 필요한 페이지를 라우트 단위로 분리합니다.
- `ProtectedRoute`는 로그인한 사용자만 게시글, 카테고리, 북마크, 프로필 페이지에 접근할 수 있도록 제어합니다.
- 각 `pages` 파일은 화면 단위 상태와 API 호출 흐름을 관리합니다.
- `features`는 게시글 카드, 댓글, 북마크 버튼, 인증 폼처럼 도메인별 UI를 담당합니다.
- `api/client.js`는 API base URL 조합, 인증 헤더 주입, JSON 파싱, 공통 에러 처리를 담당합니다.
- Docker 환경에서는 Nginx가 정적 파일을 서빙하고 `/api` 요청을 백엔드 컨테이너로 프록시합니다.

## 7. API 엔드포인트 예제

프론트엔드에서 사용하는 주요 API 예시는 다음과 같습니다.

| 기능 | Method | Endpoint | 설명 |
| --- | --- | --- | --- |
| 로그인 | POST | `/users/signin` | 이메일/비밀번호로 로그인 |
| 회원가입 | POST | `/users/signup` | 이메일, 비밀번호, 닉네임, 프로필 이미지로 가입 |
| 로그아웃 | POST | `/users/signout` | 현재 사용자 로그아웃 |
| 내 프로필 조회 | GET | `/users/me` | 로그인한 사용자 정보 조회 |
| 내 프로필 수정 | PATCH | `/users/me` | 닉네임, 프로필 이미지 수정 |
| 비밀번호 변경 | PUT | `/users/me/password` | 비밀번호 변경 |
| 회원 탈퇴 | DELETE | `/users/me` | 현재 계정 삭제 |
| 게시글 목록 조회 | GET | `/posts?keyword=&sort=&page=&size=` | 검색, 정렬, 페이지네이션 기반 목록 조회 |
| 게시글 상세 조회 | GET | `/posts/:postId` | 단일 게시글 상세 조회 |
| 게시글 작성 | POST | `/posts` | 제목, 본문, 이미지, 카테고리로 게시글 작성 |
| 게시글 수정 | PATCH | `/posts/:postId` | 게시글 내용 수정 |
| 게시글 삭제 | DELETE | `/posts/:postId` | 게시글 삭제 |
| 북마크 추가 | POST | `/posts/:postId/bookmarks` | 게시글 북마크 저장 |
| 북마크 삭제 | DELETE | `/posts/:postId/bookmarks` | 게시글 북마크 해제 |
| 내 북마크 목록 | GET | `/users/me/bookmarks` | 사용자가 저장한 게시글 목록 조회 |
| 댓글 작성 | POST | `/posts/:postId/comments` | 게시글 댓글 작성 |
| 댓글 수정 | PATCH | `/posts/:postId/comments/:commentId` | 댓글 내용 수정 |
| 댓글 삭제 | DELETE | `/posts/:postId/comments/:commentId` | 댓글 삭제 |
| 카테고리 목록 | GET | `/categories` | 카테고리 목록 조회 |
| 이미지 업로드 | POST | `/images` | 이미지 파일 업로드 |

게시글 목록 조회 예시:

```http
GET /posts?keyword=땅콩소스&sort=bookmarks&page=0&size=10
```

북마크 추가 예시:

```http
POST /posts/1/bookmarks
Authorization: Bearer {accessToken}
```

## 8. 환경 변수명 설명

### 프론트엔드

| 변수명 | 설명 | 예시 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 프론트엔드에서 API 요청을 보낼 기본 주소 | `/api` |

### Docker Compose / 백엔드 연동

| 변수명 | 설명 | 예시 |
| --- | --- | --- |
| `MYSQL_PASSWORD` | MySQL 일반 사용자 비밀번호 | `your_mysql_password` |
| `MYSQL_ROOT_PASSWORD` | MySQL root 계정 비밀번호 | `your_root_password` |
| `JWT_SECRET` | JWT 서명에 사용할 비밀 키 | `your_jwt_secret` |
| `JWT_EXPIRATION` | JWT 만료 시간(ms), 미설정 시 기본값 사용 | `3600000` |
| `AWS_REGION` | 이미지 저장용 AWS 리전 | `ap-northeast-2` |
| `AWS_S3_BUCKET` | 이미지 저장용 S3 버킷 이름 | `your_bucket_name` |

`.env` 예시:

```env
VITE_API_BASE_URL=/api
MYSQL_PASSWORD=your_mysql_password
MYSQL_ROOT_PASSWORD=your_root_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600000
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your_bucket_name
```

## 9. 서비스 UI

<details>
<summary>메인 화면</summary>

<br />

<p align="center">
  <img
    width="321"
    height="778"
    alt="1"
    src="https://github.com/user-attachments/assets/19b79488-d030-4435-b972-fd7311ed9740"
  />
</p>

</details>

<!--
<img
  width="322"
  height="777"
  alt="스크린샷 2026-08-09 오후 10 16 38"
  src="https://github.com/user-attachments/assets/33236eed-cd5b-45bd-b25b-d0e4a1682b5e"
/>
-->

<details>
<summary>소스 모아보기</summary>

<br />

<p align="center">
  <img
    width="322"
    height="779"
    alt="스크린샷 2026-08-09 오후 10 16 01"
    src="https://github.com/user-attachments/assets/3d362f41-97fa-4539-98d2-f23a96acbdfa"
  />
</p>

</details>


<details>
<summary>북마크 목록 화면</summary>

<br />

<p align="center">
  <img
    width="321"
    height="779"
    alt="스크린샷 2026-08-09 오후 10 16 29"
    src="https://github.com/user-attachments/assets/ffa66b89-5c78-40d0-87ea-90078e004bea"
  />
</p>

</details>

<details>
<summary>게시글 상세 화면</summary>

<br />

<p align="center">
  <img
    width="321"
    height="777"
    alt="스크린샷 2026-08-09 오후 10 16 19"
    src="https://github.com/user-attachments/assets/a0dfd66f-be16-4bad-9683-26e847cce5a8"
  />
</p>

</details>

<!--
<img
  width="319"
  height="777"
  alt="스크린샷 2026-08-09 오후 10 16 11"
  src="https://github.com/user-attachments/assets/879036b2-4b04-44d6-9591-2674c3a0fac7"
/>
-->

<details>
<summary>검색 화면</summary>

<br />

<p align="center">
  <img
    width="325"
    height="780"
    alt="스크린샷 2026-08-09 오후 10 22 28"
    src="https://github.com/user-attachments/assets/38c6bdbc-307b-4534-ae5f-5e7a5a7f7cb0"
  />
</p>

</details>

