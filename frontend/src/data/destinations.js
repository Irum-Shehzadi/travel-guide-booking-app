// Comprehensive Pakistan Destinations Dataset
// Contains detailed information about provinces, cities, attractions, and travel info

export const provincesData = {
    punjab: {
        name: 'Punjab',
        tagline: 'Land of Five Rivers',
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
        description: 'Punjab is the most populous province, known for its rich history, vibrant culture, fertile lands, and delicious cuisine. Home to the ancient Indus Valley civilization and countless Mughal-era monuments.',
        highlights: ['Mughal Architecture', 'Sufi Shrines', 'Fertile Plains', 'Rich Cuisine'],
        bestTime: 'October to March',
        cities: [
            {
                name: 'Lahore',
                desc: 'The cultural heart of Pakistan',
                fullDescription: 'Known as the "Heart of Pakistan", Lahore is a city of gardens, culture, and history. It boasts magnificent Mughal architecture and a vibrant food scene.',
                population: '11+ Million',
                attractions: [
                    { name: 'Badshahi Mosque', type: 'Religious', desc: 'One of the largest mosques in the world, built by Mughal Emperor Aurangzeb' },
                    { name: 'Lahore Fort', type: 'Historical', desc: 'UNESCO World Heritage Site with Sheesh Mahal (Palace of Mirrors)' },
                    { name: 'Shalimar Gardens', type: 'Gardens', desc: 'UNESCO Heritage Mughal-era royal gardens' },
                    { name: 'Minar-e-Pakistan', type: 'Monument', desc: 'Tower marking where Pakistan Resolution was passed' },
                    { name: 'Food Street', type: 'Food', desc: 'Famous street with traditional Pakistani cuisine' },
                    { name: 'Anarkali Bazaar', type: 'Shopping', desc: 'One of the oldest markets in South Asia' },
                    { name: 'Liberty Market', type: 'Shopping', desc: 'Modern shopping hub with local and international brands' },
                    { name: 'Data Darbar', type: 'Religious', desc: 'Largest Sufi shrine in South Asia' }
                ],
                activities: ['Heritage Walks', 'Food Tours', 'Shopping', 'Photography', 'Night Life'],
                bestTime: 'October to March',
                image: 'https://images.unsplash.com/photo-1567604528979-c77c5ced9cd9?w=800'
            },
            {
                name: 'Islamabad',
                desc: 'The serene capital city',
                fullDescription: 'Pakistan\'s modern and well-planned capital city, nestled at the foot of Margalla Hills. Known for its scenic beauty, cleanliness, and modern architecture.',
                population: '1.1+ Million',
                attractions: [
                    { name: 'Faisal Mosque', type: 'Religious', desc: 'Iconic mosque with unique contemporary design, one of the largest in the world' },
                    { name: 'Margalla Hills', type: 'Nature', desc: 'Beautiful hiking trails with stunning city views' },
                    { name: 'Pakistan Monument', type: 'Monument', desc: 'Lotus-shaped national monument representing unity' },
                    { name: 'Daman-e-Koh', type: 'Viewpoint', desc: 'Scenic viewpoint overlooking the city' },
                    { name: 'Lok Virsa Museum', type: 'Culture', desc: 'Museum showcasing Pakistani heritage and culture' },
                    { name: 'Trail 3', type: 'Hiking', desc: 'Popular hiking trail with waterfall' },
                    { name: 'Centaurus Mall', type: 'Shopping', desc: 'Luxury shopping mall with entertainment' },
                    { name: 'Monal Restaurant', type: 'Dining', desc: 'Hilltop restaurant with panoramic views' }
                ],
                activities: ['Hiking', 'Photography', 'Museum Visits', 'Dining', 'Shopping'],
                bestTime: 'Year Round (Best: Feb-Apr, Sep-Nov)',
                image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'
            },
            {
                name: 'Rawalpindi',
                desc: 'The twin city with rich history',
                fullDescription: 'Sister city to Islamabad, Rawalpindi is known for its bazaars, military heritage, and historical sites. The old city has a distinct charm with narrow streets and traditional markets.',
                population: '2.1+ Million',
                attractions: [
                    { name: 'Raja Bazaar', type: 'Shopping', desc: 'Historic market with everything from clothes to electronics' },
                    { name: 'Ayub National Park', type: 'Nature', desc: 'Large urban park with lake and gardens' },
                    { name: 'Rawalpindi Cricket Stadium', type: 'Sports', desc: 'Historic cricket venue' },
                    { name: 'Army Museum', type: 'Museum', desc: 'Military history and artifacts' },
                    { name: 'Golra Sharif', type: 'Religious', desc: 'Historic railway station and shrine' }
                ],
                activities: ['Shopping', 'Street Food', 'History Tours', 'Cricket Matches'],
                bestTime: 'October to April',
                image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800'
            },
            {
                name: 'Multan',
                desc: 'City of Saints and Shrines',
                fullDescription: 'One of the oldest cities in the world, Multan is famous for its Sufi shrines, handicrafts, mangoes, and distinctive blue pottery. Known as "The City of Saints".',
                population: '1.9+ Million',
                attractions: [
                    { name: 'Shrine of Shah Rukn-e-Alam', type: 'Religious', desc: 'Beautiful 14th-century Sufi shrine' },
                    { name: 'Multan Fort', type: 'Historical', desc: 'Ancient fort with panoramic city views' },
                    { name: 'Bahauddin Zakariya Shrine', type: 'Religious', desc: 'Historic Sufi shrine complex' },
                    { name: 'Hussain Agahi Bazaar', type: 'Shopping', desc: 'Famous for blue pottery and handicrafts' },
                    { name: 'Ghanta Ghar', type: 'Landmark', desc: 'Historic clock tower marketplace' }
                ],
                activities: ['Shrine Visits', 'Mango Tasting', 'Handicraft Shopping', 'Heritage Tours'],
                bestTime: 'November to February',
                image: 'https://images.unsplash.com/photo-1612265666566-d6e4b9c5e3b1?w=800'
            },
            {
                name: 'Bahawalpur',
                desc: 'Desert beauty and royal heritage',
                fullDescription: 'A princely state with stunning palaces, desert landscapes, and rich cultural heritage. Known for its royal architecture and access to the Cholistan Desert.',
                population: '800,000+',
                attractions: [
                    { name: 'Derawar Fort', type: 'Historical', desc: 'Majestic 9th-century desert fort with 40 bastions' },
                    { name: 'Noor Mahal', type: 'Palace', desc: 'Italian-style palace built for a princess' },
                    { name: 'Darbar Mahal', type: 'Palace', desc: 'Beautiful royal palace with gardens' },
                    { name: 'Cholistan Desert', type: 'Nature', desc: 'Vast desert with camel safaris and jeep rallies' },
                    { name: 'Abbasi Mosque', type: 'Religious', desc: 'Historic mosque with stunning architecture' }
                ],
                activities: ['Desert Safari', 'Palace Tours', 'Cholistan Jeep Rally', 'Photography'],
                bestTime: 'November to February',
                image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800'
            },
            {
                name: 'Faisalabad',
                desc: 'Manchester of Pakistan',
                fullDescription: 'Industrial hub and the third-largest city, known for its textile industry, unique clock tower bazaar, and modern infrastructure.',
                population: '3.2+ Million',
                attractions: [
                    { name: 'Clock Tower (Ghanta Ghar)', type: 'Landmark', desc: 'Iconic British-era clock tower with 8 bazaars' },
                    { name: 'Jinnah Gardens', type: 'Park', desc: 'Large recreational park with zoo' },
                    { name: 'Chenab Club', type: 'Recreation', desc: 'Historic club with colonial architecture' },
                    { name: 'Lyallpur Museum', type: 'Museum', desc: 'City history and cultural artifacts' }
                ],
                activities: ['Shopping', 'Textile Tours', 'City Exploration'],
                bestTime: 'October to March',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
            },
            {
                name: 'Sialkot',
                desc: 'Sports goods capital of the world',
                fullDescription: 'Known globally for manufacturing sports goods, surgical instruments, and leather products. Birthplace of poet Allama Iqbal.',
                population: '700,000+',
                attractions: [
                    { name: 'Iqbal Manzil', type: 'Historical', desc: 'Birthplace of national poet Allama Iqbal' },
                    { name: 'Sialkot Fort', type: 'Historical', desc: 'Ancient fort with rich history' },
                    { name: 'Head Marala', type: 'Nature', desc: 'Beautiful barrage and picnic spot' },
                    { name: 'Imam Sahib Shrine', type: 'Religious', desc: 'Historic religious site' }
                ],
                activities: ['Factory Tours', 'Heritage Visits', 'Shopping'],
                bestTime: 'October to March',
                image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800'
            },
            {
                name: 'Gujranwala',
                desc: 'City of Wrestlers',
                fullDescription: 'Known for its wrestling tradition, skilled artisans, and delicious rice dishes. An important industrial center with a rich cultural heritage.',
                population: '2.1+ Million',
                attractions: [
                    { name: 'Jinnah Stadium', type: 'Sports', desc: 'Multi-purpose sports complex' },
                    { name: 'Wazirabad Cutlery', type: 'Shopping', desc: 'Famous for traditional cutlery craftsmanship' },
                    { name: 'Gurdwara Rori Sahib', type: 'Religious', desc: 'Historic Sikh pilgrimage site' }
                ],
                activities: ['Wrestling Events', 'Cutlery Shopping', 'Food Tourism'],
                bestTime: 'October to March',
                image: 'https://images.unsplash.com/photo-1544015759-237f87627c2a?w=800'
            }
        ]
    },

    sindh: {
        name: 'Sindh',
        tagline: 'Cradle of Indus Civilization',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        description: 'Sindh is home to one of the world\'s oldest civilizations - the Indus Valley. From the bustling metropolis of Karachi to the ancient ruins of Mohenjo-daro, it offers a unique blend of history and modernity.',
        highlights: ['Indus Civilization', 'Arabian Sea Coast', 'Sufi Heritage', 'Cultural Diversity'],
        bestTime: 'November to February',
        cities: [
            {
                name: 'Karachi',
                desc: 'City of Lights',
                fullDescription: 'Pakistan\'s largest city and economic hub, Karachi is a melting pot of cultures with beautiful beaches, diverse food, and vibrant nightlife.',
                population: '15+ Million',
                attractions: [
                    { name: 'Clifton Beach', type: 'Beach', desc: 'Popular beach with horse/camel rides and food stalls' },
                    { name: 'Mohatta Palace', type: 'Museum', desc: 'Beautiful stone palace turned museum' },
                    { name: 'Quaid-e-Azam\'s Mausoleum', type: 'Monument', desc: 'Final resting place of Pakistan\'s founder' },
                    { name: 'Port Grand', type: 'Entertainment', desc: 'Food and entertainment complex on the harbor' },
                    { name: 'Churna Island', type: 'Adventure', desc: 'Island for scuba diving and snorkeling' },
                    { name: 'PAF Museum', type: 'Museum', desc: 'Air force museum with aircraft displays' },
                    { name: 'Empress Market', type: 'Shopping', desc: 'Historic Victorian-era market' },
                    { name: 'Sea View', type: 'Beach', desc: 'Long beach stretch with restaurants' }
                ],
                activities: ['Beach Activities', 'Scuba Diving', 'Food Tours', 'Shopping', 'Nightlife'],
                bestTime: 'November to February',
                image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800'
            },
            {
                name: 'Hyderabad',
                desc: 'City of Palaces',
                fullDescription: 'Sindh\'s second-largest city with a rich cultural heritage, known for its handicrafts, especially Sindhi Ajrak and caps. Home to fascinating museums and historic sites.',
                population: '1.7+ Million',
                attractions: [
                    { name: 'Pakka Qila', type: 'Historical', desc: '18th-century fort with museum' },
                    { name: 'Rani Bagh', type: 'Park', desc: 'Historic garden with zoo' },
                    { name: 'Sindh Museum', type: 'Museum', desc: 'Rich collection of Sindhi artifacts' },
                    { name: 'Resham Gali', type: 'Shopping', desc: 'Famous for bangles and handicrafts' },
                    { name: 'Tombs of Talpur Mirs', type: 'Historical', desc: 'Historic royal tombs' }
                ],
                activities: ['Heritage Tours', 'Handicraft Shopping', 'Museum Visits'],
                bestTime: 'November to February',
                image: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800'
            },
            {
                name: 'Larkana',
                desc: 'Gateway to Mohenjo-daro',
                fullDescription: 'A historic city serving as the gateway to the UNESCO World Heritage Site of Mohenjo-daro, one of the largest settlements of the ancient Indus Valley Civilization.',
                population: '500,000+',
                attractions: [
                    { name: 'Mohenjo-daro', type: 'Archaeological', desc: 'UNESCO site - 4,500-year-old Indus Valley city ruins' },
                    { name: 'Archaeological Museum', type: 'Museum', desc: 'Artifacts from Mohenjo-daro excavations' },
                    { name: 'Great Bath', type: 'Archaeological', desc: 'Ancient public bathing pool' },
                    { name: 'Granary', type: 'Archaeological', desc: 'Ancient grain storage structure' }
                ],
                activities: ['Archaeological Tours', 'History Learning', 'Photography'],
                bestTime: 'November to February',
                image: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=800'
            },
            {
                name: 'Thatta',
                desc: 'Historic capital with UNESCO sites',
                fullDescription: 'Once the capital of Sindh, Thatta houses stunning Mughal architecture including the UNESCO-listed Shah Jahan Mosque and the vast Makli Necropolis.',
                population: '300,000+',
                attractions: [
                    { name: 'Shah Jahan Mosque', type: 'Religious', desc: 'UNESCO site - mosque with 93 domes and no pillars' },
                    { name: 'Makli Necropolis', type: 'Historical', desc: 'UNESCO site - one of largest necropolises in world' },
                    { name: 'Keenjhar Lake', type: 'Nature', desc: 'Second largest freshwater lake in Pakistan' }
                ],
                activities: ['Heritage Tours', 'Bird Watching', 'Photography'],
                bestTime: 'November to February',
                image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'
            },
            {
                name: 'Sukkur',
                desc: 'Barrage city on the Indus',
                fullDescription: 'Known for the iconic Sukkur Barrage and the famous Lansdowne Bridge. The city has ancient Sufi shrines and is a major agricultural hub.',
                population: '600,000+',
                attractions: [
                    { name: 'Sukkur Barrage', type: 'Engineering', desc: 'Massive irrigation barrage on Indus River' },
                    { name: 'Lansdowne Bridge', type: 'Engineering', desc: 'Historic railway bridge' },
                    { name: 'Seven Hills', type: 'Nature', desc: 'Limestone hills with temples and shrines' },
                    { name: 'Satpara Stone', type: 'Archaeological', desc: 'Ancient stone with mysterious inscriptions' },
                    { name: 'Lab-e-Mehran', type: 'Promenade', desc: 'Beautiful riverside walkway' }
                ],
                activities: ['Engineering Tours', 'River Views', 'Religious Sites'],
                bestTime: 'November to February',
                image: 'https://images.unsplash.com/photo-1585494156145-1c60a4fe952b?w=800'
            },
            {
                name: 'Mirpur Khas',
                desc: 'Land of Mangoes',
                fullDescription: 'Famous for its mango orchards and traditional Sindhi handicrafts. The city has a rich agricultural heritage and colorful culture.',
                population: '250,000+',
                attractions: [
                    { name: 'Mango Orchards', type: 'Agriculture', desc: 'Famous Sindhri mangoes' },
                    { name: 'Chundko Ruins', type: 'Archaeological', desc: 'Ancient Buddhist stupa ruins' },
                    { name: 'Handicraft Markets', type: 'Shopping', desc: 'Traditional Sindhi embroidery and crafts' }
                ],
                activities: ['Mango Tasting (Summer)', 'Handicraft Shopping', 'Cultural Tours'],
                bestTime: 'May-July (Mangoes) / Nov-Feb (Weather)',
                image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800'
            }
        ]
    },

    kpk: {
        name: 'Khyber Pakhtunkhwa',
        tagline: 'Land of the Brave',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
        description: 'From the ancient Gandhara civilization to the stunning valleys and snow-capped peaks, KPK offers breathtaking natural beauty and rich cultural heritage. Home to the famous Swat Valley and countless adventure destinations.',
        highlights: ['Gandhara Heritage', 'Himalayan Valleys', 'Adventure Sports', 'Pashtun Culture'],
        bestTime: 'April to October',
        cities: [
            {
                name: 'Peshawar',
                desc: 'City of Flowers',
                fullDescription: 'One of the oldest cities in the world, Peshawar is a gateway to the Khyber Pass and Central Asia. Known for its ancient bazaars, rich history, and warm hospitality.',
                population: '2+ Million',
                attractions: [
                    { name: 'Qissa Khwani Bazaar', type: 'Shopping', desc: 'Street of Storytellers - ancient market' },
                    { name: 'Bala Hisar Fort', type: 'Historical', desc: 'Ancient fort with panoramic city views' },
                    { name: 'Peshawar Museum', type: 'Museum', desc: 'World\'s best Gandhara art collection' },
                    { name: 'Mahabat Khan Mosque', type: 'Religious', desc: 'Stunning 17th-century Mughal mosque' },
                    { name: 'Khyber Pass', type: 'Historical', desc: 'Legendary mountain pass to Afghanistan' },
                    { name: 'Sethi House', type: 'Historical', desc: 'Beautiful traditional mansion turned museum' }
                ],
                activities: ['Heritage Walks', 'Bazaar Shopping', 'Museum Tours', 'Culinary Tours'],
                bestTime: 'October to March',
                image: 'https://images.unsplash.com/photo-1579532536935-619928decd08?w=800'
            },
            {
                name: 'Swat Valley',
                desc: 'Switzerland of the East',
                fullDescription: 'A breathtaking valley of emerald lakes, gushing rivers, and pine forests. Once a major center of Buddhist civilization with ancient ruins and stunning natural beauty.',
                population: '2.3+ Million (District)',
                attractions: [
                    { name: 'Malam Jabba', type: 'Adventure', desc: 'Pakistan\'s premier ski resort' },
                    { name: 'Kalam', type: 'Nature', desc: 'Beautiful hill station with waterfalls' },
                    { name: 'Mahodand Lake', type: 'Nature', desc: 'Crystal clear alpine lake' },
                    { name: 'Fizagat Park', type: 'Park', desc: 'Beautiful park along Swat River' },
                    { name: 'Swat Museum', type: 'Museum', desc: 'Gandhara Buddhist artifacts' },
                    { name: 'Ushu Forest', type: 'Nature', desc: 'Dense coniferous forest' },
                    { name: 'Bahrain', type: 'Town', desc: 'Scenic town at river confluence' },
                    { name: 'Mingora', type: 'City', desc: 'Main city with emerald mines nearby' }
                ],
                activities: ['Skiing', 'Trekking', 'Fishing', 'Camping', 'Photography'],
                bestTime: 'March to October',
                image: 'https://images.unsplash.com/photo-1609766418204-94aae0737323?w=800'
            },
            {
                name: 'Chitral',
                desc: 'Land of Kalash',
                fullDescription: 'Remote and beautiful district home to the unique Kalash tribe, ancient forts, and Pakistan\'s highest peak in the Hindu Kush - Tirich Mir.',
                population: '450,000+',
                attractions: [
                    { name: 'Kalash Valley', type: 'Culture', desc: 'Home to the ancient Kalash tribe' },
                    { name: 'Chitral Fort', type: 'Historical', desc: 'Historic fort with museum' },
                    { name: 'Tirich Mir', type: 'Mountain', desc: 'Highest peak of Hindu Kush (7,708m)' },
                    { name: 'Shandur Pass', type: 'Nature', desc: 'Highest polo ground in the world' },
                    { name: 'Shahi Mosque', type: 'Religious', desc: 'Beautiful historic mosque' },
                    { name: 'Garam Chashma', type: 'Hot Springs', desc: 'Natural hot springs' }
                ],
                activities: ['Cultural Tourism', 'Mountaineering', 'Polo Festival', 'Trekking'],
                bestTime: 'May to September',
                image: 'https://images.unsplash.com/photo-1586330657570-b39083bcb47f?w=800'
            },
            {
                name: 'Abbottabad',
                desc: 'City of Pines',
                fullDescription: 'A scenic hill station with pleasant year-round weather, pine forests, and colonial-era architecture. Home to the prestigious Pakistan Military Academy.',
                population: '200,000+',
                attractions: [
                    { name: 'Ilyasi Mosque', type: 'Religious', desc: 'Beautiful mosque with natural spring' },
                    { name: 'Shimla Hill', type: 'Viewpoint', desc: 'Popular hiking destination' },
                    { name: 'PMA Kakul', type: 'Military', desc: 'Prestigious military academy' },
                    { name: 'Thandiani', type: 'Hill Station', desc: 'Scenic hilltop with pine forests' },
                    { name: 'Harnoi', type: 'Nature', desc: 'Beautiful picnic spot' }
                ],
                activities: ['Hiking', 'Sightseeing', 'Shopping', 'Photography'],
                bestTime: 'Year Round',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
            },
            {
                name: 'Naran Kaghan',
                desc: 'Valley of Lakes',
                fullDescription: 'A stunning valley in the Himalayas with crystal-clear lakes, waterfalls, and mountain passes. The gateway to the Babusar Pass and Gilgit-Baltistan.',
                population: '50,000+ (Summer influx)',
                attractions: [
                    { name: 'Lake Saif-ul-Malook', type: 'Nature', desc: 'Legendary alpine lake at 10,578 ft' },
                    { name: 'Lulusar Lake', type: 'Nature', desc: 'Beautiful lake near Babusar Pass' },
                    { name: 'Babusar Pass', type: 'Mountain Pass', desc: '13,691 ft pass with stunning views' },
                    { name: 'Ansoo Lake', type: 'Nature', desc: 'Tear-shaped high-altitude lake' },
                    { name: 'Kunhar River', type: 'Nature', desc: 'River for trout fishing and rafting' },
                    { name: 'Lalazar', type: 'Plateau', desc: 'Beautiful meadow with wildflowers' }
                ],
                activities: ['Boating', 'Trekking', 'Fishing', 'Camping', 'Jeep Safari'],
                bestTime: 'May to September',
                image: 'https://images.unsplash.com/photo-1571406761758-9e69e7aa4c5e?w=800'
            },
            {
                name: 'Dir & Kumrat',
                desc: 'Hidden Paradise',
                fullDescription: 'An off-beaten paradise with lush green valleys, waterfalls, and untouched natural beauty. Kumrat Valley is gaining popularity as a pristine destination.',
                population: '1.2 Million (Dir District)',
                attractions: [
                    { name: 'Kumrat Valley', type: 'Nature', desc: 'Pristine valley with Panjkora River' },
                    { name: 'Jahaz Banda', type: 'Meadow', desc: 'Beautiful alpine meadow' },
                    { name: 'Do Kala Chasma', type: 'Waterfall', desc: 'Twin-stream waterfall' },
                    { name: 'Katora Lake', type: 'Nature', desc: 'Remote glacial lake trek' },
                    { name: 'Dir Fort', type: 'Historical', desc: 'Historic fort ruins' }
                ],
                activities: ['Camping', 'Trekking', 'Photography', 'Fishing'],
                bestTime: 'April to October',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
            }
        ]
    },

    balochistan: {
        name: 'Balochistan',
        tagline: 'Land of Untamed Beauty',
        color: 'from-yellow-500 to-amber-500',
        bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        description: 'Pakistan\'s largest province by area, Balochistan offers dramatic landscapes from the Arabian Sea coastline to vast deserts and mountain ranges. Rich in minerals, culture, and natural wonders.',
        highlights: ['Coastal Beauty', 'Desert Landscapes', 'Ancient Civilizations', 'Natural Resources'],
        bestTime: 'October to March',
        cities: [
            {
                name: 'Quetta',
                desc: 'Fruit Garden of Pakistan',
                fullDescription: 'The provincial capital nestled in a valley surrounded by mountains, famous for its fruits, dry fruits, and pleasant summer climate.',
                population: '1.1+ Million',
                attractions: [
                    { name: 'Hanna Lake', type: 'Nature', desc: 'Beautiful reservoir surrounded by mountains' },
                    { name: 'Quaid-e-Azam Residency', type: 'Historical', desc: 'Historic building where Jinnah stayed' },
                    { name: 'Urak Valley', type: 'Nature', desc: 'Scenic valley with fruit orchards' },
                    { name: 'Hazarganji Chiltan National Park', type: 'Wildlife', desc: 'Home to Chiltan ibex' },
                    { name: 'Ziarat', type: 'Hill Station', desc: 'Beautiful resort with juniper forests' },
                    { name: 'Bolan Pass', type: 'Historical', desc: 'Historic mountain pass' }
                ],
                activities: ['Fruit Picking', 'Hiking', 'Wildlife Viewing', 'Dry Fruit Shopping'],
                bestTime: 'April to September',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
            },
            {
                name: 'Gwadar',
                desc: 'Port of the Future',
                fullDescription: 'A strategic deep-sea port on the Arabian Sea, Gwadar offers pristine beaches, unique rock formations, and is a key part of CPEC.',
                population: '150,000+',
                attractions: [
                    { name: 'Hammerhead Rock', type: 'Nature', desc: 'Unique rock formation on the coast' },
                    { name: 'Gwadar Beach', type: 'Beach', desc: 'Clean, serene beach' },
                    { name: 'Marine Drive', type: 'Promenade', desc: 'Scenic coastal road' },
                    { name: 'Ormara Beach', type: 'Beach', desc: 'Turtle nesting site' },
                    { name: 'Princess of Hope', type: 'Nature', desc: 'Natural rock sculpture in Hingol' },
                    { name: 'Gwadar Port', type: 'Engineering', desc: 'Modern deep-sea port' }
                ],
                activities: ['Beach Activities', 'Fishing', 'Boating', 'Photography'],
                bestTime: 'October to March',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
            },
            {
                name: 'Ziarat',
                desc: 'Juniper Forest Haven',
                fullDescription: 'A beautiful hill station known for the world\'s second-largest juniper forest. The Quaid-e-Azam Residency here is a national monument.',
                population: '15,000+',
                attractions: [
                    { name: 'Juniper Forest', type: 'Nature', desc: 'Ancient juniper trees, some 5,000+ years old' },
                    { name: 'Quaid-e-Azam Residency', type: 'Historical', desc: 'Where Jinnah spent his last days' },
                    { name: 'Prospect Point', type: 'Viewpoint', desc: 'Panoramic valley views' },
                    { name: 'Sandeman Tangi', type: 'Nature', desc: 'Scenic gorge and valley' }
                ],
                activities: ['Nature Walks', 'Historical Tours', 'Photography', 'Bird Watching'],
                bestTime: 'May to September',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
            },
            {
                name: 'Hingol National Park',
                desc: 'Pakistan\'s Largest National Park',
                fullDescription: 'A diverse ecosystem with unique geological formations, mud volcanoes, and the famous Princess of Hope rock formation.',
                population: 'N/A (Protected Area)',
                attractions: [
                    { name: 'Princess of Hope', type: 'Nature', desc: 'Natural rock resembling a woman' },
                    { name: 'Sphinx', type: 'Nature', desc: 'Rock formation resembling the Egyptian Sphinx' },
                    { name: 'Hinglaj Mata Temple', type: 'Religious', desc: 'Ancient Hindu pilgrimage site' },
                    { name: 'Mud Volcanoes', type: 'Geological', desc: 'Active mud volcanoes' },
                    { name: 'Makran Coastal Highway', type: 'Road', desc: 'Scenic coastal drive' }
                ],
                activities: ['Safari', 'Geological Tours', 'Photography', 'Hiking'],
                bestTime: 'October to March',
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
            }
        ]
    },

    gilgit: {
        name: 'Gilgit-Baltistan',
        tagline: 'Heaven on Earth',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
        description: 'Home to five of the world\'s fourteen 8,000+ meter peaks including K2, the world\'s second-highest mountain. A paradise for mountaineers, trekkers, and nature lovers with stunning valleys and ancient silk route heritage.',
        highlights: ['K2 & 8000ers', 'Ancient Silk Route', 'Glaciers & Lakes', 'Adventure Tourism'],
        bestTime: 'May to October',
        cities: [
            {
                name: 'Gilgit',
                desc: 'Gateway to the Mountains',
                fullDescription: 'The capital of Gilgit-Baltistan, serving as the gateway to some of the world\'s highest peaks. A blend of ancient Silk Route heritage and modern mountain tourism.',
                population: '300,000+',
                attractions: [
                    { name: 'Kargah Buddha', type: 'Archaeological', desc: '7th-century Buddha rock carving' },
                    { name: 'Gilgit Bridge', type: 'Landmark', desc: 'Suspension bridge over Gilgit River' },
                    { name: 'Jutial', type: 'Viewpoint', desc: 'Scenic hilltop area' },
                    { name: 'Naltar Valley', type: 'Nature', desc: 'Colorful lakes and ski slopes' },
                    { name: 'Karakoram Highway', type: 'Road', desc: 'World\'s highest paved international road' }
                ],
                activities: ['Trekking', 'Mountaineering', 'Skiing (Naltar)', 'Cultural Tours'],
                bestTime: 'April to October',
                image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800'
            },
            {
                name: 'Hunza Valley',
                desc: 'Paradise on Earth',
                fullDescription: 'Often called the real-life Shangri-La, Hunza is famous for its stunning mountain views, ancient forts, friendly people, and the legendary Attabad Lake.',
                population: '100,000+',
                attractions: [
                    { name: 'Attabad Lake', type: 'Nature', desc: 'Turquoise lake formed by 2010 landslide' },
                    { name: 'Baltit Fort', type: 'Historical', desc: '700-year-old restored fort' },
                    { name: 'Altit Fort', type: 'Historical', desc: 'Oldest fort in Hunza' },
                    { name: 'Eagle\'s Nest', type: 'Viewpoint', desc: 'Best view of Hunza Valley' },
                    { name: 'Rakaposhi View Point', type: 'Viewpoint', desc: 'Stunning view of 7,788m peak' },
                    { name: 'Passu Cones', type: 'Nature', desc: 'Iconic cathedral-shaped peaks' },
                    { name: 'Hussaini Suspension Bridge', type: 'Adventure', desc: 'One of the most dangerous bridges' },
                    { name: 'Borith Lake', type: 'Nature', desc: 'Beautiful lake near Passu' }
                ],
                activities: ['Photography', 'Trekking', 'Fort Tours', 'Boating', 'Cultural Experiences'],
                bestTime: 'April to October',
                image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800'
            },
            {
                name: 'Skardu',
                desc: 'Gateway to K2',
                fullDescription: 'The base for expeditions to K2 and other 8000-meter peaks. Features stunning lakes, ancient forts, and access to Deosai National Park.',
                population: '50,000+',
                attractions: [
                    { name: 'Shangrila Resort', type: 'Resort', desc: 'Heart-shaped lake and gardens' },
                    { name: 'Upper Kachura Lake', type: 'Nature', desc: 'Crystal clear alpine lake' },
                    { name: 'Lower Kachura Lake', type: 'Nature', desc: 'Beautiful lake with resort' },
                    { name: 'Skardu Fort', type: 'Historical', desc: 'Historic fort with valley views' },
                    { name: 'Satpara Lake', type: 'Nature', desc: 'Large freshwater lake' },
                    { name: 'Manthoka Waterfall', type: 'Nature', desc: 'Stunning 180ft waterfall' },
                    { name: 'K2 Base Camp', type: 'Trekking', desc: 'World\'s most challenging base camp trek' }
                ],
                activities: ['K2 Treks', 'Mountaineering', 'Boating', 'Jeep Safaris', 'Photography'],
                bestTime: 'May to September',
                image: 'https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=800'
            },
            {
                name: 'Deosai National Park',
                desc: 'Land of Giants',
                fullDescription: 'One of the highest plateaus in the world, Deosai is a vast alpine meadow known as "Land of Giants" and is home to the Himalayan brown bear.',
                population: 'N/A (Protected Area)',
                attractions: [
                    { name: 'Deosai Plains', type: 'Nature', desc: 'World\'s second-highest plateau' },
                    { name: 'Sheosar Lake', type: 'Nature', desc: 'Beautiful high-altitude lake' },
                    { name: 'Himalayan Brown Bear', type: 'Wildlife', desc: 'Endangered bear species habitat' },
                    { name: 'Bara Pani', type: 'Nature', desc: 'Scenic river and camping spot' },
                    { name: 'Wildflower Meadows', type: 'Nature', desc: 'Colorful summer blooms' }
                ],
                activities: ['Wildlife Watching', 'Camping', 'Photography', 'Hiking'],
                bestTime: 'July to September',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
            },
            {
                name: 'Fairy Meadows',
                desc: 'Base of the Killer Mountain',
                fullDescription: 'A lush green plateau offering breathtaking views of Nanga Parbat (8,126m), the world\'s ninth-highest peak. One of Pakistan\'s most iconic destinations.',
                population: 'N/A (Tourist Area)',
                attractions: [
                    { name: 'Nanga Parbat Base Camp', type: 'Trekking', desc: 'Trek to the Killer Mountain base' },
                    { name: 'Fairy Meadows Viewpoint', type: 'Viewpoint', desc: 'Unobstructed Nanga Parbat views' },
                    { name: 'Raikot Bridge', type: 'Landmark', desc: 'Starting point for the trek' },
                    { name: 'Beyal Camp', type: 'Camping', desc: 'Campsite at higher altitude' },
                    { name: 'Reflection Lake', type: 'Nature', desc: 'Lake reflecting Nanga Parbat' }
                ],
                activities: ['Trekking', 'Camping', 'Star Gazing', 'Photography'],
                bestTime: 'May to October',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
            },
            {
                name: 'Khaplu',
                desc: 'Ancient Kingdom',
                fullDescription: 'A remote valley in Baltistan known for its historic palace, apricot orchards, and the stunning Chaqchan Mosque - one of the oldest in the region.',
                population: '40,000+',
                attractions: [
                    { name: 'Khaplu Palace', type: 'Historical', desc: 'Beautifully restored 19th-century palace' },
                    { name: 'Chaqchan Mosque', type: 'Religious', desc: '14th-century wooden mosque' },
                    { name: 'Thalle Valley', type: 'Nature', desc: 'Scenic valley with traditional villages' },
                    { name: 'Apricot Orchards', type: 'Agriculture', desc: 'Famous organic apricots' },
                    { name: 'Ser Monastery', type: 'Religious', desc: 'Ancient Buddhist ruins' }
                ],
                activities: ['Heritage Tours', 'Photography', 'Fruit Picking', 'Village Walks'],
                bestTime: 'April to October',
                image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800'
            }
        ]
    },

    azadKashmir: {
        name: 'Azad Kashmir',
        tagline: 'Paradise of the Subcontinent',
        color: 'from-teal-500 to-green-500',
        bgColor: 'bg-gradient-to-br from-teal-50 to-green-50',
        description: 'Azad Kashmir boasts lush green valleys, pristine rivers, and stunning mountain landscapes. Known for its natural beauty, hospitality, and the iconic Neelum Valley.',
        highlights: ['Neelum Valley', 'Lush Forests', 'River Valleys', 'Mountain Views'],
        bestTime: 'April to October',
        cities: [
            {
                name: 'Muzaffarabad',
                desc: 'Capital by the River',
                fullDescription: 'The capital of Azad Kashmir, situated at the confluence of Neelum and Jhelum rivers. A gateway to the stunning valleys of the region.',
                population: '150,000+',
                attractions: [
                    { name: 'Red Fort', type: 'Historical', desc: 'Historic Mughal-era fort' },
                    { name: 'Pir Chinasi', type: 'Viewpoint', desc: 'Hilltop shrine with panoramic views' },
                    { name: 'Neelum River', type: 'Nature', desc: 'Beautiful turquoise river' },
                    { name: 'Subri Lake', type: 'Nature', desc: 'Scenic lake nearby' }
                ],
                activities: ['Sightseeing', 'Photography', 'River Views', 'Shopping'],
                bestTime: 'April to October',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
            },
            {
                name: 'Neelum Valley',
                desc: 'Blue Gem of Kashmir',
                fullDescription: 'A 200km long valley running alongside the Neelum River, famous for its lush green forests, waterfalls, and traditional Kashmiri villages.',
                population: '200,000+',
                attractions: [
                    { name: 'Sharda', type: 'Historical', desc: 'Ancient university ruins' },
                    { name: 'Kel', type: 'Village', desc: 'Scenic village with mountain views' },
                    { name: 'Arang Kel', type: 'Village', desc: 'Hilltop village accessible by chair lift' },
                    { name: 'Ratti Gali Lake', type: 'Nature', desc: 'Alpine glacial lake' },
                    { name: 'Dhani Waterfall', type: 'Waterfall', desc: 'Beautiful cascading waterfall' },
                    { name: 'Kutton', type: 'Nature', desc: 'Scenic area with waterfalls' }
                ],
                activities: ['Trekking', 'Camping', 'Photography', 'Village Tours'],
                bestTime: 'May to September',
                image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800'
            },
            {
                name: 'Rawalakot',
                desc: 'Pearl of the Valley',
                fullDescription: 'A beautiful hill station known for its pleasant climate, pine forests, and as a base for exploring the Poonch region.',
                population: '60,000+',
                attractions: [
                    { name: 'Banjosa Lake', type: 'Nature', desc: 'Beautiful artificial lake in pine forest' },
                    { name: 'Toli Pir', type: 'Viewpoint', desc: 'High mountain viewpoint (8,800 ft)' },
                    { name: 'Poonch River', type: 'Nature', desc: 'Scenic river valley' },
                    { name: 'Bagh', type: 'Town', desc: 'Historic town nearby' }
                ],
                activities: ['Boating', 'Hiking', 'Photography', 'Nature Walks'],
                bestTime: 'April to October',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
            }
        ]
    }
};

// Get all cities across all provinces
export const getAllCities = () => {
    const allCities = [];
    Object.entries(provincesData).forEach(([provinceKey, province]) => {
        province.cities.forEach(city => {
            allCities.push({
                ...city,
                province: province.name,
                provinceKey,
                color: province.color
            });
        });
    });
    return allCities;
};

// Get featured destinations
export const getFeaturedDestinations = () => {
    return [
        { ...provincesData.gilgit.cities.find(c => c.name === 'Hunza Valley'), province: 'Gilgit-Baltistan' },
        { ...provincesData.kpk.cities.find(c => c.name === 'Swat Valley'), province: 'KPK' },
        { ...provincesData.gilgit.cities.find(c => c.name === 'Skardu'), province: 'Gilgit-Baltistan' },
        { ...provincesData.punjab.cities.find(c => c.name === 'Lahore'), province: 'Punjab' },
        { ...provincesData.kpk.cities.find(c => c.name === 'Naran Kaghan'), province: 'KPK' },
        { ...provincesData.gilgit.cities.find(c => c.name === 'Fairy Meadows'), province: 'Gilgit-Baltistan' }
    ];
};

// Search destinations
export const searchDestinations = (query) => {
    const allCities = getAllCities();
    const lowerQuery = query.toLowerCase();

    return allCities.filter(city =>
        city.name.toLowerCase().includes(lowerQuery) ||
        city.desc.toLowerCase().includes(lowerQuery) ||
        city.province.toLowerCase().includes(lowerQuery) ||
        city.attractions?.some(a => a.name.toLowerCase().includes(lowerQuery)) ||
        city.activities?.some(a => a.toLowerCase().includes(lowerQuery))
    );
};

export default provincesData;
