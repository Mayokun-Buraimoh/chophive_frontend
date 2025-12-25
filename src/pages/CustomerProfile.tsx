import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../api";
import { UserProfile } from "../lib/interface";
import { Loader2, UserCircle } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setError("You are not logged in.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(userId);
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <div className="container mx-auto px-4 max-w-4xl py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <UserCircle size={80} className="text-gray-500" />
          )}

          <div>
            <h1 className="text-2xl font-bold text-white">
              {profile.username}
            </h1>
            <p className="text-gray-400 text-sm">
              {profile.department} · Level {profile.level}
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileItem label="Email" value={profile.user.email} />
          <ProfileItem label="Phone" value={profile.phone} />
          <ProfileItem label="Gender" value={profile.gender} />
          <ProfileItem label="Hostel" value={profile.hostel} />
          <ProfileItem label="Room Number" value={profile.room_number} />
          <ProfileItem label="Address" value={profile.address} />
          <ProfileItem
            label="Favorite Cafeteria"
            value={profile.favorite_cafeteria}
          />
          <ProfileItem
            label="Dietary Preferences"
            value={profile.dietary_preferences}
          />
          <ProfileItem label="Date of Birth" value={profile.date_of_birth} />
        </div>
        <p>Joined on {profile.user.date_joined}</p>
      </div>
    </section>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-medium">{value || "—"}</p>
    </div>
  );
}
