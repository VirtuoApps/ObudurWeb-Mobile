import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa"; // Assuming you have react-icons installed
import CitySelect from "@/app/components/CitySelect/CitySelect";
import SuccessPopup from "@/app/components/SuccessPopup/SuccessPopup";

export default function FormSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "phone") setPhone(value);
    if (name === "email") setEmail(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleDocumentClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted!");
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Email:", email);
    console.log("Selected City:", selectedCity);
    console.log("Selected File:", selectedFile);

    // Show success popup
    setShowSuccessPopup(true);
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    // Reset form
    setName("");
    setPhone("");
    setEmail("");
    setSelectedCity(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    // Basic validation: check if all fields have a value
    const isValid =
      name.trim() !== "" &&
      phone.trim() !== "" &&
      email.trim() !== "" &&
      selectedCity !== null &&
      selectedFile !== null;
    setIsFormValid(isValid);
  }, [name, phone, email, selectedCity, selectedFile]);

  return (
    <>
      <div className="bg-white p-8">
        <form className="space-y-6" onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="name" className="sr-only">
                İsim Soyisim
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="İsim Soyisim"
                value={name}
                onChange={handleInputChange}
                className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Telefon"
                value={phone}
                onChange={handleInputChange}
                className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                E-Posta
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="E-Posta"
                value={email}
                onChange={handleInputChange}
                className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label htmlFor="city" className="sr-only">
                Şehir
              </label>
              <CitySelect
                selectedCity={selectedCity}
                setSelectedCity={handleCitySelect}
                defaultText="Şehir"
                extraClassName="w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:border-indigo-500 sm:text-sm bg-[#fff] text-gray-500 focus:none focus:ring-0"
              />
            </div>

            <div
              className="relative border border-[#F0F0F0] rounded-2xl bg-[#fff] flex items-center justify-between px-4 py-4 cursor-pointer"
              onClick={handleDocumentClick}
            >
              <label
                htmlFor="document"
                className="block text-sm text-gray-500 cursor-pointer"
              >
                {selectedFile
                  ? selectedFile.name
                  : "Döküman (CV, Portfolyo vb)"}
              </label>
              <input
                type="file"
                name="document"
                id="document"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="sr-only"
              />
              {!selectedFile && <FaPlus className="text-gray-500" />}
            </div>

            <div>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isFormValid
                    ? "bg-[#5E5691] hover:bg-[#4c4677] text-white"
                    : "bg-[#F0F0F0] text-[#8C8C8C] cursor-not-allowed"
                }`}
              >
                Gönder
              </button>
            </div>
          </div>
        </form>
      </div>

      <SuccessPopup isOpen={showSuccessPopup} onClose={handleClosePopup} />
    </>
  );
}
