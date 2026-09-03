# 🌷🧸 Maahi's Little Birthday World

> *"No expectations. No pressure. Just a tiny little corner of the internet made to make you smile."*

---

## Kaise chalayein? (How to run)

### Step 1 — Frontend

```bash
cd maahi-birthday-world/frontend
npm install
npm run dev
```

Browser mein kholo: **http://localhost:5173**

### Step 2 — Backend (optional hai, website bina iske bhi kaam karti hai)

```bash
cd maahi-birthday-world/backend
npm install
cp ../.env.example .env
node server.js
```

### Step 3 — Deploy karna hai?

```bash
cd frontend
npm run build
# dist/ folder ko Vercel ya Netlify par upload karo
```

---

## Kya kya hai isme? ✨



## Customize karna ho toh...

- **Birthday message:** `src/pages/BirthdayLetter.jsx`
- **Jokes badalne hain:** `src/data/jokes.js`
- **Compliments:** `src/data/compliments.js`
- **Teddy ka design:** `src/components/teddy/TeddySVG.jsx`
- **Rang badalna hai:** `tailwind.config.js` mein colors

---

## 🌷 From the heart

> जन्मदिन मुबारक हो, माही।

*Made with friendship, flowers, questionable jokes & one extremely serious teddy. 🌷*
