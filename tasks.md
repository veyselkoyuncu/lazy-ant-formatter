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
