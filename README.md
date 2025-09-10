# 🛒 Ecommerce Website Project

Bu proje, hem **kullanıcıların** hem de **admin (site sahibi)** tarafının kullanabildiği bir e-ticaret platformudur.  
Kullanıcılar ürünleri görüntüleyebilir, sepete ekleyebilir ve sipariş oluşturabilir. Admin tarafı ise ürün ekleyebilir, stok ve siparişleri yönetebilir.

## 🚀 Özellikler

### 👤 Kullanıcı Tarafı

- Ürünleri görüntüleme ve detayları inceleme
- Sepete ürün ekleme veya çıkarma
- Sipariş oluşturma
- Sipariş detaylarını görüntüleme
- Hesap bilgilerini güncelleme
- Adresp bilgilerini güncelleme

### 🛠️ Admin Tarafı

- Yeni ürün ekleme, düzenleme ve silme
- Siparişleri görüntüleme ve durum güncelleme
- Kullanıcı bilgilerine erişim ve yönetim

## 🏗️ Teknolojiler

- **Frontend:** React.js, Context API, Axios
- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB, Cloudinary
- **Authentication:** JWT tabanlı kimlik doğrulama
- **Cloud Storage:** Cloudinary (ürün görselleri)

## 📦 Kurulum ve Çalıştırma

1. Reponun kopyasını al:

```bash
git clone https://github.com/kullaniciAdi/proje-adi.git
```

2. Backend bağımlılıklarını yükle:

```bash
cd backend
npm install
```

3. Frontend bağımlılıklarını yükle:

```bash
cd frontend
npm install
```

4. Ortam değişkenlerini ayarla:  
   `.env.example` dosyasını kopyalayın ve kendi değerlerinizi doldurun:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

5. Backend ve Frontend’i çalıştırın:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🔑 Giriş Bilgileri

- **Admin:** Site sahibi, ürün ekleyip siparişleri yönetebilir
- **Kullanıcı:** Kayıt olup ürün satın alabilir
  -Default olarak her kullanıcı user olarak eklenir. Kullandığınız veritabanı üzerinden admin rolunü ekleyebilirsiniz.

## 📫 İletişim

- **Email:** ozzencben@gmail.com
- **LinkedIn:** [Özenç Dönmezer](https://www.linkedin.com/in/%C3%B6zen%C3%A7-d%C3%B6nmezer-769125357/)

💡 Bu proje, full-stack geliştirme pratiği için hazırlanmış olup, kullanıcı ve admin akışlarını kapsayan uçtan uca bir e-ticaret deneyimi sunar.
