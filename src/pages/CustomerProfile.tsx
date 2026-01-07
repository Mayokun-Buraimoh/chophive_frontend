import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../api";
import { UserProfile } from "../lib/interface";
import { Loader2, UserCircle, Edit2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import EditProfileModal from "../components/EditProfileModal";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const { userId, isAuthenticated, isLoading } = useAuth();

  const loadProfile = async () => {
    try {
      const data = await fetchUserProfile(userId);
      setProfile(data);
      setError("");
    } catch (err) {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (isLoading) return;

    if (!isAuthenticated) {
      setError("You are not logged in.");
      setLoading(false);
      navigate("/login");
      return;
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, userId, navigate]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    await loadProfile();
  };

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.username}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#A32110]"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-700 flex items-center justify-center border-2 border-[#A32110]">
                    <UserCircle
                      size={40}
                      className="text-gray-500 md:w-10 md:h-10"
                    />
                  </div>
                )}

                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                    {profile.username}
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                    {profile.department || "—"} · Level {profile.level || "—"}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowEditModal(true)}
                className="bg-[#A32110] hover:bg-[#A32110]/90 text-white w-full sm:w-auto"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
              <ProfileItem
                label="Date of Birth"
                value={profile.date_of_birth}
              />
            </div>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm md:text-base">
            Joined on{" "}
            {new Date(profile.user.date_joined).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {profile && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profile}
          userId={userId}
          onSuccess={handleProfileUpdate}
        />
      )}
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
    <div className="pb-3 md:pb-4 border-b border-gray-700 last:border-b-0 sm:last:border-b sm:border-b">
      <p className="text-gray-400 text-xs sm:text-sm mb-1 md:mb-2">{label}</p>
      <p className="text-white text-sm sm:text-base font-medium break-words">
        {value || "—"}
      </p>
    </div>
  );
}
