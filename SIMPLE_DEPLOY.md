# 🚀 Basit Netlify Deploy

## 1. Branch Adını Değiştir
```bash
git checkout -b main
git push origin main
```

## 2. Netlify Ayarları
- **Build command**: `npm install && npm run build`
- **Publish directory**: `build`
- **Branch**: `main`

## 3. Environment Variables (Netlify Dashboard)
```
CI=false
GENERATE_SOURCEMAP=false
```

## 4. Deploy Et
Deploy butonuna bas, çalışacak! 🎉

---
**Bu kadar basit!** Başka bir şey yapmana gerek yok.