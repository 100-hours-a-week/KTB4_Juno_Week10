import AuthCard from "../components/layout/AuthCard";
import SignupForm from "../features/auth/SignupForm";

const SignupPage = () => {
  return (
    <AuthCard activeTab="signup">
      <SignupForm />
    </AuthCard>
  );
};

export default SignupPage;
