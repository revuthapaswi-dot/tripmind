import { Trip } from '../types';

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'kyoto-autumn-quiet',
    title: 'Kyoto: The Architecture of Solitude',
    destination: 'Kyoto & Kansai',
    country: 'Japan',
    subtitle: 'A sensory expedition through moss gardens, wooden kissaten, and early-morning Zen sanctuaries.',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    season: 'Late Autumn / Early Winter',
    recommendedDuration: '5 Days / 4 Nights',
    curator: {
      name: 'Kenzo Moriyama',
      role: 'Kyoto Architectural Historian & Essayist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    editorialPreamble: 'To encounter Kyoto before the crowds awaken is to understand the Japanese principle of yūgen—a profound grace that hints at the mystery of the universe. In this curated monograph, we avoid the coach-bus corridors to focus on the cedar alleys of Higashiyama at dawn, private tea pavilions in Uji, and century-old kissa where coffee is dripped drop-by-drop through cloth nel filters.',
    vibeTags: ['Wabi-Sabi Aesthetics', 'Kissaten Culture', 'Private Zen Temples', 'Kaiseki Masterclasses', 'Artisan Stonework'],
    mapCenter: {
      lat: 35.0116,
      lng: 135.7681,
      zoom: 13
    },
    logistics: {
      flights: [
        {
          flightNumber: 'NH 0984',
          airline: 'All Nippon Airways',
          from: 'HND (Tokyo Haneda)',
          to: 'ITM (Osaka Itami)',
          departureTime: '07:15 AM',
          arrivalTime: '08:25 AM',
          status: 'On Schedule'
        },
        {
          flightNumber: 'Shinkansen Nozomi 213',
          airline: 'JR Central',
          from: 'Shin-Osaka',
          to: 'Kyoto Station',
          departureTime: '09:02 AM',
          arrivalTime: '09:16 AM',
          status: 'Seat 14-A (Green Car)'
        }
      ],
      accommodations: [
        {
          name: 'The Mitsui Kyoto (Nijo)',
          type: 'Heritage Ryokan-Hotel',
          checkIn: 'Oct 14, 15:00',
          checkOut: 'Oct 17, 11:00',
          neighborhood: 'Nakagyo Ward, across Nijo Castle',
          confirmationCode: 'MTS-8841-KTO',
          ratePerNight: '¥84,000 / night',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Sowaka Heritage Inn',
          type: 'Converted Sukiya Villa',
          checkIn: 'Oct 17, 15:00',
          checkOut: 'Oct 19, 12:00',
          neighborhood: 'Gion-Minamigawa',
          confirmationCode: 'SWK-2094-GN',
          ratePerNight: '¥98,000 / night',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
        }
      ],
      passes: [
        {
          name: 'JR Kansai-Hiroshima Area Pass',
          type: 'Rail Transit',
          validity: '5 Consecutive Days',
          details: 'Unlimited reserved seats on Sanyo Shinkansen & Haruka Express'
        },
        {
          name: 'Welcome Suica IC Card',
          type: 'Contactless Transit & Merchant Tap',
          validity: 'Active (Balance: ¥9,450)',
          details: 'Use for all Kyoto city subways, Keihan rail, and local buses'
        }
      ],
      budgetSummary: {
        totalEstimate: '¥482,000',
        spent: '¥310,000',
        breakdown: {
          stays: '¥266,000',
          dining: '¥124,000',
          experiences: '¥62,000',
          transit: '¥30,000'
        }
      }
    },
    days: [
      {
        dayNumber: 1,
        title: 'Higashiyama Dawn & Stone Canals',
        subtitle: 'Tracing the footpaths of poets before the city stirs',
        date: 'Wednesday, Oct 14',
        weather: {
          temp: '18°C / 64°F',
          condition: 'Crisp morning sun with mist over Eastern hills',
          icon: 'crisp'
        },
        walkingDistanceKm: 7.2,
        estimatedTransitTime: '24 mins local tram & walk',
        highlights: ['Sannenzaka stone incline in blue hour', 'Private tea ceremony at Gion Ryokan', 'Nel drip coffee at Kissaten Rokubankan'],
        stops: [
          {
            id: 'stop-1-1',
            title: 'Kiyomizu-dera & Sannenzaka Incline',
            japaneseTitle: '清水寺と三年坂の静寂',
            time: '06:30',
            duration: '90 mins',
            cost: '¥400',
            category: 'Culture & Heritage',
            neighborhood: 'Higashiyama Ward',
            address: '1-294 Kiyomizu, Higashiyama Ward, Kyoto',
            coordinates: { lat: 34.9949, lng: 135.7850, mapX: 74, mapY: 68 },
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'At dawn, the great cedar stage of Kiyomizu hovers above the maple canopy without a single tourist tour. The smell of burning incense drifts down the stone-flagged staircases of Ninenzaka, where wooden machiya facades remain barred shut in peaceful slumber.',
            insiderTip: 'Ascend precisely as the temple gates swing open at 06:00. The Otowa waterfall springs are deserted, allowing you to drink the sacred water without queues.',
            curatorQuote: 'The wooden joints of the main hall creak in rhythm with morning breeze. Here, architecture does not conquer nature; it suspends you within it.',
            etiquetteNotes: 'Maintain quiet voices; shoes must be removed when entering the main worship platform.',
            bestTimeOfDay: '06:00 – 07:30',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 4210,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 14,
              description: 'Gentle downhill stroll through cobblestone Ninenzaka onto Yasaka Pagoda alley',
              distanceKm: 0.9
            }
          },
          {
            id: 'stop-1-2',
            title: 'Hōkan-ji (Yasaka Pagoda) Vista',
            japaneseTitle: '法観寺 八坂の塔',
            time: '08:15',
            duration: '45 mins',
            cost: 'Free',
            category: 'Craft & Architecture',
            neighborhood: 'Yasaka',
            address: '388 Yasakakamimachi, Higashiyama Ward, Kyoto',
            coordinates: { lat: 34.9984, lng: 135.7797, mapX: 68, mapY: 62 },
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'The five-story pagoda stands as Kyoto’s singular vertical needle. Built originally in 592 AD by Prince Shotoku, its weathered hinoki cypress timber has darkened into a rich obsidian tone that absorbs morning light.',
            insiderTip: 'Frame your photograph from the corner of Yasaka-dori where the stone street curves. Rickshaw pullers begin polishing their lacquered carriages around 8:30 AM.',
            etiquetteNotes: 'Do not block residential entryways with tripods.',
            bestTimeOfDay: 'Early morning or dusk',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.8,
            reviewCount: 1840,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 12,
              description: 'Follow the willow-lined canal north toward Shirakawa Stream',
              distanceKm: 0.7
            }
          },
          {
            id: 'stop-1-3',
            title: 'Café de L’Ambre Style Nel Drip at Kissa Rokubankan',
            japaneseTitle: '六曜社地下喫茶室',
            time: '09:30',
            duration: '60 mins',
            cost: '¥950',
            category: 'Tea & Coffee Culture',
            neighborhood: 'Sanjo-Kawaramachi',
            address: '36 Daikokucho, Nakagyo Ward, Kyoto',
            coordinates: { lat: 35.0089, lng: 135.7695, mapX: 52, mapY: 48 },
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'A smoky mid-century subterranean temple of dark roasted Mandheling and Sumatra beans. The master prepares each cup with surgical devotion, pouring steaming water in millimeter droplets from a brass kettle into a flannel cloth filter.',
            insiderTip: 'Order the House Deep Roast alongside a slice of handmade plain butter doughnut, fried fresh every morning at 9:00.',
            curatorQuote: 'Japanese kissaten are not places for digital work; they are sanctuaries of deliberate stillness where time is measured in drips of amber oil.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.7,
            reviewCount: 910,
            transitToNext: {
              mode: 'train',
              durationMinutes: 18,
              description: 'Board Tozai Subway Line from Sanjo-Keihan to Keage Station',
              distanceKm: 2.8
            }
          },
          {
            id: 'stop-1-4',
            title: 'Nanzen-ji & The Roman Aqueduct (Suirokaku)',
            japaneseTitle: '南禅寺と水路閣',
            time: '11:15',
            duration: '90 mins',
            cost: '¥600',
            category: 'Culture & Heritage',
            neighborhood: 'Sakyo Ward',
            address: 'Nanzenji Fukuchicho, Sakyo Ward, Kyoto',
            coordinates: { lat: 35.0113, lng: 135.7942, mapX: 82, mapY: 42 },
            image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'An unexpected encounter between classical Zen simplicity and 19th-century red-brick European industrialism. The arched Roman aqueduct was built in 1890 to divert lake water from Lake Biwa to Kyoto. Lichen and moss now claim the terracotta bricks.',
            insiderTip: 'Climb the colossal Sanmon gate for a bird’s-eye panorama across the forested foothills of Higashiyama.',
            etiquetteNotes: 'Do not climb the stone foundations of the aqueduct arches.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 3100,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 8,
              description: 'Short path into the secluded Nanzenji-Kusagawa quarter',
              distanceKm: 0.4
            }
          },
          {
            id: 'stop-1-5',
            title: 'Junsei Yudofu (Simmered Silken Tofu Pavilion)',
            japaneseTitle: '南禅寺 順正 湯豆腐会席',
            time: '13:00',
            duration: '75 mins',
            cost: '¥4,800',
            category: 'Epicurean & Dining',
            neighborhood: 'Nanzenji',
            address: '60 Kusagawacho, Nanzenji, Sakyo Ward, Kyoto',
            coordinates: { lat: 35.0104, lng: 135.7915, mapX: 79, mapY: 44 },
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Dining in a 1,200-tsubo landscaped garden dating back to the Tenpo era. The yudofu is crafted using Kyoto’s naturally soft mineral water, simmered in ceramic hot pots over charcoal with kelp dashi and grated ginger.',
            insiderTip: 'Request a veranda table facing the koi pond when confirming your reservation.',
            bookingStatus: 'Confirmed',
            rating: 4.8,
            reviewCount: 1420
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Arashiyama Waterways & The Bamboo Veil',
        subtitle: 'Navigating Western Kyoto by wooden flatboat and mountain temple paths',
        date: 'Thursday, Oct 15',
        weather: {
          temp: '20°C / 68°F',
          condition: 'Partly sunny with soft mountain breezes',
          icon: 'sunny'
        },
        walkingDistanceKm: 6.5,
        estimatedTransitTime: '30 mins Keifuku Randen tram',
        highlights: ['Togetsukyo Bridge in morning fog', 'Tenryu-ji Sogenchi Garden reflection', 'Otagi Nenbutsu-ji 1,200 smiling stone rakan'],
        stops: [
          {
            id: 'stop-2-1',
            title: 'Hozugawa Riverfront & Togetsukyo Bridge',
            japaneseTitle: '渡月橋と保津川の朝霧',
            time: '07:30',
            duration: '60 mins',
            cost: 'Free',
            category: 'Nature & Scenic',
            neighborhood: 'Arashiyama',
            address: 'Saga Tenryuji, Ukyo Ward, Kyoto',
            coordinates: { lat: 35.0134, lng: 135.6777, mapX: 18, mapY: 42 },
            image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Togetsukyo translates poetically to "Moon Crossing Bridge." Early morning presents a glassy river reflecting the emerald slopes of Mount Ogura before the tour boats start their engines.',
            insiderTip: 'Walk upstream along the northern bank toward the private dock of Hoshinoya to see traditional wooden skiffs moored against cedar trees.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.8,
            reviewCount: 5200,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 10,
              description: 'Follow the temple outer wall north toward Tenryu-ji main gate',
              distanceKm: 0.6
            }
          },
          {
            id: 'stop-2-2',
            title: 'Tenryū-ji Sogenchi Dry Landscape Garden',
            japaneseTitle: '天龍寺 曹源池庭園',
            time: '08:45',
            duration: '75 mins',
            cost: '¥800',
            category: 'Culture & Heritage',
            neighborhood: 'Arashiyama',
            address: '68 Saga Tenryuji Susukinobabacho, Ukyo Ward, Kyoto',
            coordinates: { lat: 35.0158, lng: 135.6775, mapX: 20, mapY: 40 },
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Designed by Muso Soseki in the 14th century, this garden pioneered "borrowed scenery" (shakkei), seamlessly incorporating the peaks of the Arashiyama mountains into its pond framing.',
            insiderTip: 'Sit directly on the polished cedar veranda of the Hōjō hall. The sound of gravel crunching and carp breaching is hypnotic.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 3880,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 5,
              description: 'Exit via the North Gate directly into the Bamboo Grove',
              distanceKm: 0.2
            }
          },
          {
            id: 'stop-2-3',
            title: 'Sagano Bamboo Grove (Inner Canopy)',
            japaneseTitle: '嵯峨野 竹林の小径',
            time: '10:15',
            duration: '45 mins',
            cost: 'Free',
            category: 'Nature & Scenic',
            neighborhood: 'Sagano',
            address: 'Sagatenryuji Kuramichicho, Ukyo Ward, Kyoto',
            coordinates: { lat: 35.0169, lng: 135.6712, mapX: 16, mapY: 38 },
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Tens of thousands of towering moso bamboo culms creak against one another in the wind. The Ministry of Environment designated the sound of this forest as one of Japan’s "100 Soundscapes to Preserve."',
            insiderTip: 'Turn right at the junction toward Okochi Sanso Villa to escape 90% of pedestrians walking toward the train station.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.7,
            reviewCount: 6400,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 22,
              description: 'Uphill scenic walk through preserved Saga-Toriimoto thatched merchant lane',
              distanceKm: 1.4
            }
          },
          {
            id: 'stop-2-4',
            title: 'Otagi Nenbutsu-ji: The 1,200 Whimsical Rakan',
            japaneseTitle: '愛宕念仏寺 千二百羅漢',
            time: '11:45',
            duration: '60 mins',
            cost: '¥300',
            category: 'Sanctuary & Stay',
            neighborhood: 'Saga-Toriimoto',
            address: '2-5 Sagatorimoto Fukatanicho, Ukyo Ward, Kyoto',
            coordinates: { lat: 35.0298, lng: 135.6601, mapX: 12, mapY: 26 },
            image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'A mountain sanctuary blanketed in velvety green moss where 1,200 unique stone disciples of Buddha sit beneath maple trees. Each statue was carved by different amateur sculptors in the 1980s under the guidance of sculptor-monk Kocho Nishimura.',
            insiderTip: 'Look closely at individual rakan—you will find statues holding sake flasks, tennis rackets, and cassette recorders.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 890,
            transitToNext: {
              mode: 'bus',
              durationMinutes: 15,
              description: 'Local Kyoto bus #94 down to Arashiyama main junction',
              distanceKm: 2.2
            }
          },
          {
            id: 'stop-2-5',
            title: 'Soba Noodles at Arashiyama Yoshimura',
            japaneseTitle: '嵐山よしむら 手打ち蕎麦',
            time: '13:15',
            duration: '60 mins',
            cost: '¥2,800',
            category: 'Epicurean & Dining',
            neighborhood: 'Arashiyama',
            address: '3 Saga Tenryuji Tsukurimichicho, Ukyo Ward, Kyoto',
            coordinates: { lat: 35.0125, lng: 135.6771, mapX: 18, mapY: 43 },
            image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Hand-kneaded juwari soba (100% buckwheat) served on cedar trays overlooking the rushing waters of the Oi River and Togetsukyo Bridge.',
            insiderTip: 'Order the cold seiro soba with tempura wild mountain greens (sansai). Finish by pouring hot sobayu into your dipping broth.',
            bookingStatus: 'Advance Booking Required',
            rating: 4.8,
            reviewCount: 1670
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'The Philosopher’s Walk & Hidden Craft Kilns',
        subtitle: 'Meditative canals, silver pavilions, and ceramic master workshops',
        date: 'Friday, Oct 16',
        weather: {
          temp: '17°C / 62°F',
          condition: 'Scattered clouds with golden evening light',
          icon: 'cloudy'
        },
        walkingDistanceKm: 8.1,
        estimatedTransitTime: '20 mins city bus',
        highlights: ['Ginkaku-ji Sand Sea & Cone', 'Strolling the stone canal of Nishida Kitaro', 'Private ceramics atelier in Kiyomizu-yaki'],
        stops: [
          {
            id: 'stop-3-1',
            title: 'Ginkaku-ji (The Silver Pavilion)',
            japaneseTitle: '銀閣寺 慈照寺と向月台',
            time: '08:30',
            duration: '75 mins',
            cost: '¥500',
            category: 'Culture & Heritage',
            neighborhood: 'Higashiyama North',
            address: '2 Ginkakujicho, Sakyo Ward, Kyoto',
            coordinates: { lat: 35.0272, lng: 135.7982, mapX: 84, mapY: 28 },
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Unlike the gilded spectacle of Kinkaku-ji, the Silver Pavilion was never coated in metal; its genius lies in the minimalist Ginshadan (Sea of Silver Sand) and Kogetsudai (Moon-Viewing Platform) sculpted from white granite powder.',
            insiderTip: 'Take the elevated mountain pathway behind the temple for an astonishing composition of the pavilion roof against Kyoto’s western skyline.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 4600,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 5,
              description: 'Descend to the stone bridge marking the northern head of the canal path',
              distanceKm: 0.3
            }
          },
          {
            id: 'stop-3-2',
            title: 'Tetsugaku-no-Michi (The Philosopher’s Path)',
            japaneseTitle: '哲学の道 石畳の散策',
            time: '10:00',
            duration: '60 mins',
            cost: 'Free',
            category: 'Nature & Scenic',
            neighborhood: 'Sakyo Ward',
            address: 'Jodoji Ishibashicho to Nyakuoji, Sakyo Ward, Kyoto',
            coordinates: { lat: 35.0210, lng: 135.7955, mapX: 83, mapY: 34 },
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'A two-kilometer pedestrian stone path flanking a cherry-tree lined canal. Named after philosopher Nishida Kitaro, who walked this exact route daily in deep contemplation developing his Kyoto School philosophy.',
            insiderTip: 'Watch for independent ceramic stalls tucked into traditional residential courtyards along the eastern side of the canal.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.8,
            reviewCount: 3900,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 10,
              description: 'Follow the stone path south toward Honen-in gate',
              distanceKm: 0.5
            }
          },
          {
            id: 'stop-3-3',
            title: 'Hōnen-in: The Moss-Gate Sanctuary',
            japaneseTitle: '法然院 茅葺きの山門と白砂壇',
            time: '11:15',
            duration: '45 mins',
            cost: 'Free',
            category: 'Sanctuary & Stay',
            neighborhood: 'Shishigatani',
            address: '30 Goshonodancho, Shishigatani, Sakyo Ward, Kyoto',
            coordinates: { lat: 35.0234, lng: 135.7972, mapX: 85, mapY: 32 },
            image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Pass through the thatched cedar gate into a hidden pocket of silent forest. Two raked sand mounds flank the entrance, refreshed weekly with seasonal motifs like maple leaves or ripples.',
            insiderTip: 'Very few groups make it here; it remains one of the most serene sanctuaries in eastern Kyoto.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 1120,
            transitToNext: {
              mode: 'train',
              durationMinutes: 20,
              description: 'Bus to Kawaramachi city center for lunch and tea atelier',
              distanceKm: 3.5
            }
          },
          {
            id: 'stop-3-4',
            title: 'Ippodo Tea Kyoto Main Store & Kaboku Tearoom',
            japaneseTitle: '一保堂茶舗 京都本店 嘉木',
            time: '13:00',
            duration: '75 mins',
            cost: '¥1,800',
            category: 'Tea & Coffee Culture',
            neighborhood: 'Teramachi-dori',
            address: 'Teramachi-dori Nijo-agaru, Nakagyo Ward, Kyoto',
            coordinates: { lat: 35.0139, lng: 135.7675, mapX: 50, mapY: 42 },
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Founded in 1717, Ippodo is the grand master of Japanese green tea. At the Kaboku tearoom, you are guided through brewing your own gyokuro or whisking rich usucha matcha using hot water at precisely 60°C.',
            insiderTip: 'Buy tins of Sayaka-no-Mukashi matcha and freshly roasted Hojicha to take home in airtight washi paper canisters.',
            bookingStatus: 'Confirmed',
            rating: 4.9,
            reviewCount: 2850
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Uji Green Tea Terraces & Byodoin Phoenix',
        subtitle: 'The birthplace of Japanese tea masterworks and Heian dynasty palaces',
        date: 'Saturday, Oct 17',
        weather: {
          temp: '21°C / 70°F',
          condition: 'Luminous sunshine with clear skies',
          icon: 'sunny'
        },
        walkingDistanceKm: 5.4,
        estimatedTransitTime: '22 mins JR Nara Rapid Line',
        highlights: ['Byodoin Phoenix Hall on the pond', 'Whisking ceremonial Gyokuro at Tsuen Tea (Est. 1160)', 'Cormorant fishing boat views along Uji River'],
        stops: [
          {
            id: 'stop-4-1',
            title: 'Byōdō-in: The Heian Phoenix Hall',
            japaneseTitle: '平等院 鳳凰堂と阿字池',
            time: '09:00',
            duration: '90 mins',
            cost: '¥600',
            category: 'Culture & Heritage',
            neighborhood: 'Uji City',
            address: 'Renge-116 Uji, Kyoto Prefecture',
            coordinates: { lat: 34.8893, lng: 135.8077, mapX: 86, mapY: 90 },
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Represented on the Japanese 10-yen coin, the Phoenix Hall was consecrated in 1053 as an architectural manifestation of the Buddhist Pure Land Paradise. Two bronze phoenix sculptures crown the vermilion roof ridges.',
            insiderTip: 'Book the separate internal tour ticket at the counter right at 9:00 AM to see the original Amida Buddha statue carved by master Jocho.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 5100,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 8,
              description: 'Cross Uji Bridge toward Tsuen Tea House',
              distanceKm: 0.5
            }
          },
          {
            id: 'stop-4-2',
            title: 'Tsuen Tea: Japan’s Oldest Tea House (Est. 1160)',
            japaneseTitle: '通圓 宇治茶の老舗',
            time: '11:00',
            duration: '60 mins',
            cost: '¥1,500',
            category: 'Tea & Coffee Culture',
            neighborhood: 'Uji Riverbank',
            address: 'Higashiuchi-1 Uji, Kyoto Prefecture',
            coordinates: { lat: 34.8920, lng: 135.8115, mapX: 89, mapY: 88 },
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Operating continuously at the foot of Uji Bridge for over 860 years. Historic travelers, samurai lords, and novelists in the Tale of Genji have refreshed themselves with cold sencha at this exact wooden post.',
            insiderTip: 'Pair the cold-brewed Uji Gyokuro with traditional green tea dango rice dumplings dusted in roasted soybean kinako.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.8,
            reviewCount: 980
          }
        ]
      },
      {
        dayNumber: 5,
        title: 'Nishiki Morning Harvest & The Craft Revival',
        subtitle: 'Artisan knife sharpeners, heirloom tsukemono pickles, and modern craft ateliers',
        date: 'Sunday, Oct 18',
        weather: {
          temp: '19°C / 66°F',
          condition: 'Crisp morning with clear blue sky',
          icon: 'sunny'
        },
        walkingDistanceKm: 6.8,
        estimatedTransitTime: '15 mins walking and metro',
        highlights: ['Shigeharu Knives hand-forged blades', 'Fermented Kyoto pickles at Nishiki', 'Kaiseki farewell dinner at Gion Sasaki'],
        stops: [
          {
            id: 'stop-5-1',
            title: 'Nishiki Market Culinary Alleys',
            japaneseTitle: '錦市場 京の台所と伝統の味',
            time: '08:30',
            duration: '90 mins',
            cost: '¥2,500',
            category: 'Epicurean & Dining',
            neighborhood: 'Nakagyo Ward',
            address: 'Nishikikoji-dori, Nakagyo Ward, Kyoto',
            coordinates: { lat: 35.0050, lng: 135.7645, mapX: 48, mapY: 52 },
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Known for 400 years as "Kyoto’s Kitchen," this five-block covered arcade preserves the culinary soul of the city: fresh yuba sheets, pickled mibuna greens, and skewered grilled ayu sweetfish.',
            insiderTip: 'Visit before 10:00 AM before tour crowds fill the narrow aisle. Seek out Aritsugu, the knife smith founded in 1560 that once crafted swords for the Imperial Court.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.6,
            reviewCount: 7400,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 14,
              description: 'Walk west toward Horikawa-dori',
              distanceKm: 1.1
            }
          },
          {
            id: 'stop-5-2',
            title: 'Kaikado: Handcrafted Tin Tea Caddies (Est. 1875)',
            japaneseTitle: '開化堂 手造り茶筒とカフェ',
            time: '11:00',
            duration: '60 mins',
            cost: '¥18,000 (Artisan Piece)',
            category: 'Craft & Architecture',
            neighborhood: 'Shimogyo Ward',
            address: '84 Sumiyoshicho, Shimogyo Ward, Kyoto',
            coordinates: { lat: 34.9912, lng: 135.7640, mapX: 47, mapY: 72 },
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'The oldest maker of handmade tea caddies in the world. Made of brass, tin, and copper with seamless precision—when you release the lid, it glides down gently on its own air cushion to form an airtight seal.',
            insiderTip: 'Visit the adjacent Kaikado Café housed in a converted 1927 municipal tram depot for specialty filter coffee served in custom brass tableware.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 820,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 20,
              description: 'Leisurely walk east across Kamo River to Gion',
              distanceKm: 1.6
            }
          },
          {
            id: 'stop-5-3',
            title: 'Farewell Kaiseki at Gion Sasaki (Three Michelin Stars)',
            japaneseTitle: '祇園さゝ木 割烹懐石',
            time: '18:30',
            duration: '150 mins',
            cost: '¥38,000',
            category: 'Epicurean & Dining',
            neighborhood: 'Gion',
            address: '566-23-4 Gionmachi Minamigawa, Higashiyama Ward, Kyoto',
            coordinates: { lat: 35.0022, lng: 135.7761, mapX: 62, mapY: 56 },
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Chef Hiroshi Sasaki’s counter is Kyoto’s ultimate theatrical culinary temple. The 10-meter single-plank keyaki wood counter hosts 16 diners where seasonal crab, matsutake mushrooms, and chargrilled wagyu are presented with infectious exuberance.',
            insiderTip: 'Confirm your seating 6 months in advance. Dress in refined smart-casual attire; photography of chefs in action is permitted with polite courtesy.',
            bookingStatus: 'Confirmed',
            rating: 5.0,
            reviewCount: 460
          }
        ]
      }
    ]
  },
  {
    id: 'amalfi-coast-cliffside',
    title: 'Amalfi: The Vertical Terraces',
    destination: 'Amalfi Coast & Capri',
    country: 'Italy',
    subtitle: 'Sun-drenched lemon groves, cliffside monasteries, and the siren songs of the Tyrrhenian Sea.',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
    season: 'Late Spring / Early Autumn',
    recommendedDuration: '4 Days / 3 Nights',
    curator: {
      name: 'Elena D’Ambrosio',
      role: 'Mediterranean Landscape Architect & Sommelier',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    editorialPreamble: 'The Amalfi Coast is an impossible vertical kingdom chiseled into dolomite limestone. Behind the glamour of Positano lies an ancient agrarian empire where sfusato amalfitano lemons grow on stone pergolas suspended 400 meters above azure waters. This guide charts the high mule tracks, secluded sea caves, and private garden villas of Ravello.',
    vibeTags: ['Vertical Terroirs', 'Sfusato Lemons', 'Classical Villas', 'Wooden Gozzo Boats', 'Tyrrhenian Seafood'],
    mapCenter: {
      lat: 40.6340,
      lng: 14.6027,
      zoom: 13
    },
    logistics: {
      flights: [
        {
          flightNumber: 'AZ 1270',
          airline: 'ITA Airways',
          from: 'FCO (Rome Fiumicino)',
          to: 'NAP (Naples Capodichino)',
          departureTime: '10:15 AM',
          arrivalTime: '11:05 AM',
          status: 'On Schedule'
        },
        {
          flightNumber: 'Private NCC Mercedes Van',
          airline: 'Amalfi Drivers Exclusives',
          from: 'Naples Airport',
          to: 'Ravello Hotel Caruso',
          departureTime: '11:45 AM',
          arrivalTime: '01:00 PM',
          status: 'Confirmed'
        }
      ],
      accommodations: [
        {
          name: 'Belmond Hotel Caruso (Ravello)',
          type: '11th Century Palace',
          checkIn: 'May 12, 15:00',
          checkOut: 'May 15, 11:00',
          neighborhood: 'Piazza San Giovanni del Toro, Ravello',
          confirmationCode: 'BLM-9912-RVL',
          ratePerNight: '€1,250 / night',
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
        }
      ],
      passes: [
        {
          name: 'Capri & Positano Private Gozzo Charter',
          type: 'Maritime Navigation',
          validity: 'May 14 Full Day',
          details: '38-foot Fratelli Aprea classic mahogany cruiser with skipper'
        }
      ],
      budgetSummary: {
        totalEstimate: '€5,400',
        spent: '€3,850',
        breakdown: {
          stays: '€3,750',
          dining: '€850',
          experiences: '€600',
          transit: '€200'
        }
      }
    },
    days: [
      {
        dayNumber: 1,
        title: 'Positano Cascades & Sunset Aperitivo',
        subtitle: 'Pastel palazzi, bougainvillea archways, and beachside spritz',
        date: 'Tuesday, May 12',
        weather: {
          temp: '24°C / 75°F',
          condition: 'Brilliant Mediterranean sunshine',
          icon: 'sunny'
        },
        walkingDistanceKm: 4.8,
        estimatedTransitTime: '25 mins private tender',
        highlights: ['Spiaggia Grande pastel perspective', 'Le Sirenuse terrace bellini', 'Handmade leather sandals at Safari Positano'],
        stops: [
          {
            id: 'stop-amalfi-1-1',
            title: 'Positano Pastel Harbor & Chiesa Santa Maria',
            italianTitle: 'Spiaggia Grande e Cupola Maiolicata',
            time: '09:00',
            duration: '90 mins',
            cost: 'Free',
            category: 'Culture & Heritage',
            neighborhood: 'Positano Center',
            address: 'Via Marina Grande, Positano, Salerno',
            coordinates: { lat: 40.6281, lng: 14.4850, mapX: 25, mapY: 65 },
            image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'The iconic view that inspired John Steinbeck’s essay: "Positano bites deep. It is a dream place that isn’t quite real when you are there and becomes beckoningly real after you are gone."',
            insiderTip: 'Observe the yellow and green majolica tile dome of Santa Maria Assunta glistening against the morning sea mist.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 4100,
            transitToNext: {
              mode: 'walk',
              durationMinutes: 15,
              description: 'Climb the steep staircases of Via Cristoforo Colombo',
              distanceKm: 0.6
            }
          },
          {
            id: 'stop-amalfi-1-2',
            title: 'Franco’s Bar at Le Sirenuse: Sunset Bellini',
            italianTitle: 'Aperitivo Terrazza sul Mare',
            time: '18:00',
            duration: '90 mins',
            cost: '€28 / cocktail',
            category: 'Epicurean & Dining',
            neighborhood: 'Upper Positano',
            address: 'Via Cristoforo Colombo 30, Positano',
            coordinates: { lat: 40.6295, lng: 14.4870, mapX: 28, mapY: 60 },
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'An alfresco champagne terrace adorned with contemporary yellow ceramic sculptures by Giuseppe Ducrot. As the sun dips beneath the Punta Campanella peninsula, the town lights blink on like embers.',
            insiderTip: 'No reservations accepted; arrive by 17:30 to secure a front-rail marble table.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.8,
            reviewCount: 2200
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Sentiero degli Dei: The Path of the Gods',
        subtitle: 'High limestone ridge traversing Bomerano down to Nocelle',
        date: 'Wednesday, May 13',
        weather: {
          temp: '22°C / 72°F',
          condition: 'Clear skies with light sea breeze',
          icon: 'sunny'
        },
        walkingDistanceKm: 8.5,
        estimatedTransitTime: '40 mins shuttle to Bomerano trail head',
        highlights: ['Panoramic views over Capri Faraglioni', 'Shepherd cheese tasting in cliffside caves', 'Descent via 1,700 ancient stone stairs'],
        stops: [
          {
            id: 'stop-amalfi-2-1',
            title: 'The High Cliff Traverse (Sentiero degli Dei)',
            italianTitle: 'Sentiero degli Dei da Bomerano a Nocelle',
            time: '08:30',
            duration: '180 mins',
            cost: 'Free',
            category: 'Nature & Scenic',
            neighborhood: 'Agerola to Positano',
            address: 'Piazza Paolo Capasso, Bomerano di Agerola',
            coordinates: { lat: 40.6300, lng: 14.5100, mapX: 45, mapY: 45 },
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Legend holds that the gods trod this sheer ridge to save Ulysses from the songs of the Sirens off Li Galli islands. Rosemary, wild fennel, and stunted holm oaks scent the salt air.',
            insiderTip: 'Start strictly from Bomerano so that the entire walk faces downhill toward the panoramic sea view rather than climbing against the gradient.',
            bookingStatus: 'Walk-in Welcome',
            rating: 5.0,
            reviewCount: 3800
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Ravello: High Gardens & Wagner’s Melodies',
        subtitle: 'Perched 350 meters above the sea in aristocratic stillness',
        date: 'Thursday, May 14',
        weather: {
          temp: '23°C / 73°F',
          condition: 'Warm afternoon with golden Mediterranean glow',
          icon: 'sunny'
        },
        walkingDistanceKm: 3.8,
        estimatedTransitTime: '20 mins mountain shuttle',
        highlights: ['Villa Cimbrone Infinity Terrace', 'Villa Rufolo Moorish cloister', 'Lemon granita at Piazza Vescovado'],
        stops: [
          {
            id: 'stop-amalfi-3-1',
            title: 'Villa Cimbrone & The Infinity Terrace (Terrazza dell’Infinito)',
            italianTitle: 'Terrazza dell’Infinito e Giardini Storici',
            time: '09:30',
            duration: '90 mins',
            cost: '€10',
            category: 'Sanctuary & Stay',
            neighborhood: 'Ravello Promontory',
            address: 'Via Santa Chiara 26, Ravello, Salerno',
            coordinates: { lat: 40.6475, lng: 14.6110, mapX: 78, mapY: 35 },
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Lined with classical 18th-century marble busts staring endlessly into the horizon where the sky and the Mediterranean fuse into a single unbroken sheet of sapphire blue.',
            insiderTip: 'Walk through the Rose Garden and the Cloister before the midday sun peaks.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 3400
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Gozzo Sea Voyage to Capri & Faraglioni',
        subtitle: 'Navigating cobalt sea caves and secluded coves',
        date: 'Friday, May 15',
        weather: {
          temp: '25°C / 77°F',
          condition: 'Calm waters and pristine sky',
          icon: 'sunny'
        },
        walkingDistanceKm: 2.2,
        estimatedTransitTime: 'Full day wooden boat charter',
        highlights: ['Swimming inside Green Grotto emerald water', 'Sailing between Faraglioni rock arches', 'Seafood lunch at La Fontelina beach club'],
        stops: [
          {
            id: 'stop-amalfi-4-1',
            title: 'Faraglioni Rocks & Private Sea Arch Transit',
            italianTitle: 'I Faraglioni di Capri dal Mare',
            time: '11:00',
            duration: '120 mins',
            cost: '€180 (Boat Share)',
            category: 'Nature & Scenic',
            neighborhood: 'Capri South Coast',
            address: 'Faraglioni di Mezzo, Capri, Napoli',
            coordinates: { lat: 40.5420, lng: 14.2510, mapX: 10, mapY: 90 },
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Three limestone sea stacks jutting 100 meters out of the sea. Navigating the natural stone archway of the Faraglione di Mezzo in a wooden mahogany boat is a rite of passage.',
            insiderTip: 'Legend dictates couples must kiss under the archway for lifelong romance.',
            bookingStatus: 'Confirmed',
            rating: 5.0,
            reviewCount: 4900
          }
        ]
      }
    ]
  },
  {
    id: 'reykjavik-south-coast',
    title: 'Iceland: The Volcanic Silence',
    destination: 'Reykjavík & The South Coast',
    country: 'Iceland',
    subtitle: 'Black basalt monoliths, calving glacial lagoons, and geothermal steam sanctuaries.',
    heroImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80',
    season: 'Autumn / Northern Lights Window',
    recommendedDuration: '4 Days / 3 Nights',
    curator: {
      name: 'Magnús Sigurðsson',
      role: 'Glaciologist & Arctic Wilderness Guide',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    editorialPreamble: 'Iceland in late autumn is a world carved from primordial elements—where steam roars from fissures in the moss and Atlantic breakers crash against obsidian sands. We follow the Ring Road eastward, trading urban Nordic bakeries for glacial silence and geothermal lagoons fed by mineral waters heated miles beneath the Earth’s mantle.',
    vibeTags: ['Glacial Calving', 'Obsidian Sands', 'New Nordic Gastronomy', 'Geothermal Baths', 'Aurora Borealis'],
    mapCenter: {
      lat: 64.1466,
      lng: -21.9426,
      zoom: 12
    },
    logistics: {
      flights: [
        {
          flightNumber: 'FI 0451',
          airline: 'Icelandair',
          from: 'LHR (London Heathrow)',
          to: 'KEF (Keflavík International)',
          departureTime: '13:00',
          arrivalTime: '16:15',
          status: 'On Schedule'
        }
      ],
      accommodations: [
        {
          name: 'The Retreat at Blue Lagoon',
          type: 'Geothermal Mineral Sanctuary',
          checkIn: 'Nov 02, 15:00',
          checkOut: 'Nov 04, 11:00',
          neighborhood: 'Grindavík Lava Field',
          confirmationCode: 'RT-8841-KEF',
          ratePerNight: 'ISK 185,000 / night',
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
        }
      ],
      passes: [
        {
          name: '4x4 Land Cruiser Expedition Vehicle',
          type: 'Arctic Offroad Rental',
          validity: 'Nov 02 - Nov 06',
          details: 'Equipped with studded winter tires, GPS locator, and emergency beacon'
        }
      ],
      budgetSummary: {
        totalEstimate: 'ISK 720,000',
        spent: 'ISK 540,000',
        breakdown: {
          stays: 'ISK 370,000',
          dining: 'ISK 120,000',
          experiences: 'ISK 160,000',
          transit: 'ISK 70,000'
        }
      }
    },
    days: [
      {
        dayNumber: 1,
        title: 'Old Harbour Reykjavík & New Nordic Savor',
        subtitle: 'Corrugated iron streets, cardamom buns, and Harpa glass geometry',
        date: 'Monday, Nov 02',
        weather: {
          temp: '2°C / 36°F',
          condition: 'Brisk Arctic clarity with dusk aurora chance',
          icon: 'crisp'
        },
        walkingDistanceKm: 5.6,
        estimatedTransitTime: 'Walking throughout Old Town',
        highlights: ['Harpa Concert Hall basalt glass honeycombs', 'Cardamom braids at Brauð & Co.', 'New Nordic seafood dinner at Dill'],
        stops: [
          {
            id: 'stop-iceland-1-1',
            title: 'Harpa Concert Hall & Basalt Glass Facade',
            time: '10:00',
            duration: '60 mins',
            cost: 'Free',
            category: 'Craft & Architecture',
            neighborhood: 'Old Harbour',
            address: 'Austurbakki 2, 101 Reykjavík',
            coordinates: { lat: 64.1504, lng: -21.9328, mapX: 42, mapY: 35 },
            image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Designed by Henning Larsen and Icelandic-Danish artist Ólafur Elíasson, Harpa’s southern facade is composed of crystalline twelve-sided basalt glass bricks that scatter northern light into kaleidoscopic facets.',
            insiderTip: 'Stand in the upper foyer when the low winter sun aligns at noon to see multicolored reflections dance across the concrete floors.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.8,
            reviewCount: 3100
          },
          {
            id: 'stop-iceland-1-2',
            title: 'Sky Lagoon: The 7-Step Geothermal Ritual',
            time: '16:00',
            duration: '150 mins',
            cost: 'ISK 14,900',
            category: 'Sanctuary & Stay',
            neighborhood: 'Kársnes Harbour, Kópavogur',
            address: 'Vesturvör 44, 200 Kópavogur',
            coordinates: { lat: 64.1165, lng: -21.9460, mapX: 40, mapY: 70 },
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'An infinity thermal lagoon carved into turf wall and volcanic rock overlooking the churning North Atlantic. The 7-step ritual moves through thermal soaking, cold plunge, panoramic sauna, body scrub, and steam.',
            insiderTip: 'Book the Pure Pass timed for 16:30 so you experience sunset transitioning into deep twilight while floating with a glass of Icelandic cider.',
            bookingStatus: 'Confirmed',
            rating: 4.9,
            reviewCount: 4200
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Reynisfjara Obsidian Sands & Basalt Columns',
        subtitle: 'The dark gothic cathedral of the South Atlantic coastline',
        date: 'Tuesday, Nov 03',
        weather: {
          temp: '0°C / 32°F',
          condition: 'Dramatic coastal clouds and wild ocean rollers',
          icon: 'crisp'
        },
        walkingDistanceKm: 4.2,
        estimatedTransitTime: '2 hrs 15 mins scenic coastal drive',
        highlights: ['Hálanefshellir basalt organ-pipe cave', 'Reynisdrangar sea stacks in the breakers', 'Black sand dunes of Vík í Mýrdal'],
        stops: [
          {
            id: 'stop-iceland-2-1',
            title: 'Reynisfjara Black Beach & Basalt Columns',
            time: '11:00',
            duration: '90 mins',
            cost: 'Free',
            category: 'Nature & Scenic',
            neighborhood: 'Vík í Mýrdal',
            address: 'Route 215, 871 Vík',
            coordinates: { lat: 63.4042, lng: -19.0494, mapX: 85, mapY: 82 },
            image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
            editorialNotes: 'Hexagonal basalt columns formed by slowly cooling lava rise like cathedral pipes out of jet-black volcanic pebbles. The Atlantic swell thunders against the Reynisdrangar needles.',
            insiderTip: 'Never turn your back on the ocean; sneaker waves are notoriously hazardous. Stay well back from the wet sand demarcation line.',
            bookingStatus: 'Walk-in Welcome',
            rating: 4.9,
            reviewCount: 6500
          }
        ]
      }
    ]
  }
];
