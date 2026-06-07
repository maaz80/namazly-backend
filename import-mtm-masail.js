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

const mtmDataset = [
  {
    slug: "kya-cryptocurrency-bitcoin-halal-hai-mufti-tariq-masood",
    question: "Kya cryptocurrency ya Bitcoin khareedna aur bechna halal hai?",
    answer: "Mufti Tariq Masood sahab ke mutabiq, Bitcoin aur baqi cryptocurrency abhi ke haalat me najaiz/haram hain. Iski wajah ye hai ki iski koi physical reality ya tangibility nahi hai, isme gharar (extreme uncertainty) aur speculation bohot zyada hai jo ise jua ke kareeb banata hai, aur aksar hukumatain ya central banks is par koi regulation ya backing nahi rakhte. Isliye isme invest karne se bachna chahiye.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood (YouTube Q&A)",
    category: "General"
  },
  {
    slug: "share-market-intraday-future-options-halal-mufti-tariq-masood",
    question: "Kya share market me intraday trading ya futures/options trading karna jaiz hai?",
    answer: "Mufti Tariq Masood sahab ke mutabiq, share market me investment karna (delivery trading) halal hai agar company ka business halal ho aur unke financial ratios shariah-compliant hon (jaise interest-based debt limit me ho). Lekin intraday trading (ek hi din me khareed kar bechna bina delivery liye), short selling, aur futures/options trading najaiz aur haram hain kyunki inme haqiqi malikiyat (possession) nahi hoti aur ye gambling/speculation ke shubhe me aata hai.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood (Stock Market Rules)",
    category: "General"
  },
  {
    slug: "bank-mein-job-naukri-halal-ya-haram-mufti-tariq-masood",
    question: "Kya conventional bank me naukri (job) karna halal hai?",
    answer: "Mufti Tariq Masood sahab farmate hain ki bank me aisi naukri karna jo sood (interest) likhne, calculation karne, ya soodi transactions ko seedhe handle karne se talluq rakhti ho (jaise cashier, accountant, loan officer), bilkul najaiz aur gunah hai. Agar naukri aisi ho jiska sood se direct rabta nahi hai (jaise security guard, IT maintenance, ya safai), to wo haram nahi hai lekin ahtiyat phir bhi isi me hai ki soodi bank ke poore mahaul se door raha jaye.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood",
    category: "General"
  },
  {
    slug: "doosri-shadi-ke-liye-pehli-biwi-ki-ijazat-mufti-tariq-masood",
    question: "Kya doosri shadi ke liye pehli biwi ki ijazat lena zaroori hai?",
    answer: "Shari'at ke mutabiq doosri shadi karne ke liye pehli biwi ki ijazat lena farz ya shart nahi hai, iske bina bhi nikah ho jata hai. Lekin Mufti Tariq Masood sahab farmate hain ki agar aap pehli biwi ki ijazat ya use aitmad me liye bagair shadi karenge to ghar me fitna, larai-jhagde aur sakht pareshani khari hogi. Sabse aham baat ye hai ki agar aap dono biwiyon ke darmiyan barabari (adl/justice) nahi kar sakein to aakhirat me sakht pakar hogi, jo ki aamtaur par log nahi kar paate. Isliye adl ki taqat ho tabhi ye qadam uthein.",
    authority: "Mufti Tariq Masood",
    reference: "MTM Speeches (Family Laws)",
    category: "General"
  },
  {
    slug: "family-planning-contraception-rules-mufti-tariq-masood",
    question: "Kya bachon me waqfa karne ke liye temporary contraception use karna jaiz hai?",
    answer: "Mufti Tariq Masood sahab ke mutabiq, agar temporary methods (jaise condom, pills) ka istemal kiya jaye taaki bachon ki achhi parwarish ho sake ya maa ki sehat kamzoor ho, to ye sharan bilkul jaiz hai. Lekin bachon ko bojh samajh kar ya gareebi ke darr se family planning karna najaiz aur gunah hai, kyunki rizq dena Allah ka wada hai. Iske ilawa, permanent sterilization (nasbandi) bina kisi extreme medical necessity ke haram hai.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood (Family Planning)",
    category: "General"
  },
  {
    slug: "tv-serial-dramas-movies-dekhna-mufti-tariq-masood",
    question: "Kya TV par dramas aur movies dekhna jaiz hai?",
    answer: "Mufti Tariq Masood sahab ke mutabiq, aam commercial TV dramas aur movies dekhna najaiz hai kyunki unme be-hayai, music, gair-mahram mard aur aurton ka azaadana ikhtilat, aur jhoot/behuda kahaniyan dikhaye jati hain. Agar koi program deeni ya educational hai jisme shari'ah ki kisi hadd ko na toda gaya ho, to use dekhne ki ijazat hai, par aam entertainment ke naam par dikhaye jane wale serials se bachna chahiye.",
    authority: "Mufti Tariq Masood",
    reference: "MTM Speeches (Social Reform)",
    category: "General"
  },
  {
    slug: "aurat-ka-bina-mehram-safar-karna-mufti-tariq-masood",
    question: "Kya koi aurat bina shari'i mehram ke safar kar sakti hai?",
    answer: "Hanafi fiqh ke mutabiq, kisi bhi aurat ke liye 3 din ya usse zyada ki doori ka safar (takreeban 78-92 kilometers) bina shari'i mehram (jaise shohar, baap, bhai, beta) ke karna najaiz aur gunah hai. Agar doori isse kam ho to zaroorat ke waqt akele ja sakti hai, lekin lambe safar (chahe wo flight se hi kyun na ho) me mehram ka sath hona zaroori hai.",
    authority: "Mufti Tariq Masood",
    reference: "Fatawa-e-Masoodiya",
    category: "General"
  },
  {
    slug: "gusse-mein-talaq-ho-jati-hai-ya-nahi-mufti-tariq-masood",
    question: "Kya gusse me di gayi talaq ho jati hai?",
    answer: "Ji haan, gusse me di gayi talaq bilkul ho jati hai. Mufti Tariq Masood sahab wazeh karte hain ki talaq di hi gusse me jati hai, khushi me koi talaq nahi deta. Sirf us extreme halat me talaq nahi hoti jag gusse ki wajah se insan ki aql bilkul khatam ho jaye, use ye bhi hosh na rahe ki wo kya bol raha hai aur wo kahan khada hai (jaise pagalpan ya majnoon ki halat). Lekin aam gusse ka bahana banakar talaq ko radd nahi kiya ja sakta.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood (Talaq ke Masail)",
    category: "General"
  },
  {
    slug: "tattoo-banwana-halal-ya-haram-mufti-tariq-masood",
    question: "Kya jism par permanent tattoo banwana jaiz hai?",
    answer: "Jism par permanent tattoo banwana Islam me sakht haram hai, aur Huzoor Pak (S.A.W.) ne aisa karne aur karwane walon par laanat farmayi hai. Agar kisi ne na-samjhi me pehle banwa liya ho, to ab sachhi tauba kare aur agar bagair jism ko nuksaan pahunchaye laser wagera se mitana mumkin ho to mitwa de. Agar mitana mumkin na ho to wazu aur ghusl ho jata hai, par sachhi tauba zaroori hai.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood (Purity & Cleanliness)",
    category: "Cleanliness"
  },
  {
    slug: "biwi-se-sulah-ke-liye-jhoot-bolna-mufti-tariq-masood",
    question: "Kya mian-biwi ke rishte me aapsi sulah ke liye jhoot bolna jaiz hai?",
    answer: "Ji haan, Mufti Tariq Masood sahab farmate hain ki shari'at ne mian-biwi ke aapsi rishte ko tootne se bachane aur sulah karwane ke liye aese jhoot ki ijazat di hai jisse kisi ka nuksan na ho (jaise biwi ki diljoi ke liye uski tareef karna, ya jhagda khatam karne ke liye koi aisi baat bolna jisse narazgi door ho). Lekin kisi ka haq maarne ya dhokha dene ke liye jhoot bolna har haal me haram hai.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood (Marriage Tips)",
    category: "General"
  },
  {
    slug: "software-developer-banking-client-job-mufti-tariq-masood",
    question: "Kya aisi IT company me job karna jaiz hai jo banks ke liye software banati hai?",
    answer: "Mufti Tariq Masood sahab ke mutabiq, agar aap software company me aam programmer hain aur bank ke liye non-interest related general tools (jaise HR management system, front-end website, ya general security) banate hain, to aapki naukri jaiz hai. Lekin agar aap ka kaam khas soodi nizaam (jaise interest rate calculation algorithms, interest ledger systems) ko design ya code karna hai, to wo gunah me madad karne ke barabar hai aur usse bachna chahiye.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood",
    category: "General"
  },
  {
    slug: "life-car-insurance-policy-rules-mufti-tariq-masood",
    question: "Kya conventional life insurance ya car insurance lena jaiz hai?",
    answer: "Conventional companies se life insurance ya car insurance lena najaiz hai kyunki inme sood (interest) aur jua (gambling/gharar) dono ka ikhtilat hota hai. Lekin, agar car insurance kisi mulk me kanoonan farz ho aur uske bina driving karna najaiz ya jurmane ka sabab ho, to kanooni majboori me sirf jurmane se bachne ke liye car insurance lene ki ijazat hai, magar usse koi soodi fayda na uthaya jaye.",
    authority: "Mufti Tariq Masood",
    reference: "Fatawa-e-Masoodiya",
    category: "General"
  },
  {
    slug: "eyebrows-banwane-ka-islami-hukum-mufti-tariq-masood",
    question: "Kya aurat ke liye eyebrows (abro) banwana ya bareek karna jaiz hai?",
    answer: "Mufti Tariq Masood sahab farmate hain ki eyebrows ke baal ukhadna ya unhe bareek (thin) karke naya shape dena najaiz aur gunah hai, kyunki Hadith me eyebrows ukhadne wali aurton par laanat ki gayi hai. Lekin agar eyebrows ke baal bohot zyada phail gaye hon ya beech me mardon ki tarah mote baal aa gaye hon jo shakal ko aib-dar banate hon, to sirf un faltu baalon ko saaf karke normal look dena jaiz hai.",
    authority: "Mufti Tariq Masood",
    reference: "MTM Speeches",
    category: "Cleanliness"
  },
  {
    slug: "credit-card-use-karna-halal-ya-haram-mufti-tariq-masood",
    question: "Kya credit card ka istemal karna sharan jaiz hai?",
    answer: "Credit card ka istemal asal me jaiz hai agar aap is baat par mukammal qadir hon ki payment deadline se pehle bill ada kar denge taaki koi interest (sood) na lage. Lekin ahtiyat isme hai ki bina sakht zarurat ke isse bacha jaye, kyunki iska agreement sign karte waqt sood ki shart ko tasleem karna padta hai jo ki najaiz hai. Agar use kar rahe hain to deadline se pehle lazmi ada karein.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood",
    category: "General"
  },
  {
    slug: "pubg-online-gaming-rules-mufti-tariq-masood",
    question: "Kya PUBG ya online gaming khelna jaiz hai?",
    answer: "Mufti Tariq Masood sahab ke mutabiq, online games khelna jo waqt ko zaya karein, namaz aur deeni zimmedariyon se ghafil karein, aur jinme tasweerein, music ya be-hayai ho, najaiz aur makruh hai. Agar game me kisi qism ki shart ya betting (jua) shamil ho jaye, to wo bilkul haram hai. Koshish karein ki apna qimti waqt aese fizool kamo me zaya na karein.",
    authority: "Mufti Tariq Masood",
    reference: "Ask Mufti Tariq Masood",
    category: "General"
  }
];

async function run() {
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/namazly';
  console.log('Connecting to database...');
  await mongoose.connect(dbUri);
  console.log('Database connected.');

  console.log(`Checking and importing ${mtmDataset.length} Mufti Tariq Masood Masail...`);
  let importedCount = 0;
  for (const masla of mtmDataset) {
    const existing = await Masla.findOne({ slug: masla.slug });
    if (!existing) {
      await Masla.create({
        ...masla,
        views: 0 // Reset to 0 genuine views as requested
      });
      importedCount++;
    }
  }

  console.log(`Successfully imported ${importedCount} new Mufti Tariq Masood Masail (skipped existing)!`);
  await mongoose.disconnect();
  console.log('Database disconnected.');
}

run().catch(console.error);
