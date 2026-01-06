import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api, { obtainToken } from "../../../api";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    // 1. Optionally, also get email/password data from query or local/session storage
    const email =
      searchParams.get("email") || localStorage.getItem("pending_email");
    const password =
      searchParams.get("password") || localStorage.getItem("pending_password");

    if (!token) {
      setErrorMsg("Verification token missing.");
      setStatus("error");
      return;
    }
    // Hit verification endpoint
    api
      .get(`/verify-email/?token=${encodeURIComponent(token)}`)
<<<<<<< HEAD
      .then(async () => {
=======
      .then(async (res) => {
>>>>>>> 18491e4e4f3b633eaecc04e970ba281dd6245e46
        setStatus("success");
        // Attempt auto login if email/password are available
        if (email && password) {
          try {
            const tokens = await obtainToken(email, password);
            login(tokens.access, tokens.refresh);
            localStorage.removeItem("pending_email");
            localStorage.removeItem("pending_password");
            // Redirect to application/dashboard/vendors after login
            setTimeout(() => {
              navigate("/vendors");
            }, 1000);
            return;
          } catch (loginErr) {
            // If login fails, just show email verified message and link to login
            setTimeout(() => {
              navigate("/login?verified=1");
            }, 2000);
            return;
          }
        } else {
          // No credentials in storage; fallback to login page after showing success
          setTimeout(() => {
            navigate("/login?verified=1");
          }, 2000);
        }
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(
          err?.response?.data?.error ||
            "Verification failed. The link may be invalid or expired."
        );
      });
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] p-4">
      <div className="bg-gray-800/50 text-center rounded-2xl p-10 border border-gray-700 max-w-sm w-full">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[#A32110]" />
            <h1 className="text-white text-2xl mb-2 font-bold">
              Verifying Email...
            </h1>
            <p className="text-gray-300">
              Please wait while we verify your email.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-3 text-green-400">
              Email Verified!
            </h1>
            <p className="text-gray-200 mb-4">
              Your email has been verified. You may now log in and start using
              ChopHive.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#A32110] text-white px-4 py-2 rounded hover:bg-[#A32110]/90 font-semibold w-full"
            >
              Go to Login
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-3 text-red-400">
              Verification Failed
            </h1>
            <p className="text-gray-300 mb-4">{errorMsg}</p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#A32110] text-white px-4 py-2 rounded hover:bg-[#A32110]/90 font-semibold w-full"
            >
              Return to Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
