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

| Section | Kya milega |
|---------|-----------|
| 🎬 Loading Screen | Teddy ka swagat |
| 💌 Birthday Letter | Dil se likha hua khat |
| 🧸 Teddy Room | Interactive kamra — sab kuch click karo |
| ✨ Traits | Maahi ki khoobiyan |
| 🌷 Bouquet Shop | Phool chunne ka mauka |
| 😂 Joke Factory | 32 bakwaas jokes |
| 🎮 Mini Game | Phool pakadne ka game |
| 🎤 Concert | Maahi ka imaginary concert |
| 🎸 Guitar Song | Birthday song + guitar animation |
| 🧸 AI Teddy Chat | Teddy se baatein karo |
| 🎁 Last Box | Confetti finale |

---

## Customize karna ho toh...

- **Birthday message:** `src/pages/BirthdayLetter.jsx`
- **Jokes badalne hain:** `src/data/jokes.js`
- **Compliments:** `src/data/compliments.js`
- **Teddy ka design:** `src/components/teddy/TeddySVG.jsx`
- **Rang badalna hai:** `tailwind.config.js` mein colors

---

## 🌷 From the heart

> जन्मदिन मुबारक हो, माही।
>
> Tum chahti ho ya nahi, ye choti si website sirf ek kaam karti hai —
> tumhare chehere par thodi si muskaan laana.
>
> Koi pressure nahi. Koi expectation nahi.
> Bas phool, teddy, aur kuch bakwaas jokes. 🧸

---

*Made with friendship, flowers, questionable jokes & one extremely serious teddy. 🌷*
