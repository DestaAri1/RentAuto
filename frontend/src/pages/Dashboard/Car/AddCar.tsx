import React, { useState, useRef } from "react";
import DashboardLayout from "../../../layout/DashboardLayout.tsx";
import {
  Car,
  ImagePlus,
  DollarSign,
  Type,
  Users,
  Hash,
  Edit,
} from "lucide-react";

export default function AddCar() {
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "",
    seats: "",
    amount: "",
    image: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: "Create Car", current: true },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Mencegah refresh halaman
    e.preventDefault();

    // Validasi form
    if (
      !formData.name ||
      !formData.price ||
      !formData.type ||
      !formData.seats ||
      !formData.amount
    ) {
      alert("Harap isi semua field");
      return;
    }

    // Proses form data
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("type", formData.type);
    submitData.append("seats", formData.seats);
    submitData.append("amount", formData.amount);

    // Tambahkan gambar jika ada
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    // Contoh cara mengirim data (ganti dengan metode API yang sesuai)
    try {
      // Misalnya menggunakan fetch atau axios
      // fetch('/api/cars', {
      //   method: 'POST',
      //   body: submitData
      // })
      console.log("Form Data:", Object.fromEntries(submitData));

      // Reset form setelah submit
      setFormData({
        name: "",
        price: "",
        type: "",
        seats: "",
        amount: "",
        image: null,
      });
      setPreview(null);

      // Bisa tambahkan notifikasi sukses
      alert("Mobil berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan mobil:", error);
      alert("Gagal menambahkan mobil. Silakan coba lagi.");
    }
  };

  return (
    <DashboardLayout title="Create Car" breadcrumb={breadcrumbItems}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Add New Car
          </h2>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Image Upload Section */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {preview ? (
                <div
                  className="relative cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={preview}
                    alt="Car Preview"
                    className="w-full h-80 object-cover rounded-2xl transition-all duration-300 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-2xl">
                    <div className="bg-white p-3 rounded-full shadow-lg">
                      <Edit className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl h-80 hover:border-indigo-500 transition-colors duration-300 cursor-pointer"
                  onClick={handleImageClick}
                >
                  <div className="flex flex-col items-center text-gray-500">
                    <ImagePlus className="w-12 h-12 mb-4 text-indigo-500" />
                    <span className="text-lg font-medium">
                      Click to upload car image
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Name */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Car Name
                </label>
                <div className="flex items-center border-2 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <Car className="w-5 h-5 text-gray-500 mr-3" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter car name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Price
                </label>
                <div className="flex items-center border-2 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Car Type
                </label>
                <div className="flex items-center border-2 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <Type className="w-5 h-5 text-gray-500 mr-3" />
                  <input
                    type="text"
                    name="type"
                    placeholder="SUV, Sedan, etc."
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Seats */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Number of Seats
                </label>
                <div className="flex items-center border-2 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <Users className="w-5 h-5 text-gray-500 mr-3" />
                  <input
                    type="number"
                    name="seats"
                    placeholder="Enter seat count"
                    value={formData.seats}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="relative col-span-1 md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Available Amount
                </label>
                <div className="flex items-center border-2 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <Hash className="w-5 h-5 text-gray-500 mr-3" />
                  <input
                    type="number"
                    name="amount"
                    placeholder="How many cars are available"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            >
              Create Car Listing
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
