# Lazy Ant Formatter — Faz 1 Görev Listesi

Kurallar:
- Görevleri sırayla yap, bir grubu bitirmeden diğerine geçme.
- Her CHECKPOINT işaretine gelince DUR, o ana kadar yapılanları özetle, bir sonraki gruba geçme.
- Her alt görevi bitirince kısa bir git commit at.
- Her değişiklikten sonra `npm run build` çalıştır, hata varsa düzelt.

## Grup A — Proje iskeleti ve çekirdek dönüştürme motoru
- [ ] Next.js projesini TypeScript ile başlat (`npx create-next-app@latest . --typescript`)
- [ ] papaparse ve xlsx (SheetJS) paketlerini kur
- [ ] lib/adapters/ klasörü oluştur
- [ ] lib/adapters/csv.ts — CSV'yi JSON'a, JSON'u CSV'ye çeviren fonksiyonlar
- [ ] lib/adapters/excel.ts — Excel'i JSON'a, JSON'u Excel'e çeviren fonksiyonlar
- [ ] Basit bir test scripti ile iki adapter'ı da doğrula (örnek bir dosya ile)

**CHECKPOINT A — Dur, özet çıkar, devam etme**

## Grup B — Akıllı sütun eşleştirme
- [ ] Sütun başlıklarından tip tahmini yapan bir fonksiyon yaz (email, telefon, tarih, sayı, metin)
- [ ] Kullanıcının otomatik tahmini override edebileceği bir mapping veri yapısı tasarla
- [ ] Bunu adapter'lara entegre et

**CHECKPOINT B — Dur, özet çıkar, devam etme**

## Grup C — API endpoint
- [ ] /api/convert endpoint'i: dosya yükleme + format algılama + dönüştürme
- [ ] Hata yönetimi: bozuk dosya, desteklenmeyen format, boş dosya
- [ ] curl ile manuel test için örnek komutları README'ye ekle

**CHECKPOINT C — Dur, özet çıkar, devam etme**

## Grup D — Basit web UI
- [ ] Tek sayfa: dosya yükleme alanı
- [ ] Algılanan sütun eşleştirmesini gösteren ve düzenlenebilir basit bir tablo
- [ ] Sonucu görüntüleme ve indirme butonu

**CHECKPOINT D — Dur, özet çıkar, devam etme**

## Grup E — Deploy
- [ ] Vercel'e deploy et
- [ ] README'yi güncelle: proje amacı, nasıl çalıştırılır, canlı link

**CHECKPOINT E — Sprint 1 tamamlandı, tam özet çıkar**
## Grup F — TSV ve XML desteği
- [ ] lib/adapters/tsv.ts — TSV↔JSON dönüştürme (CSV adapter'ına benzer, delimiter tab)
- [ ] xml paketi kur (fast-xml-parser)
- [ ] lib/adapters/xml.ts — XML↔JSON dönüştürme
- [ ] Yeni formatları format algılama mantığına ve UI'daki format seçiciye ekle
- [ ] Test scriptini yeni adapter'ları da kapsayacak şekilde genişlet

**CHECKPOINT F — Dur, özet çıkar, devam etme**

## Grup G — YAML desteği ve export-only formatlar
- [ ] yaml paketi kur (js-yaml)
- [ ] lib/adapters/yaml.ts — YAML↔JSON dönüştürme
- [ ] lib/exporters/sql.ts — JSON'dan SQL INSERT statement üretimi (tek yönlü, import yok)
- [ ] lib/exporters/markdown.ts — JSON'dan Markdown tablosu üretimi (tek yönlü, import yok)
- [ ] UI'da export-only formatları "sadece dışa aktarım" olarak net şekilde işaretle

**CHECKPOINT G — Dur, özet çıkar, devam etme**

## Grup H — Sayfa ayrımı: karşılama + dönüştürücü
- [ ] Yeni bir `/` karşılama sayfası oluştur: hero, kısa açıklama, desteklenen
      formatların görsel gösterimi (çift yönlü vs export-only formatlar net
      ayrılmış şekilde), "Dönüştürmeye Başla" butonu
- [ ] Mevcut dönüştürücü arayüzünü `/convert` rotasına taşı
- [ ] Navigasyon/header'ı her iki sayfada da tutarlı hale getir

**CHECKPOINT H — Dur, özet çıkar, devam etme**

## Grup I — Marka kimliği
- [ ] Basit bir logo/favicon tasarla (karınca temalı, minimal, SVG olarak)
- [ ] Format rozetlerine (CSV, XML, YAML vs.) küçük ikonlar ekle
- [ ] "Lazy ant" konseptine uygun, abartısız bir görsel dokunuş ekle (maskot/illüstrasyon,
      çok baskın olmayan bir köşe öğesi gibi)

**CHECKPOINT I — Dur, özet çıkar, devam etme**

## Grup J — Genel tasarım cilası
- [ ] Mikro-copy'yi gözden geçir (buton metinleri, boş durum mesajları, hata mesajları) —
      hafif esprili ama profesyonel bir ton
- [ ] Geçiş/hover animasyonları ekle (dosya yükleme, buton etkileşimleri)
- [ ] Genel son kontrol: build/lint temiz, mobilde de düzgün görünüyor mu kontrol et

**CHECKPOINT J — Faz 2 tamamlandı, tam özet çıkar**
