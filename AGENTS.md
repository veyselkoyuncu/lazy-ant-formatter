# Proje: Lazy Ant Formatter

## Amaç
CSV ve Excel (.xlsx) dosyalarını JSON'a, JSON'u da CSV/Excel'e dönüştüren,
akıllı sütun eşleştirmeli bir API + basit web arayüzü.

## Teknik yığın
- Next.js (App Router), TypeScript
- CSV işleme: papaparse
- Excel işleme: SheetJS (xlsx paketi)
- Deploy hedefi: Vercel (free tier)

## Mimari kural
Her format desteği ayrı bir modül/adapter olarak yazılmalı (örn. lib/adapters/csv.ts,
lib/adapters/excel.ts), ortak bir arayüzü uygulamalı. İleride yeni format eklenirken
mevcut kodun değişmesi gerekmemeli, sadece yeni bir adapter eklenmeli.

## Kapsam dışı (Faz 1'de YAPILMAYACAK)
- Ödeme/kredi sistemi
- Kullanıcı hesabı / login
- XML veya başka formatlar
- Rate limiting

## Görev takibi
Bu projede görevler tasks.md dosyasında checkpoint'lerle takip ediliyor.
Bir checkpoint'e ulaşınca DUR, ilerleme özetini yaz, bir sonraki gruba geçme.
