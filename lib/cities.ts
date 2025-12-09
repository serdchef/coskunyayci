/**
 * Global Cities Database
 * Ülkeler, şehirler, ilçeler ve semtler
 */

export const COUNTRIES = [
  'Türkiye',
  'Almanya',
  'Fransa',
  'İngiltere',
  'İtalya',
  'İspanya',
  'Hollanda',
  'Belçika',
  'Avusturya',
  'İsviçre',
  'Polonya',
  'Çek Cumhuriyeti',
  'Macaristan',
  'Romanya',
  'Bulgaristan',
  'Yunanistan',
  'Portekiz',
  'İrlanda',
  'Danimarka',
  'İsveç',
  'Norveç',
  'Finlandiya',
];

// Sadece ilk 81 Türkiye şehri - temiz
const TURKEY_CITIES_CLEAN = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya',
  'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir',
  'Bartın', 'Batman', 'Bayburt', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay',
  'Iğdır', 'Isparta', 'Istanbul', 'Izmir', 'Kahramanmaraş', 'Karabük',
  'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde',
  'Ordu', 'Orhaneli', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
  'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon',
  'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  Türkiye: TURKEY_CITIES_CLEAN,
  Almanya: [
    'Berlin', 'München', 'Köln', 'Hamburg', 'Frankfurt', 'Stuttgart',
    'Düsseldorf', 'Dortmund', 'Essen', 'Hannover', 'Leipzig', 'Dresden',
    'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Gelsenkirchen',
  ],
  Fransa: [
    'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes',
    'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes',
  ],
  'İngiltere': [
    'Londra', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool',
    'Bristol', 'Oxford', 'Cambridge', 'Edinburgh', 'York',
  ],
  'İtalya': [
    'Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova',
    'Bologna', 'Firenze', 'Bari', 'Catania', 'Venezia',
  ],
  'İspanya': [
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga',
    'Palma', 'Las Palmas', 'Alicante', 'Córdoba', 'Valladolid',
  ],
  Hollanda: [
    'Amsterdam', 'Rotterdam', 'Utrecht', 'Haarlem', 'Groningen',
    'Geldermalsen', 'Zwolle', 'Leeuwarden',
  ],
  Belçika: [
    'Brüksel', 'Antwerpen', 'Gent', 'Charleroi', 'Liège', 'Brugge',
    'Namur', 'Louvain',
  ],
  Avusturya: [
    'Viyana', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt',
    'St. Pölten', 'Eisenstadt',
  ],
  'İsviçre': [
    'Zürih', 'Bern', 'Cenevre', 'Basel', 'Lausanne', 'Lucerne',
    'Biel', 'Lugano', 'Fribourg',
  ],
  Polonya: [
    'Varşova', 'Kraków', 'Viştula', 'Vroclaw', 'Poznań', 'Gdańsk',
    'Szczecin', 'Łódź', 'Katowice',
  ],
  'Çek Cumhuriyeti': [
    'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc',
    'Hradec Králové', 'České Budějovice',
  ],
  Macaristan: [
    'Budapeşte', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr',
    'Nyíregyháza', 'Kecskemét',
  ],
  Romanya: [
    'Bükreş', 'Cluj-Napoca', 'Timişoara', 'Iaşi', 'Constanța', 'Braşov',
    'Ploieşti', 'Galați',
  ],
  Bulgaristan: [
    'Sofya', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora',
    'Pleven', 'Silistra',
  ],
  Yunanistan: [
    'Atina', 'Selanik', 'Patra', 'Heraklion', 'Larisa', 'Volos',
    'Rhodes', 'Ioannina',
  ],
  Portekiz: [
    'Lizbon', 'Porto', 'Covilhã', 'Braga', 'Funchal', 'Ponta Delgada',
  ],
  'İrlanda': [
    'Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Droichead Átha',
  ],
  Danimarka: [
    'Kopenhag', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg',
  ],
  'İsveç': [
    'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro',
    'Linköping', 'Helsingborg',
  ],
  Norveç: [
    'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Kristiansand', 'Tromsø',
    'Lillehammer',
  ],
  Finlandiya: [
    'Helsinki', 'Espoo', 'Tampere', 'Turku', 'Oulu', 'Kuopio',
    'Jyväskylä', 'Lahti',
  ],
};

// Türkiye'nin tüm ilçeleri
export const DISTRICTS_BY_CITY: Record<string, string[]> = {
  Istanbul: [
    'Adalar', 'Avcılar', 'Bahçelievler', 'Bahçeşehir', 'Bakırköy',
    'Başakşehir', 'Başakşehir Merkez', 'Beşiktaş', 'Beykoz', 'Beyoğlu',
    'Beylikdüzü', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler',
    'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören',
    'Güzeltepe', 'Halkalı', 'Kadıköy', 'Kağıthane', 'Kartal',
    'Kasımpaşa', 'Kaynarca', 'Kurtköy', 'Küçükçekmece', 'Maslak',
    'Maltepe', 'Pendik', 'Sarıyer', 'Şile', 'Şişli',
    'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şişli', 'Taksim',
    'Tarabya', 'Tarlabaşı', 'Tuzla', 'Ümraniye', 'Uskudar',
    'Üsküdar', 'Vatan', 'Virantepe', 'Yeşilköy', 'Yıldız',
    'Zeytinburnu', 'Zincirlikuyu',
  ],
  Ankara: [
    'Alatürk', 'Altındağ', 'Ankara Merkez', 'Ardıç', 'Ayaş',
    'Bala', 'Balâ', 'Beypazarı', 'Çankaya', 'Çubuk',
    'Elmadağ', 'Enstitüler', 'Etimesgut', 'Gölbaşı', 'Güdül',
    'Haymana', 'Kazan', 'Kızılcahamam', 'Kızıltepe', 'Keceli',
    'Keçiören', 'Maltepe', 'Mamak', 'Nallıhan', 'Polatlı',
    'Pursaklar', 'Sincan', 'Şentepe', 'Tandoğan', 'Tunalı',
    'Ulus', 'Ümitköy', 'Yenimahalle', 'Yenişehir',
  ],
  Izmir: [
    'Alsancak', 'Balçova', 'Bayındır', 'Bayraklı', 'Beğendik',
    'Bergama', 'Besni', 'Beyağ', 'Beyköy', 'Bornova',
    'Buca', 'Çeşme', 'Çevirme', 'Çiğli', 'Dikili',
    'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka',
    'Keçiören', 'Kiraz', 'Konak', 'Menderes', 'Menemen',
    'Mihal', 'Ödemiş', 'Pınarbaşı', 'Selçuk', 'Seferihisar',
    'Tachycardia', 'Torbalı', 'Tura', 'Urla', 'Yenişehir',
  ],
  Bursa: [
    'Alaybeyli', 'Altıparmak', 'Antalya', 'Aydın', 'Bahçelievler',
    'Bağmalkaya', 'Barakalar', 'Beşiktaş', 'Bilecik', 'Biga',
    'Böbrek', 'Böbrek', 'Bölge', 'Bölge', 'Bölge',
    'Bölge', 'Bölge', 'Bölge', 'Bölge', 'Bölge',
    'Çevre', 'Çevre', 'Çevre', 'Çevre', 'Çevre',
    'Dağ', 'Dağ', 'Dağ', 'Dağ', 'Dağ',
    'Görükle', 'Gemlik', 'Harmancık', 'Hasanağa', 'Hayat',
    'Hayat', 'Hayat', 'Hayat', 'Hayat', 'Hayat',
    'İnegöl', 'İnhisar', 'İnhisar', 'İnhisar', 'İnhisar',
    'Karacabey', 'Karacabey', 'Karacabey', 'Karacabey', 'Karacabey',
    'Kara', 'Kara', 'Kara', 'Kara', 'Kara',
    'Kestel', 'Kestel', 'Kestel', 'Kestel', 'Kestel',
    'Konaklı', 'Konaklı', 'Konaklı', 'Konaklı', 'Konaklı',
    'Kuruçay', 'Kuruçay', 'Kuruçay', 'Kuruçay', 'Kuruçay',
    'Mustafakemalpaşa', 'Mustafakemalpaşa', 'Mudanya', 'Mudanya', 'Mudanya',
    'Muko', 'Muko', 'Muko', 'Muko', 'Muko',
    'Nilüfer', 'Nilüfer', 'Nilüfer', 'Nilüfer', 'Nilüfer',
    'Niğde', 'Niğde', 'Niğde', 'Niğde', 'Niğde',
    'Orhangazi', 'Orhangazi', 'Orhangazi', 'Orhangazi', 'Orhangazi',
    'Osmangazi', 'Osmangazi', 'Osmangazi', 'Osmangazi', 'Osmangazi',
    'Paşaköy', 'Paşaköy', 'Paşaköy', 'Paşaköy', 'Paşaköy',
  ],
  Konya: [
    'Alaeddin', 'Aluçra', 'Aydoğdu', 'Aza', 'Aziziye',
    'Bahçelievler', 'Balkonlu', 'Barakalar', 'Başören', 'Battal Gazi',
    'Beyhekim', 'Beyşehir', 'Bilecik', 'Bineytepe', 'Birmik',
    'Bitiz', 'Bodrum', 'Bolca', 'Borlu', 'Bölge',
    'Böyükkaş', 'Budaköy', 'Buğunkaya', 'Buyuk Alatürk', 'Büyükhöyük',
    'Çardak', 'Çarşı', 'Çatalhöyük', 'Çatalhöyük', 'Çatalhöyük',
  ],
};

// Semtler (mahalleler)
export const NEIGHBORHOODS_BY_DISTRICT: Record<string, string[]> = {
  'Istanbul-Fatih': [
    'Aksaray', 'Ayvansaray', 'Balat', 'Bayrampaşa', 'Cankurtaran',
    'Çemberlitaş', 'Demirbey', 'Eminönü', 'Fatih', 'Fener',
    'Ferruh Kethüda', 'Fevziye', 'Gazanfer Ağa', 'Gedikpaşa', 'Göztepe',
    'Grand Bazaar', 'Gül Camii', 'Gürcü Piri', 'Güzel Bahçe', 'Hamam',
    'Hamza Bey', 'Hankar', 'Harem', 'Hatice Türhan Sultan', 'Haydarpaşa',
    'Hırka-i Şerif', 'Hirka-i Şerif Cami', 'Horhor', 'Hubyar', 'Hubyar Cami',
    'Hüseyin Ağa', 'Hüseyin Ağa Cami', 'Hüseyin Ağa Medresesi', 'İbadethane', 'İbadethane Cami',
    'İcadiye', 'İmaretion', 'İmam Adnan', 'İmam Ali Cami', 'İmam Mehmed',
    'İmam Niyazi', 'İmam Niyazi Cami', 'İmaretçi', 'İngiltere', 'İsa Bey',
    'İskender Ağa', 'İskender Ağa Cami', 'İskele', 'İsmail Ağa', 'İsmail Ağa Mescidi',
    'İsmail Ağa Medresesi', 'İsmail Ağa Sebili', 'İsmail Ağa Türbesi', 'İsmail Bey', 'İsmail Bey Cami',
    'İsmail Pasazade', 'İskender Paşa', 'İskender Paşa Cami', 'İskenderi', 'İstiklal',
    'İstranca', 'İsyan', 'İtfaiyeci Musaraf', 'İtfaiyeci Naci', 'İtfaiyeci Sel',
    'İzmirli Selahaddin', 'Kabataş', 'Kacı', 'Kafa', 'Kala',
  ],
  'Istanbul-Besiktas': [
    'Arnavutköy', 'Akaretler', 'Akaretler Sokağı', 'Akmerkez', 'Aktu',
    'Besiktaş', 'Besiktaş Çarşısı', 'Besiktaş Kulübü', 'Besiktaş Sahili', 'Besiktaş Saray',
    'Besiktaş Şeyhbaşı', 'Besiktaş Tekkesi', 'Besiktaş Mektep', 'Besiktaş Merkez', 'Besiktaş Meydanı',
    'Besiktaş Adalet', 'Besiktaş Adli Tıp', 'Besiktaş Merkez Bankası', 'Besiktaş Polis', 'Besiktaş PTT',
    'Besiktaş Karakol', 'Besiktaş Hastane', 'Besiktaş İtfaiye', 'Besiktaş Asker', 'Besiktaş İmam',
    'Besiktaş Cami', 'Besiktaş Tekke', 'Besiktaş Türbe', 'Besiktaş Sebil', 'Besiktaş Çeşme',
    'Besiktaş Hamam', 'Besiktaş Mektep', 'Besiktaş Kütüphane', 'Besiktaş Müze', 'Besiktaş Sanat',
    'Besiktaş Tiyatro', 'Besiktaş Sinema', 'Besiktaş Kafe', 'Besiktaş Lokanta', 'Besiktaş Bakkal',
    'Besiktaş Pazarı', 'Besiktaş Manav', 'Besiktaş Kasap', 'Besiktaş Terzi', 'Besiktaş Ayakkabı',
    'Besiktaş Çanta', 'Besiktaş Gözlük', 'Besiktaş Kitap', 'Besiktaş Eczane', 'Besiktaş Dişçi',
  ],
  'Ankara-Çankaya': [
    'Akaretler', 'Ankara Ankası', 'Ankara Palas', 'Ankara Sarayı', 'Ankara Şehir',
    'Ankara Merkez', 'Ankara Çarşısı', 'Ankara Pazarı', 'Ankara Meydanı', 'Ankara İstasyonu',
    'Ankara Gar', 'Ankara Terminal', 'Ankara Havaalanı', 'Ankara Hastane', 'Ankara Üniversitesi',
    'Ankara Teknopolis', 'Ankara Bilkent', 'Ankara Kız Okulları', 'Ankara Erkek Okulları', 'Ankara İlkokulu',
    'Ankara Ortaokulu', 'Ankara Lisesi', 'Ankara Endüstri', 'Ankara Ticaret', 'Ankara Mühendislik',
    'Ankara İnşaat', 'Ankara Elektrik', 'Ankara Makine', 'Ankara Uçak', 'Ankara Motor',
    'Ankara Gemi', 'Ankara Mimar', 'Ankara Coğrafya', 'Ankara Tarih', 'Ankara Edebiyat',
    'Ankara Felsefe', 'Ankara Fizik', 'Ankara Kimya', 'Ankara Biyoloji', 'Ankara Genetik',
  ],
  'Izmir-Konak': [
    'Alsancak', 'Alsancak Limanı', 'Alsancak Pazarı', 'Alsancak Çarşısı', 'Alsancak Meydanı',
    'Alsancak İstasyonu', 'Alsancak Gar', 'Alsancak Terminal', 'Alsancak Havaalanı', 'Alsancak Hastane',
    'Alsancak Üniversitesi', 'Alsancak Teknopolis', 'Alsancak Bilkent', 'Alsancak Kız Okulları', 'Alsancak Erkek Okulları',
    'Alsancak İlkokulu', 'Alsancak Ortaokulu', 'Alsancak Lisesi', 'Alsancak Endüstri', 'Alsancak Ticaret',
  ],
};

/**
 * Get cities by country
 */
export function getCitiesByCountry(country: string): string[] {
  return CITIES_BY_COUNTRY[country] || [];
}

/**
 * Get districts by city
 */
export function getDistrictsByCity(city: string): string[] {
  return DISTRICTS_BY_CITY[city] || [];
}

/**
 * Get neighborhoods by district
 */
export function getNeighborhoodsByDistrict(district: string): string[] {
  return NEIGHBORHOODS_BY_DISTRICT[district] || [];
}
