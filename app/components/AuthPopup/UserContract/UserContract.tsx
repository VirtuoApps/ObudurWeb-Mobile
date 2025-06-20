import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const mdText = `<div class="prose  ">

  <h2 class="text-xl font-semibold mt-1">1. Çerez Nedir?</h2>
  <p class="mt-2">Çerezler, internet sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet, cep telefonu vb.) indirilen küçük metin dosyalarıdır. Çerezler, ziyaretçi deneyimini iyileştirmek, web sitesinin daha etkin çalışmasını sağlamak ve web sitesi sahiplerine bilgi sağlamak amacıyla kullanılmaktadır.</p>

  <h2 class="text-xl font-semibold mt-6">2. Çerez Türleri ve Kullanım Amaçları</h2>

  <h3 class="text-lg font-semibold mt-4">2.1. Zorunlu Çerezler</h3>
  <p class="mt-2">Bu çerezler, web sitesinin temel fonksiyonlarını gerçekleştirebilmesi için zorunludur. Örneğin, kullanıcı oturumunun sürdürülmesi ve güvenlik amaçları için kullanılırlar.</p>

  <h3 class="text-lg font-semibold mt-4">2.2. İşlevsel Çerezler</h3>
  <p class="mt-2">Bu çerezler, web sitesinin kullanıcı tercihlerine göre işlev göstermesini sağlar. Örneğin, dil tercihleriniz veya oturum bilgilerinizi hatırlamak gibi.</p>

  <h3 class="text-lg font-semibold mt-4">2.3. Analitik ve Performans Çerezleri</h3>
  <p class="mt-2">Bu çerezler, web sitesi ziyaretçilerinin davranışlarını analiz etmek amacıyla kullanılır. Bu sayede site performansı ve kullanıcı deneyimi geliştirilebilir.</p>

  <h3 class="text-lg font-semibold mt-4">2.4. Reklam ve Pazarlama Çerezleri</h3>
  <p class="mt-2">Bu çerezler, kullanıcıların web sitesi içindeki davranışlarını analiz ederek, hedefli reklam ve pazarlama faaliyetlerinin yürütülmesine olanak tanır.</p>

  <h2 class="text-xl font-semibold mt-6">3. Çerezlerin Yönetimi ve Silinmesi</h2>
  <p class="mt-2">Tarayıcı ayarlarınızdan çerezleri yönetebilir veya tamamen silebilirsiniz. Bu ayarlar tarayıcınızın “Ayarlar” veya “Tercihler” menüsünden yapılabilmektedir. Çerezleri devre dışı bırakmanız durumunda web sitemizin bazı özellikleri düzgün çalışmayabilir.</p>

  <h2 class="text-xl font-semibold mt-6">4. Veri Sahibinin Hakları</h2>
  <p class="mt-2">Kişisel Verilerin Korunması Kanunu kapsamında veri sahibi olarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme haklarına sahipsiniz.</p>
  <p class="mt-2">Haklarınızı kullanmak için <span class="font-semibold">[iletişim bilgilerini buraya ekleyin]</span> adresinden bizimle iletişime geçebilirsiniz.</p>

  <h2 class="text-xl font-semibold mt-6">5. Güncelleme ve Değişiklikler</h2>
  <p class="mt-2">Bu Çerez Aydınlatma Metni, gerekli görüldüğü takdirde güncellenebilir. Yapılan değişiklikler, web sitemizde yayınlanarak yürürlüğe girecektir.</p>
</div>

`;

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function UserContract({ isOpen, setIsOpen }: Props) {
  const onClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl mx-4 rounded-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between border-solid border-b border-b-[#EBEAF1] p-6">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Kullanıcı Sözleşmesi
          </h2>

          <button
            className="text-[#262626] hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div
          className="prose prose-sm text-gray-600 max-h-[60vh] overflow-y-auto p-6 pb-12"
          dangerouslySetInnerHTML={{ __html: mdText }}
        ></div>

        <div className="flex flex-row items-center justify-between border-solid border-t border-t-[#EBEAF1] p-6">
          <button
            className={`w-full py-[16px] px-[24px] rounded-2xl font-medium text-[16px] cursor-pointer bg-[#5E5691] text-white`}
            onClick={onClose}
            type="button"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
