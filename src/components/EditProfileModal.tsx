import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserProfile, UpdateUserProfilePayload } from "../lib/interface";
import { updateUserProfile } from "../../api";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  userId: string | null;
  onSuccess: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  userId,
  onSuccess,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    username: profile.username || "",
    phone: profile.phone || "",
    address: profile.address || "",
    gender: profile.gender || "",
    image: profile.image || "",
    date_of_birth: profile.date_of_birth || "",
    hostel: profile.hostel || "",
    room_number: profile.room_number || "",
    level: profile.level?.toString() || "",
    department: profile.department || "",
    favorite_cafeteria: profile.favorite_cafeteria || "",
    dietary_preferences: profile.dietary_preferences || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        username: profile.username || "",
        phone: profile.phone || "",
        address: profile.address || "",
        gender: profile.gender || "",
        image: profile.image || "",
        date_of_birth: profile.date_of_birth || "",
        hostel: profile.hostel || "",
        room_number: profile.room_number || "",
        level: profile.level?.toString() || "",
        department: profile.department || "",
        favorite_cafeteria: profile.favorite_cafeteria || "",
        dietary_preferences: profile.dietary_preferences || "",
      });
      setError(null);
    }
  }, [isOpen, profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: any = {};

      // Only include fields that have values (not empty strings)
      // Skip image field - backend expects file upload, not URL string
      if (formData.username.trim()) payload.username = formData.username.trim();
      if (formData.phone.trim()) payload.phone = formData.phone.trim();
      if (formData.address.trim()) payload.address = formData.address.trim();
      if (formData.gender.trim()) payload.gender = formData.gender.trim();
      if (formData.date_of_birth.trim()) payload.date_of_birth = formData.date_of_birth.trim();
      if (formData.hostel.trim()) payload.hostel = formData.hostel.trim();
      if (formData.room_number.trim()) payload.room_number = formData.room_number.trim();
      if (formData.level.trim()) {
        const levelNum = parseInt(formData.level);
        if (!isNaN(levelNum)) payload.level = levelNum;
      }
      if (formData.department.trim()) payload.department = formData.department.trim();
      if (formData.favorite_cafeteria.trim()) payload.favorite_cafeteria = formData.favorite_cafeteria.trim();
      if (formData.dietary_preferences.trim()) payload.dietary_preferences = formData.dietary_preferences.trim();

      await updateUserProfile(userId, payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E1E1E] rounded-2xl border border-gray-700 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1E1E1E] border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] resize-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-gray-700 bg-gray-900/50 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date of Birth
              </label>
              <Input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Hostel */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hostel
              </label>
              <Input
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Number
              </label>
              <Input
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Level
              </label>
              <Input
                name="level"
                type="number"
                value={formData.level}
                onChange={handleChange}
                min="1"
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              <Input
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Favorite Cafeteria */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Favorite Cafeteria
              </label>
              <Input
                name="favorite_cafeteria"
                value={formData.favorite_cafeteria}
                onChange={handleChange}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <Input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              />
            </div>

            {/* Dietary Preferences */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dietary Preferences
              </label>
              <textarea
                name="dietary_preferences"
                value={formData.dietary_preferences}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free..."
                className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

