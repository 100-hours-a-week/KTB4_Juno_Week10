import AuthCard from "@/components/layout/AuthCard";
import LoginForm from "@/features/auth/LoginForm";

const LoginPage = () => {
  return (
    <AuthCard activeTab="login">
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
