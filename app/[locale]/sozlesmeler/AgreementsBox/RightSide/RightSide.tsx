import React from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

export default function RightSide() {
  return (
    <div className="w-[68%] h-full pt-5 pl-8 text-[#262626] prose prose-lg max-w-none">
      <p className="text-[#262626] font-bold text-[24px] pb-4">
        Çerez Aydınlatma Metni
      </p>
      <div dangerouslySetInnerHTML={{ __html: mdText }} />
    </div>
  );
}
