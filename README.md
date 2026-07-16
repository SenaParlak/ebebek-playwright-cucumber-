# e-bebek Playwright Cucumber Test Otomasyon Projesi

Proje kapsamında kullanıcı giriş işlemleri, negatif login kontrolleri, logout, ürün arama, sepet iş akışı ve oturum devamlılığı senaryoları test edilmiştir.

---

## Kullanılan Teknolojiler

- JavaScript
- Playwright
- Cucumber.js
- dotenv
- cross-env


## Kurulum

Projeyi local ortamda çalıştırmak için repoyu klonlayın:

```bash
git clone <repository-url>
cd ebebek-playwright-cucumber
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Playwright browser kurulumunu yapın:

```bash
npx playwright install
```

---

## Ortam Değişkenleri

Proje root dizininde `.env` dosyası oluşturulmalıdır.

Örnek dosyadan `.env` oluşturmak için:

```bash
cp .env.example .env
```

Örnek `.env` içeriği:

```env
BASE_URL=https://www.e-bebek.com
BROWSER=chromium
HEADLESS=false
DEFAULT_TIMEOUT=15000

TEST_USER_EMAIL=
TEST_USER_PASSWORD=
TEST_USER_PHONE=

UNREGISTERED_EMAIL=
INVALID_PASSWORD=
```

Login senaryolarının çalışabilmesi için geçerli kullanıcı bilgileri `.env` dosyasına eklenmelidir.

---

## Testleri Çalıştırma

Tüm testleri çalıştırmak için:

```bash
npm test
```

Belirli bir tag ile test çalıştırmak için:

```bash
npm test -- --tags "@login"
```

```bash
npm test -- --tags "@cart"
```

```bash
npm test -- --tags "@cartState"
```

Headed mode ile çalıştırmak için:

```bash
npm run test:headed
```

---

## Paralel Koşum

Testleri paralel çalıştırmak için:

```bash
npm run test:parallel
```

Paralel koşumda her senaryo ayrı browser context içinde çalıştırılır. Böylece cookie, localStorage ve session bilgileri senaryolar arasında taşınmaz.

---

## Test Senaryoları

Projede aşağıdaki ana test alanları bulunmaktadır:

### Login Senaryoları

- Geçerli e-posta ile başarılı giriş
- Geçerli telefon numarası ile başarılı giriş
- Geçersiz şifre ile başarısız giriş
- Kayıtsız kullanıcı ile login denemesi
- Boş alan validasyonları

### Logout Senaryosu

- Başarılı giriş sonrası kullanıcı çıkışı

### Search Senaryoları

- Ürün arama alanına değer yazılması
- Arama submit davranışının gözlemlenmesi

### Sepet İş Akışı

- Ürün sepete ekleme
- Ürün adedi artırma
- Ürün silme
- Sepet toplamının fiyat metinlerinden parse edilerek doğrulanması

### Oturum Devamlılığı

- Misafir kullanıcı olarak sepete ürün ekleme
- Aynı browser context içinde giriş yapma
- Login sonrasında sepetin korunup korunmadığını doğrulama

---

## Test İzolasyonu

Test izolasyonu `src/support/hooks.js` dosyasında yönetilmektedir.

Kullanılan hook yapısı:

- `BeforeAll`: Browser başlatılır.
- `Before`: Her senaryo için yeni browser context ve page oluşturulur.
- `After`: Senaryo sonunda page ve context kapatılır.
- `AfterAll`: Browser kapatılır.

---

## Page Object Model Yaklaşımı

Projede Page Object Model kullanılmıştır.

Locator ve sayfa aksiyonları `src/pages/` altında tutulmaktadır. Step definition dosyalarında doğrudan locator kullanımı minimumda tutulmuş, işlemler page object methodları üzerinden yönetilmiştir.

Bu yaklaşım sayesinde:

- Kod tekrarı azaltılmıştır.
- Step dosyaları daha okunabilir hale getirilmiştir.
- Locator değişiklikleri tek bir dosyadan yönetilebilir hale gelmiştir.
- Feature dosyaları iş diline yakın tutulmuştur.

---

## DRY Yaklaşımı

Step definition dosyalarında hazır step’lerin tekrar kullanılmasına dikkat edilmiştir.

Ortak işlemler page object methodları üzerinden yönetilmiştir. Böylece aynı aksiyonların farklı step dosyalarında tekrar tekrar yazılması engellenmiştir.

Örneğin login, logout, cart ve cart state senaryolarında ilgili aksiyonlar ayrı page class’ları içinde yönetilmiştir.

---

## Known Issue / Test Gözlemi

Search fonksiyonu `emzik` kelimesi ile test edilmiştir.

Otomasyon koşumlarında search input alanının görünür ve editable olduğu, arama kelimesinin input alanına yazılabildiği gözlemlenmiştir. Ancak Enter ile arama submit edildikten sonra ürün listesinin her koşumda tutarlı şekilde güncellenmediği görülmüştür.

Manuel kullanımda arama çalışmasına rağmen, otomasyon koşumlarında zaman zaman ana sayfa öneri ürünleri okunabilmektedir.

Bu nedenle search senaryosu false-positive oluşturmamak adına known issue/flaky test gözlemi olarak dokümante edilmiştir.

---

## Cucumber Tag Kullanımı

Senaryolar tag yapısıyla ayrılmıştır.

Kullanılan bazı tag’ler:

```text
@login
@negativeLogin
@search
@cart
@cartState
@smoke
```

Örnek kullanım:

```bash
npm test -- --tags "@cartState"
```

---

## GitHub ve Pull Request Süreci

Proje GitHub üzerinde versiyonlanmıştır. Geliştirmeler anlamlı commit mesajları ile yapılmıştır.

## AI Kullanımı ve Hesap Verebilirlik

Bu projede kod asistanı; senaryo tasarımı, selector stratejisi, hata analizi, README düzenleme ve refactor önerileri için destekleyici araç olarak kullanılmıştır.

AI tarafından önerilen kodlar doğrudan kabul edilmeden önce local ortamda çalıştırılmış, hata çıktıları analiz edilmiş ve gerekli düzeltmeler manuel olarak uygulanmıştır.

Test sonuçları, assertion kararları ve nihai teknik tercihler geliştirici tarafından kontrol edilmiştir.

## Author

**Mehpare Sena Parlak**

- GitHub: https://github.com/SenaParlak