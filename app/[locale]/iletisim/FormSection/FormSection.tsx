import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa"; // Assuming you have react-icons installed
import CitySelect from "@/app/components/CitySelect/CitySelect";
import SuccessPopup from "@/app/components/SuccessPopup/SuccessPopup";

export default function FormSection() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "firstName") setName(value);
    if (name === "lastName") setLastName(value);
    if (name === "phone") setPhone(value);
    if (name === "email") setEmail(value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24; // Approximate line height in pixels
      const maxHeight = lineHeight * 4; // 4 rows max

      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
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
      message.trim() !== "" &&
      isChecked;
    setIsFormValid(isValid);
  }, [name, phone, email, message, isChecked]);

  return (
    <>
      <div className="bg-white p-8 rounded-2xl flex md:flex-row flex-col">
        <div className="w-full md:w-1/2">
          <p className="text-[#262626] text-4xl font-extrabold mb-4 ">
            İletişim Formu
          </p>
          <p className="text-[#595959] text-base mb-6 font-normal">
            Purus metus integer luctus sed. Ultricies eget ut egestas curabitur
            nullam posuere vitae. Tristique adipiscing sit sollicitudin eget
            pellentesque eget massa amet. Sed suspendisse curabitur et eu quis
            ultricies nulla. Sodales adipiscing enim at augue scelerisque.
          </p>
        </div>
        <form className="space-y-6 w-full md:w-1/2" onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="sr-only">
                İsim
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="İsim"
                value={name}
                onChange={handleInputChange}
                className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">
                Soyisim
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Soyisim"
                value={lastName}
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

          <div className="w-full">
            <div>
              <label htmlFor="message" className="sr-only">
                Mesajınız
              </label>
              <textarea
                name="message"
                id="message"
                placeholder="Mesajınız"
                value={message}
                onChange={handleMessageChange}
                rows={4}
                className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800 overflow-hidden"
                ref={textareaRef}
              />
            </div>
          </div>

          <div className="w-full flex md:flex-row flex-col justify-between">
            <div className="flex flex-row items-center">
              <div
                className="w-[24px] h-[24px] flex items-center justify-center rounded-md border border-[#D9D9D9] bg-white mr-3 cursor-pointer"
                onClick={() => setIsChecked(!isChecked)}
              >
                {isChecked && (
                  <img
                    src="/check.png"
                    alt="check"
                    className="w-[16px] h-[16px] object-cover"
                  />
                )}
              </div>
              <p className="font-medium text-sm text-[#8C8C8C]">
                <span className="text-[#595959] underline">
                  Kullanıcı sözleşmesini
                </span>{" "}
                okudum, kabul ediyorum.
              </p>
            </div>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-[300px] flex justify-center py-4 px-4 border border-transparent rounded-2xl text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:mt-0 mt-5 ${
                isFormValid
                  ? "bg-[#5E5691] hover:bg-[#4c4677] text-white"
                  : "bg-[#F0F0F0] text-[#8C8C8C] cursor-not-allowed"
              }`}
            >
              Gönder
            </button>
          </div>
        </form>
      </div>

      <SuccessPopup isOpen={showSuccessPopup} onClose={handleClosePopup} />
    </>
  );
}
