"use client";

import React, { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

interface AccordionItem {
  id: string;
  title: string;
  items?: {
    id: string;
    title: string;
    mdText?: string;
  }[];
}

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

// Custom Chevron Components
const ChevronUp = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 14.5L12 9.5L17 14.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 9.5L12 14.5L17 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Boxes({
  handleItemClick,
  selectedItem,
}: {
  handleItemClick: (item: { title: string; mdText: string }) => void;
  selectedItem: { title: string; mdText: string } | null;
}) {
  const [openSections, setOpenSections] = useState<string[]>([
    "sozlesmeler",
    // "kurallar",
    // "cerezler",
  ]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const itemId = searchParams.get("itemId");

  useEffect(() => {
    if (id && itemId) {
      const section = accordionData.find((section) => section.id === id);

      const item = section?.items?.find((item) => item.id === itemId);

      if (item) {
        handleItemClick({
          title: item.title,
          mdText: item.mdText || "",
        });
      }
    } else {
      handleItemClick({
        title: "Çerez Aydınlatma Metni",
        mdText: mdText,
      });
    }
  }, [id, itemId]);

  const accordionData: AccordionItem[] = [
    {
      id: "sozlesmeler",
      title: "Sözleşmeler",
      items: [
        { id: "bireysel", title: "Bireysel Hesap Sözleşmesi", mdText },
        { id: "kurumsal", title: "Kurumsal Hesap Sözleşmesi", mdText },
      ],
    },
    {
      id: "kurallar",
      title: "Kurallar Politikalar",
      items: [
        { id: "kullanim", title: "Kullanım Koşulları", mdText },
        { id: "ilan", title: "İlan Verme Kuralları", mdText },
        { id: "icerik", title: "İçerik Politikası", mdText },
        { id: "kvkk", title: "KVKK Metni", mdText },
      ],
    },
    {
      id: "cerezler",
      title: "Çerezler",
      items: [
        { id: "tercihler", title: "Çerez Tercihleri", mdText },
        {
          id: "aydinlatma",
          title: "Çerez Aydınlatma Metni",
          mdText,
        },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="w-full space-y-1 mt-2">
      {accordionData.map((section) => (
        <div key={section.id}>
          {/* Section Header */}
          <div
            className={`h-12 flex items-center justify-between px-3 cursor-pointer ${openSections.includes(section.id) ? "bg-[#F5F5F5] rounded-2xl text-[#8C8C8C]" : "bg-white text-[#262626]"}`}
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-sm font-medium">
              {section.title}
            </span>
            {openSections.includes(section.id) ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>

          {/* Section Items */}
          {openSections.includes(section.id) && section.items && (
            <div className="mt-1 space-y-1">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="h-9  rounded-2xl flex items-center px-3  transition-colors cursor-pointer"
                  onClick={() =>
                    handleItemClick({
                      title: item.title,
                      mdText: item.mdText || "",
                    })
                  }
                >
                  <div className="flex items-center justify-between w-full pl-11">
                    <span
                      className={`${
                        item.title === selectedItem?.title
                          ? "text-[#362C75] font-medium"
                          : "text-[#262626] font-normal"
                      } text-sm `}
                    >
                      {item.title}
                    </span>
                    {item.title === selectedItem?.title && (
                      <div className="w-2 h-2 rounded-full bg-[#362C75]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
