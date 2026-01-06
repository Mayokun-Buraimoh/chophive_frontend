/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { X, Loader2, MapPin, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserProfile, Hostel } from "../lib/interface";
import { updateUserProfile, fetchHostels } from "../../api";

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
  // Hostels state for dropdowns (new)
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  // Classic form state (the values we will save)
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

  // Fetch hostels once, and set defaults if available
  useEffect(() => {
    if (isOpen) {
      fetchHostels().then((data) => {
        setHostels(data || []);
        // Preselect hostel by name if it's present in profile!
        if (profile.hostel) {
          const h = data?.find((h: Hostel) => h.name === profile.hostel);
          setSelectedHostel(h || null);
        }
      });
    }
  }, [isOpen, profile.hostel]);

  useEffect(() => {
    // When hostel is changed fresh (dropdown), set form value and reset room
    if (selectedHostel) {
      setFormData((prev) => ({ ...prev, hostel: selectedHostel.name }));
      setSelectedRoom("");
    }
  }, [selectedHostel]);

  useEffect(() => {
    // When room is changed, update in formData.
    setFormData((prev) => ({ ...prev, room_number: selectedRoom }));
  }, [selectedRoom]);

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
      // Preselect correct hostel and room for dropdowns
      if (hostels.length && profile.hostel) {
        const foundHostel = hostels.find((h) => h.name === profile.hostel);
        setSelectedHostel(foundHostel || null);
        setSelectedRoom(profile.room_number || "");
      }
    }
  }, [isOpen, profile, hostels]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // If user changes hostel directly (not via select), update dropdown
    if (name === "hostel") {
      const h = hostels.find((h) => h.name === value) || null;
      setSelectedHostel(h);
    }
    if (name === "room_number") {
      setSelectedRoom(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: any = {};
      if (formData.username.trim()) payload.username = formData.username.trim();
      if (formData.phone.trim()) payload.phone = formData.phone.trim();
      if (formData.address.trim()) payload.address = formData.address.trim();
      if (formData.gender.trim()) payload.gender = formData.gender.trim();
      if (formData.date_of_birth.trim())
        payload.date_of_birth = formData.date_of_birth.trim();
      if (selectedHostel) payload.hostel = selectedHostel.name;
      else if (formData.hostel.trim()) payload.hostel = formData.hostel.trim();
      if (selectedRoom) payload.room_number = selectedRoom;
      else if (formData.room_number.trim())
        payload.room_number = formData.room_number.trim();
      if (formData.level.trim()) {
        const levelNum = parseInt(formData.level);
        if (!isNaN(levelNum)) payload.level = levelNum;
      }
      if (formData.department.trim())
        payload.department = formData.department.trim();
      if (formData.favorite_cafeteria.trim())
        payload.favorite_cafeteria = formData.favorite_cafeteria.trim();
      if (formData.dietary_preferences.trim())
        payload.dietary_preferences = formData.dietary_preferences.trim();
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
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
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
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
              />
            </div>
            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <textarea
                title="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110] resize-none"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                title="select gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-gray-700 bg-gray-900/50 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
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
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
              />
            </div>
            {/*Hostel Dropdown*/}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4" />
                Hostel
              </label>
              <select
                name="hostel"
                title="Select Hostel"
                value={selectedHostel?.name || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110]"
              >
                <option value="">Select your hostel</option>
                {hostels.map((hostel) => (
                  <option
                    key={hostel.id}
                    value={hostel.name}
                    className="bg-gray-900"
                  >
                    {hostel.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Room Number Dropdown */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Home className="w-4 h-4" />
                Room Number
              </label>
              <select
                name="room_number"
                title="Select Room Number"
                value={selectedRoom || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110]"
              >
                <option value="">Select your room number</option>
                {selectedHostel?.rooms.length === 0 && (
                  <option value="" disabled className="bg-gray-900">
                    No rooms available for this hostel
                  </option>
                )}
                {selectedHostel?.rooms.map((room) => (
                  <option
                    key={room.id}
                    value={room.number}
                    className="bg-gray-900"
                  >
                    {room.number}
                  </option>
                ))}
              </select>
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
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
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
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
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
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
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
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
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
                className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110] resize-none"
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
              className="flex-1 bg-[#A32110] hover:bg-[#A32110]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
