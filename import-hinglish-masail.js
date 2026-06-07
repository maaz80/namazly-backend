import mongoose from 'mongoose';
import 'dotenv/config';

// Define schema inline to avoid ESM relative imports mismatch
const maslaSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    authority: { type: String, default: 'Darul Ifta' },
    reference: { type: String },
    category: { type: String, required: true, default: 'General', index: true },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Masla = mongoose.model('Masla', maslaSchema);

const masailDataset = [
  {
    slug: "kya-peshab-ke-qatre-se-wazu-toot-jata-hai",
    question: "Kya peshab ke qatre se wazu toot jata hai?",
    answer: "Ji haan, agar peshab ka qatra wazu ke baad baahar aaye to wazu toot jata hai. Aise me wazu dobara karna farz hai. Agar kapde par lag jaye to us hisse ko paak karna bhi zaroori hai (agar qatra 1 dirham ke barabar ya usse zyada fail jaye to kapda dhona farz hai).",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2, Wazu ka Bayan",
    category: "Wazu"
  },
  {
    slug: "kya-khoon-nikalne-se-wazu-toot-jata-hai",
    question: "Kya jism se khoon nikalne se wazu toot jata hai?",
    answer: "Hanafi fiqh ke mutabiq, agar jism ke kisi bhi hisse se khoon nikle aur wo beh kar aisi jagah pahunch jaye jise wazu ya ghusl me dhona farz hai, to wazu toot jata hai. Agar khoon sirf apni jagah par rahe aur baahar na bahe, to wazu nahi tootata.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2, Wazu Todne Wali Cheezein",
    category: "Wazu"
  },
  {
    slug: "kya-kapde-badalne-se-wazu-toot-jata-hai",
    question: "Kya kapde badalne ya satar khulne se wazu toot jata hai?",
    answer: "Nahi, kapde badalne, satar khulne ya nange hone se wazu nahi tootata. Wazu sirf unhi cheezon se tootata hai jo badan se nikalne wali hain (jaise peshab, pakhana, khoon behta hua, ya hawa kharij hona).",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2, Nawaqis-e-Wazu",
    category: "Wazu"
  },
  {
    slug: "kya-makeup-se-wazu-hota-hai",
    question: "Kya makeup lagaye rakhne se wazu ho jata hai?",
    answer: "Agar makeup aesa hai jo waterproof hai ya jiske lagane se jism par ek aisi teh (layer) ban jati hai jiske neeche pani nahi pahunch pata (jaise waterproof mascara, waterproof foundation ya nail polish), to wazu nahi hoga. Wazu karne se pehle ise saaf karna zaroori hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2, Sharat-e-Wazu",
    category: "Wazu"
  },
  {
    slug: "aurat-ko-chhne-se-wazu-tutna-hanafi",
    question: "Kya biwi ya aurat ko chhu lene se wazu toot jata hai?",
    answer: "Hanafi fiqh ke mutabiq, sirf biwi ya kisi aurat ko chhu lene (touch karne) se wazu nahi tootata, jab tak ki koi mazi (lubricant fluid) ya mani kharij na ho. Shafi'i fiqh me aurat ko chhu lene se wazu toot jata hai, par Hanafi me nahi.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Fatawa Razawiyyah, Jild 1",
    category: "Wazu"
  },
  {
    slug: "kya-wazu-ke-dauran-baat-karne-se-wazu-tut-ta-hai",
    question: "Kya wazu ke dauran baat karne se wazu toot jata hai?",
    answer: "Nahi, wazu ke dauran baat karne se wazu nahi tootata. Lekin wazu ke dauran bina zaroorat ke dunyawi baatein karna makruh (na-pasandida) aur khilaf-e-adab hai. Wazu karte waqt zikr aur duayein padhna afzal hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2, Adab-e-Wazu",
    category: "Wazu"
  },
  {
    slug: "daant-se-khoon-nikalne-par-wazu-tutna",
    question: "Kya daant se khoon nikalne par wazu toot jata hai?",
    answer: "Agar maseeh (gums) se khoon nikle aur wo thook par galib (haavi) ho jaye (yaani thook ka rang laal ho jaye), to wazu toot jata hai. Agar thook ka rang peela rahe (khoon thook se kam ho), to wazu nahi tootata.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2",
    category: "Wazu"
  },
  {
    slug: "kya-rona-se-wazu-toot-jata-hai",
    question: "Kya rona (weeping) se wazu toot jata hai?",
    answer: "Nahi, rone se wazu nahi tootata, chahe aawaz ke sath roya jaye ya bina aawaz ke. Lekin agar namaz ke andar duniya ke kisi gham me itna roye ki aawaz baahar nikal aaye, to namaz toot jayegi (wazu nahi tootega).",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2",
    category: "Wazu"
  },
  {
    slug: "kya-thook-nigalne-se-wazu-toot-jata-hai",
    question: "Kya thukne se ya thook nigalne se wazu toot jata hai?",
    answer: "Nahi, thook nigalne ya baar-baar thukne se wazu par koi asar nahi padta. Wazu bilkul qaim rehta hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2",
    category: "Wazu"
  },
  {
    slug: "qaza-namaz-ki-niyat-kaise-karein",
    question: "Umar bhar ki chhooti hui namazo (Qaza-e-Umri) ki niyat kaise karein?",
    answer: "Qaza namaz ki niyat karte waqt sabse pehle chhooti hui namaz ka ta'ayyun karna zaroori hai. Niyat is tarah karein: \"Main niyat karta hoon apni sabse pehli chhooti hui Fajr ki namaz ki.\" Jab aap niyat kar ke padh lenge, to agla Fajr automatically sabse pehla ho jayega.",
    authority: "Mufti Fazil-e-Barelvi",
    reference: "Fatawa Razawiyyah, Jild 8",
    category: "Namaz"
  },
  {
    slug: "sajda-e-sahw-ka-tariqa-aur-rules",
    question: "Sajda-e-Sahw kab aur kaise wajib hota hai?",
    answer: "Agar namaz me bhool kar koi Wajib chhoot jaye (jaise Surah Fatiha ke baad surah milana bhool jana, ya pehli baithak bhool jana), to Sajda-e-Sahw wajib hota hai. Tariqa ye hai ki aakhri rakat me Attahiyyat padh kar ek taraf salam pherein, fir do sajde karein, aur dobara Attahiyyat, Durood, Dua padh kar salam pherein.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Jild 1, Sajda-e-Sahw ka bayan",
    category: "Namaz"
  },
  {
    slug: "half-sleeves-mein-namaz-padhne-ka-hukum",
    question: "Kya aadhi aasteen (half sleeves) ya short T-shirt me namaz padhna jaiz hai?",
    answer: "Aadhi aasteen ya aisi T-shirt jisme kohniyan (elbows) khuli hon, use pehan kar namaz padhna 'Makruh-e-Tanzihi' (na-pasandida) hai, kyunki namaz me darbar-e-ilahi me ba-adab khada hona chahiye. Halanki namaz ho jayegi, par aasteen poori hona afzal hai.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 7",
    category: "Namaz"
  },
  {
    slug: "musafir-ki-qasr-namaz-ka-hukum",
    question: "Musafir ke liye Qasr namaz kab aur kaise wajib hoti hai?",
    answer: "Jab koi shakhs 92 kilometers ya usse zyada doori ka safar karne ke irade se apne shahar ki aabadi se baahar nikle, to wo shari'ah ki nazar me musafir hai. Safar me 4 Rakat wali Farz namaz (Zohar, Asr, Isha) ko Qasr karke 2 Rakat padhna wajib hai. Witr aur Sunnat me Qasr nahi hota.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 8, Namaz-e-Musafir",
    category: "Namaz"
  },
  {
    slug: "bimari-mein-namaz-padhne-ka-tariqa",
    question: "Bimari me namaz kaise padhein aur kya bimari me namaz maaf hai?",
    answer: "Bimari me jab tak khade hone ki taqat ho, khade hokar padhna farz hai. Agar khade hone ki taqat na ho to baith kar ruku aur sajda ke sath padhein. Agar baith kar sajda karne ki taqat na ho to ishare se padhein. Namaz kisi bhi haal me maaf nahi hai jab tak aql qaim ho aur ishara karne ki taqat ho.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Bahar-e-Shariat, Hissa 4, Bimar ki Namaz",
    category: "Namaz"
  },
  {
    slug: "namaz-mein-khayal-waswase-aana",
    question: "Namaz me bure khayal ya waswase aane se kya namaz toot jati hai?",
    answer: "Namaz me khayalat ya waswase aane se namaz nahi tootati. Lekin koshish karni chahiye ki dhyan namaz ki taraf rahe. Waswase aana shaitan ki taraf se hota hai, isse bachne ke liye namaz se pehle 'Ta'awwuz' (A'uzu billahi...) padhein aur apni tawajjuh badlein.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 8",
    category: "Namaz"
  },
  {
    slug: "fajar-ki-qaza-namaz-kab-padhein",
    question: "Fajar ki qaza namaz kab padh sakte hain? Kya suraj nikalte waqt padhna jaiz hai?",
    answer: "Fajar ki qaza namaz din me kabhi bhi padh sakte hain, siwaye Zawal (noon), Suraj nikalte (sunrise) aur Suraj doobte (sunset) waqt ke. In teen Auqat (times) me namaz padhna sakht mana (Makruh-e-Tahrimi) hai. Suraj nikalne ke 20 minute baad se padh sakte hain.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 3, Auqat-e-Namaz",
    category: "Namaz"
  },
  {
    slug: "dua-e-qunoot-bhool-jane-ka-hukum",
    question: "Witr ki teesri rakat me Dua-e-Qunoot bhool jayein to kya karein?",
    answer: "Agar aap ruku me chale gaye aur yaad aaya ki Dua-e-Qunoot bhool gaye hain, to ruku se wapas khade na hon. Namaz ke aakhir me Sajda-e-Sahw wajib hoga. Agar ruku se khade hokar dobara Dua-e-Qunoot padhenge, to gunahgar honge aur Sajda-e-Sahw fir bhi karna padega.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Jild 1, Witr ka bayan",
    category: "Namaz"
  },
  {
    slug: "jamat-mein-ruku-mein-shamil-hona",
    question: "Jamat me shamil hone ka kya tarika hai agar ruku me imam ke sath milein?",
    answer: "Agar aap ruku ki halat me imam ke sath shamil hote hain aur kam se kam ek baar 'Subhana Rabbiyal Azeem' kehne ke barabar imam ke sath ruku me rehte hain, to wo rakat aapki mani jayegi. Agar imam ruku se khada ho gaya to wo rakat aapko baad me padhni hogi.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 3, Jamat ka bayan",
    category: "Namaz"
  },
  {
    slug: "bina-topi-ke-namaz-padhna",
    question: "Kya bina topi ke (bareheaded) namaz padhna jaiz hai?",
    answer: "Bina topi ke namaz padhna jaiz hai aur namaz ho jayegi. Lekin susti ya shauqiya bina topi ke namaz padhna 'Makruh-e-Tanzihi' hai. Allah ke huzoor behtareen libas aur adab ke sath khada hona chahiye, isliye topi pehanna afzal hai.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 7",
    category: "Namaz"
  },
  {
    slug: "ghusl-ke-farz-aur-tariqa",
    question: "Ghusl me kitne farz hote hain aur ghusl ka sahi tarika kya hai?",
    answer: "Ghusl me total 3 farz hote hain: 1. Kulli karna (is tarah ki gale ke andar tak pani pahunche), 2. Naak me pani dalna (jahan tak naram haddi hai), aur 3. Pure jism par is tarah pani bahana ki ek baal barabar jagah bhi sukhi na rahe.",
    authority: "Mufti Fazil-e-Barelvi",
    reference: "Fatawa Hindiyyah, Jild 1, Kitab-ut-Taharah",
    category: "Ghusl"
  },
  {
    slug: "ghusl-ke-baad-wazu-ki-zaroorat",
    question: "Kya ghusl ke baad wazu karna zaroori hai?",
    answer: "Nahi, agar aapne ghusl ke farz aur tariqe ko sahi se ada kiya hai, to ghusl ke sath hi aapka wazu bhi ho jata hai. Dobara wazu karne ki koi zaroorat nahi jab tak koi wazu todne wali cheez pesh na aaye.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2",
    category: "Ghusl"
  },
  {
    slug: "napaki-ki-halat-mein-haraam-cheezein",
    question: "Napaki (Janabah) ki halat me ghusl karne se pehle kya cheezein haram hain?",
    answer: "Napaki ki halat me Namaz padhna, Quran Sharif ko bina gilaaf ke chhoona ya tilawat karna, Masjid me dakhil hona, aur Khana-e-Ka'ba ka tawaf karna sakht haram hai. Zikr, durood shareef aur duayein padhna jaiz hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2, Ghusl ka Bayan",
    category: "Ghusl"
  },
  {
    slug: "aurat-ke-ghusl-mein-baal-kholna",
    question: "Kya aurat ke liye ghusl me poore baal kholna zaroori hai?",
    answer: "Agar aurat ke baal goondhe hue (braided) hon aur pani baal ki jadon (scalp) tak pahunch jaye, to baal kholna zaroori nahi. Lekin agar baal khule hon, to poore baalon ko bhigona farz hai. Agar baal ki jadon tak pani na pahunche to ghusl nahi hoga.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2",
    category: "Ghusl"
  },
  {
    slug: "bina-kapdo-ke-ghusl-karna",
    question: "Kya bina kapdo ke (nange hokar) ghusl karna jaiz hai?",
    answer: "Band kamre me ya ghusl khane me nange hokar ghusl karna jaiz hai, lekin khule aam nange hona haram hai. Band kamre me bhi ghusl karte waqt tehband ya kapda lapet lena afzal aur ba-adab hai.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 2",
    category: "Ghusl"
  },
  {
    slug: "roze-mein-injection-insulin-lagwana",
    question: "Kya roze ki halat me injection, vaccine ya insulin lagwane se roza toot jata hai?",
    answer: "Fatawa Razawiyyah aur modern scholars ke mutabiq, roze ki halat me injection (intramuscular ya intravenous) lagwane se roza nahi tootata, kyunki dawa sidhe dimaag ya pet (jauf) me nahi jati. Insulin aur corona vaccine lagwane se bhi roza nahi tootata.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Jadid Fatawa, Jauf-e-Badan ka Bayan",
    category: "Roza"
  },
  {
    slug: "roze-mein-perfume-ittar-lagane-ka-rules",
    question: "Kya roze me ittar ya perfume lagana aur soonghna jaiz hai?",
    answer: "Ji haan, roze ki halat me ittar, perfume ya tel lagana bilkul jaiz hai. Isse roza nahi tootata. Lekin agar kisi dhuwan (smoke) ya agarbatti ke dhuwan ko jaanbujhkar moonh aur naak ke raste andar kheencha jaye, to roza toot jayega.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Jild 1, Roze ka Bayan",
    category: "Roza"
  },
  {
    slug: "roze-mein-galti-se-pani-peene-ka-hukum",
    question: "Roze me wazu karte waqt agar bhool kar pani gale me chala jaye to kya roza toot jata hai?",
    answer: "Agar roza hona yaad tha aur wazu karte waqt galti se (bina irada ke) pani gale ke niche utar gaya, to roza toot jata hai. Lekin is surah me sirf qaza wajib hogi, kaffara nahi. Agar roza hona yaad hi nahi tha aur pani pi liya, to roza nahi tootata.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 5, Qaza ka bayan",
    category: "Roza"
  },
  {
    slug: "roze-mein-toothpaste-ya-manjan",
    question: "Kya roze ki halat me toothpaste, toothpowder ya manjan karna jaiz hai?",
    answer: "Roze me toothpaste ya manjan karna makruh hai. Agar uska koi zarrat ya maza gale se niche utar jaye, to roza toot jayega aur qaza wajib hogi. Isliye roze ki halat me toothpaste se bachna chahiye aur sirf miswak karni chahiye.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 5",
    category: "Roza"
  },
  {
    slug: "roze-mein-bhool-kar-khana-peena",
    question: "Roze me bhool kar khane ya peene se kya roza toot jata hai?",
    answer: "Agar roze me bhool kar (yaani roza yaad hi nahi tha) kuch kha ya pee liya jaye, to roza nahi tootata. Jaise hi yaad aaye, foran khana peena band kar edin aur moonh saaf kar lein. Roza bilkul qaim rahega.",
    authority: "Mufti Fazil-e-Barelvi",
    reference: "Fatawa Hindiyyah, Jild 1",
    category: "Roza"
  },
  {
    slug: "kya-surma-lagane-se-roza-toot-ta-hai",
    question: "Kya roze ki halat me aankh me surma ya drops dalne se roza toot jata hai?",
    answer: "Hanafi fiqh ke mutabiq, roze ki halat me aankh me surma lagane ya eye drops dalne se roza nahi tootata, chahe uska maza ya rang gale me mehsoos hi kyun na ho. Kyunki aankh se pet tak ka rasta shari'ah ke mutabiq jauf ke raste me nahi aata.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Fatawa Hindiyyah, Jild 1, Roze ka bayan",
    category: "Roza"
  },
  {
    slug: "thook-nigalne-se-roza",
    question: "Kya roze me apna hi thook nigalne (swallowing saliva) se roza toot jata hai?",
    answer: "Apna thook nigalne se roza nahi tootata, chahe wo kitna hi zyada nigla jaye. Lekin agar thook moonh se baahar nikal kar dobara andar nigla jaye, ya kisi doosre ka thook nigla jaye, to roza toot jayega.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 5",
    category: "Roza"
  },
  {
    slug: "roze-mein-naksir-phatna",
    question: "Roze me agar naak se khoon (naksir) nikal aaye to kya hukum hai?",
    answer: "Naak se khoon nikalne se roza nahi tootata. Lekin agar khoon bahar nikalne ke bajay pichhe gale se hote hue pet ke andar chala jaye, to roza toot jayega aur uski qaza karni hogi.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Fatawa Razawiyyah, Jild 10",
    category: "Roza"
  },
  {
    slug: "ulti-vomit-aane-se-roza-tutna",
    question: "Roze me ulti (vomiting) aane se kya roza toot jata hai?",
    answer: "Agar khud-ba-khud ulti (vomit) aaye, chahe kitni hi zyada ho, to roza nahi tootata. Lekin agar jaanbujhkar (finger daal kar ya kisi aur tarike se) moonh bhar ulti ki jaye, to roza toot jata hai aur uski qaza karni hogi.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 5",
    category: "Roza"
  },
  {
    slug: "kaan-mein-dawa-dalna-roza",
    question: "Roze me kaan me dawa ya drops dalne ka kya hukum hai?",
    answer: "Hanafi fiqh ke purane fatwo ke mutabiq kaan me dawa ya tel dalne se roza toot jata tha. Lekin jadid research ke mutabiq, agar kaan ka parda (eardrum) phata hua na ho, to kaan me drops dalne se roza nahi tootata kyunki pet tak koi rasta nahi hai. Ahtiyat isme hai ki na dala jaye jab tak sakht zaroorat na ho.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Jadid Fatawa, Auqat-e-Sawm",
    category: "Roza"
  },
  {
    slug: "sone-chandi-par-zakat-ka-tariqa",
    question: "Sone aur chandi par Zakat kab farz hoti hai aur kitna dena hota hai?",
    answer: "Sone ka nisab 7.5 tola (87.48 grams) hai aur chandi ka nisab 52.5 tola (612.36 grams) hai. Agar kisi ke paas is ke barabar ya isse zyada maal 1 saal tak rahe, to us par kul value ka 2.5% (40wan hissa) Zakat dena farz hai.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 10, Kitab-uz-Zakat",
    category: "Zakat"
  },
  {
    slug: "rent-property-personal-house-zakat-rules",
    question: "Kya khud ke rehne wale ghar ya rent par diye gaye makan par Zakat farz hai?",
    answer: "Rehne ke ghar, zati gadi, zati istemal ke saman par koi Zakat nahi hai. Rent par diye gaye makan ki asal keemat par bhi Zakat nahi hai, lekin us makan se aane wale rent ke paise agar jama hain aur nisab tak pahunchte hain, to un paison par 2.5% Zakat dena hoga.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 5, Zakat ka bayan",
    category: "Zakat"
  },
  {
    slug: "karz-par-zakat-ke-rules",
    question: "Diye gaye karze (loan) par Zakat kis par farz hai?",
    answer: "Agar aapne kisi ko karz diya hai aur wo paisa wapas milne ki umeed hai (Karz-e-Qawi), to us karz ki rakam par Zakat dena aap par hi farz hai. Jab paisa wapas milega, to pichle saalon ki bhi Zakat deni hogi. Lekin agar paisa doob gaya ho aur milne ki umeed na ho, to uspar Zakat farz nahi.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Fatawa Hindiyyah, Jild 1, Zakat ka bayan",
    category: "Zakat"
  },
  {
    slug: "saal-se-pehle-zakat-dena",
    question: "Kya saal poora hone se pehle hi Zakat dena jaiz hai?",
    answer: "Ji haan, agar aapke paas nisab ke barabar maal maujood hai, to saal poora hone se pehle hi aane wale saal ki Zakat advance me dena bilkul jaiz hai. Saal ke aakhir me hisab karke agar kuch baqi reh jaye to wo bhi ada kar dein.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 5",
    category: "Zakat"
  },
  {
    slug: "zakat-kin-logon-ko-dein",
    question: "Zakat ke paise kin logon ko diye ja sakte hain aur kinhe dena haram hai?",
    answer: "Zakat ke paise sirf shar'i ghareeb aur mustahiq musalmano ko diye ja sakte hain. Apne maa-baap, dada-dadi, nana-nani, beta-beti, pota-poti, aur shohar ya biwi ko Zakat dena haram hai. Bani Hashim (Sayyid) ko bhi Zakat dena haram hai.",
    authority: "Mufti Fazil-e-Barelvi",
    reference: "Bahar-e-Shariat, Hissa 5, Masarif-e-Zakat",
    category: "Zakat"
  },
  {
    slug: "haiz-ke-dino-ki-namazo-ka-hukum",
    question: "Haiz (periods) ke dino me chhooti hui namazo ka kya hukum hai?",
    answer: "Haiz ke dino me chhooti hui namazein aurat par maaf hain. In namazo ki qaza karna aurat par zaroori nahi hai (aur na hi gunah hai). Lekin jo roze chhoot jayein, unki qaza karna farz hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Jild 1, Haiz ka bayan",
    category: "Cleanliness"
  },
  {
    slug: "mani-mazi-wadi-ghusl-rules",
    question: "Kya mani, mazi aur wadi nikalne se ghusl farz hota hai?",
    answer: "Mani (ejaculation) shahwat (lust) ke sath nikalne se ghusl farz hota hai. Mazi (sticky fluid jo excitation ke waqt nikalta hai) aur Wadi (thick fluid jo peshab ke baad nikalta hai) ke nikalne se ghusl farz nahi hota, balki sirf wazu tootata hai aur us jagah ko dhona zaroori hota hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2",
    category: "Cleanliness"
  },
  {
    slug: "napak-kapdo-ko-paak-karne-ka-tariqa",
    question: "Napak kapdo ko paak karne ka sahi tarika kya hai?",
    answer: "Agar najasat (impurity) dikhne wali ho to use itna dhoye ki najasat aur uska asar saaf ho jaye (kam se kam 3 baar dhona aur nichodna zaroori hai). Agar najasat na dikhne wali ho (jaise peshab), to kapde ko teen baar alag-alag paani me dhokar har baar poori taqat se nichodein.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 2, Najasat ka Bayan",
    category: "Cleanliness"
  },
  {
    slug: "kutte-ko-chhne-se-napaki",
    question: "Kya kutte ko chhu lene se jism ya kapde napak ho jate hain?",
    answer: "Hanafi fiqh ke mutabiq, sirf kutte ke jism ko chhu lene se kapde ya jism napak nahi hote, jab tak ki kutte ka thook (saliva) ya rulaab aapke kapdon ya badan par na lage. Agar thook lag jaye, to wo hissa napak ho jayega aur dhona farz hoga.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Fatawa Razawiyyah, Jild 1",
    category: "Cleanliness"
  },
  {
    slug: "satar-ke-baal-saaf-karne-ka-time",
    question: "Satar (sharmgah) ke baal saaf karne ka islami hukum aur time limit kya hai?",
    answer: "Satar ke baal aur bagal ke baal saaf karna sunnat-e-muakkada hai. Iska mustahab waqt har hafte hai. 40 din se zyada tak in baalon ko saaf na karna Makruh-e-Tahrimi (sakht gunah aur na-pasandida) hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 16, Khisal-e-Fitrat",
    category: "Cleanliness"
  },
  {
    slug: "bank-interest-sood-haram",
    question: "Kya shari'at me bank ka interest (sood) lena bilkul haram hai?",
    answer: "Ji haan, kisi bhi tarah ka sood (interest) lena, dena, uski likhai karna aur usme gawah banna Quran aur Hadith ke mutabiq sakht haram aur kabira gunah hai. Bank se milne wale interest ko bagair sawab ki niyat ke ghareebon ko dena wajib hai.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 17",
    category: "General"
  },
  {
    slug: "adsense-youtube-earning-halal-haram",
    question: "Kya internet earnings (jaise AdSense, YouTube) par koi islami masla hai?",
    answer: "Agar content halal aur jaiz hai (jaise deeni baatein, education, technology) aur uspar aane wale vigyapan (ads) me koi haram cheez (jaise be-hayai, sharab, sood, music) nahi hai, to earning halal hai. Agar ads haram cheezon ke hain to aisi earning jaiz nahi hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Jadid Fatawa, Tijarat-e-Internet",
    category: "General"
  },
  {
    slug: "lottery-betting-money-halal",
    question: "Kya lottery ya online betting se jeeta hua paisa halal hai?",
    answer: "Nahi, lottery, online betting, dream11 ya koi bhi aesa khel jisme paise ki shart lagayi jaye, wo shari'ah me 'Qimar' (Jua/Gambling) kehlata hai. Jua se jeeta gaya koi bhi paisa 100% haram hai aur uska istemal bilkul najaiz hai.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 16",
    category: "General"
  },
  {
    slug: "halal-aur-haram-meat",
    question: "Halal meat aur haram meat me shari'at ke mutabiq kya farq hai?",
    answer: "Halal meat wo hai jo shar'i janwar ho, aur use zabh karte waqt musalman ne jaanbujhkar 'Bismillahi Allahu Akbar' keh kar uski gale ki ragein kaati hon. Bina zabh kiya hua, gair-muslim ka zabh kiya hua, ya jisme bismillah na padhi jaye, wo haram hai.",
    authority: "Alahazrat Imam Ahmad Raza Khan",
    reference: "Fatawa Razawiyyah, Jild 20",
    category: "General"
  },
  {
    slug: "sadqah-e-fitr-fitrana-rules",
    question: "Sadqah-e-Fitr (Fitrana) kab aur kis par wajib hota hai?",
    answer: "Eid-ul-Fitr ke din subah sadiq hote hi har sahib-e-nisab musalman par (apni aur apne chhote bachon ki taraf se) Fitrana ada karna wajib hota hai. Ise Eid ki namaz se pehle-pehle mustahiqeen ko dena sunnat hai, taaki wo bhi Eid ki khushiyan mana sakein.",
    authority: "Darul Ifta Barkate Raza",
    reference: "Bahar-e-Shariat, Hissa 5, Fitrana ka bayan",
    category: "General"
  }
];

async function run() {
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/namazly';
  console.log('Connecting to database...');
  await mongoose.connect(dbUri);
  console.log('Database connected.');

  console.log('Clearing old masail from database...');
  await Masla.deleteMany({});
  console.log('Database cleared.');

  console.log(`Inserting ${masailDataset.length} premium Hinglish Masail...`);
  const result = await Masla.insertMany(masailDataset);
  console.log(`Successfully imported ${result.length} Masail into database!`);

  await mongoose.disconnect();
  console.log('Database disconnected.');
}

run().catch(console.error);
