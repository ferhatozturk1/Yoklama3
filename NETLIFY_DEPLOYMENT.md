# 🚀 Netlify Deployment Guide

## 🚨 ÖNEMLI: Branch Adı Sorunu

**Sorun**: Branch adında Türkçe karakter (`küçük_ekran`) var, Netlify bunu desteklemiyor.

**Çözüm**: Branch adını değiştir:
```bash
git checkout -b main
git push origin main
```

Sonra Netlify'de **main** branch'ini seç.

## 📋 Netlify fsevents Sorunu Çözümü

Bu proje `fsevents` paket sorunu nedeniyle Netlify'de build hatası veriyordu. Aşağıdaki çözümler uygulandı:

### ✅ Yapılan Düzeltmeler:

#### 1. **package.json Güncellemeleri:**
```json
{
  "optionalDependencies": {
    "fsevents": "*"
  },
  "resolutions": {
    "fsevents": "*"
  },
  "scripts": {
    "build:netlify": "CI=false GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

#### 2. **netlify.toml Konfigürasyonu:**
```toml
[build]
  publish = "build"
  command = "npm run build:netlify"

[build.environment]
  CI = "false"
  GENERATE_SOURCEMAP = "false"
  NODE_VERSION = "18"
```

#### 3. **.npmrc Dosyası:**
```
optional=true
audit=false
fund=false
loglevel=error
```

#### 4. **netlify-build.sh Güncellemesi:**
- `--no-optional` flag eklendi
- `fsevents` için environment variables
- Alternative install method

### 🔧 Netlify Build Ayarları:

1. **Build Command**: `npm run build:netlify`
2. **Publish Directory**: `build`
3. **Node Version**: `18`
4. **Environment Variables**:
   - `CI=false`
   - `GENERATE_SOURCEMAP=false`

### 📝 Deployment Adımları:

#### 1. Branch Adını Düzelt:
```bash
# Yeni branch oluştur (Türkçe karakter olmadan)
git checkout -b main

# Tüm değişiklikleri yeni branch'e push et
git push origin main

# Eski branch'i sil (opsiyonel)
git push origin --delete küçük_ekran
```

#### 2. Netlify Ayarları:
1. Repository'yi Netlify'e bağla
2. **Branch to deploy**: `main` seç
3. **Build command**: `npm run build:safe`
4. **Publish directory**: `build`
5. Deploy et

### 🐛 Sorun Giderme:

Eğer hala `fsevents` hatası alıyorsan:

1. **Netlify Dashboard** → **Site Settings** → **Build & Deploy**
2. **Environment Variables** ekle:
   ```
   CI = false
   GENERATE_SOURCEMAP = false
   DISABLE_OPENCOLLECTIVE = true
   ```

3. **Build Command**'i şu şekilde değiştir:
   ```bash
   npm install --no-optional && npm run build:netlify
   ```

### ✅ Test Edildi:
- ✅ Local Windows build: `npm run build:windows`
- ✅ Netlify Linux build: `npm run build:netlify`
- ✅ fsevents sorunu çözüldü
- ✅ Bundle size optimize edildi (207.04 kB)

### 🚀 Sonuç:
Artık proje Netlify'de sorunsuz deploy edilebilir!