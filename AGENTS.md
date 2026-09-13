# Proje: Lazy Ant Formatter

## Amaç
CSV ve Excel (.xlsx) dosyalarını JSON'a, JSON'u da CSV/Excel'e dönüştüren,
akıllı sütun eşleştirmeli bir API + basit web arayüzü.

## Teknik yığın
- Next.js (App Router), TypeScript
- Tailwind CSS — tüm styling burada yapılmalı, ayrı CSS dosyası ya da
  inline style="" kullanılmamalı (gerçekten kaçınılmaz bir durum yoksa)
- CSV işleme: papaparse
- Excel işleme: SheetJS (xlsx paketi)
- Deploy hedefi: Vercel (free tier)

## Mimari kural
Her format desteği ayrı bir modül/adapter olarak yazılmalı
(örn. lib/adapters/csv.ts, lib/adapters/excel.ts), ortak bir arayüzü
uygulamalı. İleride yeni format eklenirken mevcut kodun değişmesi
gerekmemeli, sadece yeni bir adapter eklenmeli.

## Kod kalitesi standartları
- Tüm kod, değişken/fonksiyon/component isimleri, yorumlar İngilizce
  olmalı. Türkçe sadece kullanıcıya gösterilen metinlerde (UI string'leri)
  kullanılabilir.
- ESLint kurulu olmalı, commit öncesi lint hatasız geçmeli.
- Fonksiyonlar ve component'ler tek sorumluluk prensibine uymalı — bir
  component hem veri çekip hem karmaşık iş mantığı yürütüp hem de render
  etmemeli, gerekirse hook'lara/yardımcı fonksiyonlara böl.
- Tekrar eden mantık 2'den fazla yerde kullanılıyorsa ortak bir
  fonksiyona/hook'a çıkar.
- Kullanılmayan kod, yorum satırına alınmış eski kod, console.log
  kalıntıları bırakılmamalı — commit öncesi temizlenmeli.
- Dosya/component yaklaşık 200 satırı geçiyorsa mantıklı parçalara
  bölünmeli.

## Kapsam dışı (Faz 1'de YAPILMAYACAK)
- Ödeme/kredi sistemi
- Kullanıcı hesabı / login
- XML veya başka formatlar
- Rate limiting

## Görev takibi
Bu projede görevler tasks.md dosyasında checkpoint'lerle takip ediliyor.
Bir checkpoint'e ulaşınca DUR, ilerleme özetini yaz, bir sonraki gruba geçme.
