"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { useDebounce } from "@/hooks/use-debounce"

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      console.log("Fetching products...")
      try {
        const params = new URLSearchParams({
          page: "1",
          page_size: "20",
          sort_desc: "true",
          ...(debouncedSearch && { search: debouncedSearch }),
        })

        // const url = `https://central-marketplace-backend.onrender.com/products/?${params}`
        // console.log("Fetching from URL:", url)

        // const response = await fetch(url)
        // console.log("Response status:", response.status)

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`)
        // }

        // const data = await response.json()
      const  data = {
            "data": {
              "page": 1,
              "page_size": 20,
              "total": 552,
              "items": [
                {
                  "channel_id": "1320403852",
                  "message_id": 11612,
                  "forwards": 2,
                  "views": 1451,
                  "id": "6783aa112f531bf8d7cbc739",
                  "name": null,
                  "description": "100% Cotton Men's Casual T-shirt\nQuality 👌\n2500 Br\nSize M,L, XL, XXL 3XL 4XL\n\n⊰━━━━━━━⊱⊰━━━━━━━⊰\nMaraki Brand™ ┃ማራኪ ብራንድ™ \n⊰━━━━━━━⊱⊰━━━━━━━⊱",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:07:59.024667",
                  "updated_at": "2025-02-02T19:07:59.024667",
                  "posted_at": "2025-01-03T08:17:04+00:00",
                  "reactions": []
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1856,
                  "forwards": 6,
                  "views": 2365,
                  "id": "6783aa132f531bf8d7cbc73a",
                  "name": null,
                  "description": "🔥Sale🔥\nSAMSUNG Galaxy S21 Ultra 5G Single Sim 256GB 12GB RAM \n✅Color -Phantom Silver\nPrice 52,000 birr \n\nhttps://t.me/GTechMobile\nአድራሻችን: ቦሌ መድሃኒያለም እንደደረሱ ሄልዘር ህንፃ  (Or Around Edna Mall Helzer Bulding )\nCall 0944281119\n📍https://g.co/kgs/KqPR5j",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:01.295080",
                  "updated_at": "2025-02-02T19:08:01.295080",
                  "posted_at": "2024-12-21T14:56:29+00:00",
                  "reactions": [
                    [
                      "👍",
                      1],
                    [
                      "❤",
                      1]
                  ]
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1855,
                  "forwards": 3,
                  "views": 4229,
                  "id": "6783aa132f531bf8d7cbc73b",
                  "name": null,
                  "description": "🔥Sale🔥\n✔️IPhone 14 Pro Max 256GB Single Sim\n#Color Purple \nBattery 84%\n\nአድራሻችን: ቦሌ መድሃኒያለም እንደደረሱ ሄልዘር ህንፃ  (Or Around Edna Mall Helzer Bulding)\nCall 0944281119\n📍https://g.co/kgs/KqPR5j",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:01.554762",
                  "updated_at": "2025-02-02T19:08:01.554762",
                  "posted_at": "2024-12-11T15:09:07+00:00",
                  "reactions": [
                    [
                      "👍",
                      9]
                  ]
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1854,
                  "forwards": 3,
                  "views": 3507,
                  "id": "6783aa132f531bf8d7cbc73c",
                  "name": null,
                  "description": "🔥Sale🔥\n🔴Galaxy S23 Ultra 5G Dual Sim 256GB 12GB RAM \nPrice 85,000\n\nአድራሻችን: ቦሌ መድሃኒያለም እንደደረሱ ሄልዘር ህንፃ  (Or Around Edna Mall Helzer Bulding )\nCall 0944281119\nhttps://g.co/kgs/KqPR5j",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:01.815079",
                  "updated_at": "2025-02-02T19:08:01.815079",
                  "posted_at": "2024-12-11T15:06:14+00:00",
                  "reactions": [
                    [
                      "👍",
                      4]
                  ]
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1853,
                  "forwards": 2,
                  "views": 4533,
                  "id": "6783aa142f531bf8d7cbc73d",
                  "name": null,
                  "description": "🔥🔥🔥🔥🔥\nhttps://t.me/GTechMobile\n✅👆👆👆👆👆👆\nከ Channel ላይ ባሉበት ሆነው የተመኙት ስልክ መርጠው ይግዙ ወይም  ሰው ቢልኩ ያዘዙትን ስልክ orginal ለላኩት ሰው እናስረክብሎታለን ። \n\nምን ግዜም ቴሌግራማችን ላይ የPromotion ቅናሽ ስለምናደርግ  ከተለመደው የሱቆች ከሱቃችን ዎጋ Discount አለው። \n\nለወዳጅ ዘመዶ channel link በመላክ  የዋጋ ቅናሽ ተጠቃሚ ያደርጓቸው ።",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:02.054866",
                  "updated_at": "2025-02-02T19:08:02.054866",
                  "posted_at": "2024-12-05T11:39:21+00:00",
                  "reactions": [
                    [
                      "👍",
                      1]
                  ]
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1852,
                  "forwards": 10,
                  "views": 5286,
                  "id": "6783aa142f531bf8d7cbc73e",
                  "name": null,
                  "description": "📣🔥New Tablet Model🔥\n✅Samsung Galaxy Tab A9+ 5G  10.1 Inch\n🔴Storage 128GB + 8GB \n🔴SIM Supported \nPrice 35,000 \n\n✅Samsung Galaxy Tab A9+ 5G  10.1 Inch\n🔴Storage 64GB + 4GB \n🔴SIM Supported \nPrice 31,000 \n\n✅Samsung Galaxy Tab A9 8.7 Inch \n🔴Storage 64GB + 4GB\n🔴SIM Supported \nPrice 18,500 \n\nhttps://t.me/GTechMobile \nአድራሻችን: ቦሌ መድሃኒያለም እንደደረሱ ሄልዘር ህንፃ  (Or Around Edna Mall Helzer Bulding Ground Floor)\nCall 0944281119\n📍https://g.co/kgs/KqPR5j",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:02.452230",
                  "updated_at": "2025-02-02T19:08:02.452230",
                  "posted_at": "2024-11-28T13:29:13+00:00",
                  "reactions": [
                    [
                      "❤",
                      4],
                    [
                      "👍",
                      3]
                  ]
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1849,
                  "forwards": 6,
                  "views": 5636,
                  "id": "6783aa142f531bf8d7cbc73f",
                  "name": null,
                  "description": "🔠🔠🔠🔠\n🔴Apple iPhone 16 Pro Max Dual/Single Sim 256/512GB\n\n🔴Apple iPhone 15 Pro Max Dual/Single Sim 256/512GB\n\n🔴Galaxy S24 Ultra 5G Dual Sim 512GB/256GB 12GB RAM \n\nPrice Ask \n\nአድራሻችን: ቦሌ መድሃኒያለም እንደደረሱ ሄልዘር ህንፃ  (Or Around Edna Mall Helzer Bulding Ground Floor)\nCall 0944281119\nhttps://g.co/kgs/KqPR5j",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:02.699773",
                  "updated_at": "2025-02-02T19:08:02.699773",
                  "posted_at": "2024-11-22T07:01:10+00:00",
                  "reactions": [
                    [
                      "👍",
                      7],
                    [
                      "❤",
                      5]
                  ]
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1848,
                  "forwards": 50,
                  "views": 5617,
                  "id": "6783aa142f531bf8d7cbc740",
                  "name": null,
                  "description": "🔠🔤🔠🔠🔠🔠🔠 \n✅Updated Price on 19/11/24\n✅ሳምሰንግ ስልኮች A & M Series ✅ \n\nM05 64GB with 4RAM ---------15000birr\nm14 64GB with 4RAM-----------16000birr\nM15 5G 128GB with 4RAM-- 22,500birr\nM15 5G 128GB with 6RAM--- 23500birr\nA05s 128GB with 4RAM--------19,000birr\nA05s 128GB with 6RAM------- 20,000birr\nA15 128GB with 4RAM-------- 21,500birr\nA15 128GB with 6RAM-------- 23,000birr\nA15 5G128GB with 6RAM-----24,000birr\nA15 5G 256GB with 8RAM----28,000birr\nA25 5G 128GB with 6RAM ----28,000birr\nA25 5G 256GB with 8RAM-----30,500birr\nA35 5G 128GB with 8RAM----35,000birr\nA35 256GB with 8RAM----------40,000birr\nA54 256GB with 8RAM --------42,000birr\nA55 256GB with 8RAM-------- 48,000birr\nA55 256GB with12RAM--------52,000birr \n\nአድራሻችን: ቦሌ መድሃኒያለም እንደደረሱ ሄልዘር ህንፃ  (Or Around Edna Mall Helzer Bulding)\nCall 0944281119\nhttps://g.co/kgs/KqPR5j",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:02.935225",
                  "updated_at": "2025-02-02T19:08:02.935225",
                  "posted_at": "2024-11-19T08:34:55+00:00",
                  "reactions": [
                    [
                      "👍",
                      15],
                    [
                      "❤",
                      3]
                  ]
                },
                {
                  "channel_id": "1293830821",
                  "message_id": 1847,
                  "forwards": 4,
                  "views": 5734,
                  "id": "6783aa142f531bf8d7cbc741",
                  "name": null,
                  "description": "🔥Sale🔥\n✅Apple iPhone 15 Pro Max 512Gb\n- Color Natural Titanium \n-Battery 92%\nPrice Ask \n\nአድራሻችን: ቦሌ መድሃኒያለም እንደደረሱ ሄልዘር ህንፃ  (Or Around Edna Mall Helzer Bulding Ground Floor)\nCall 0944281119\nhttps://g.co/kgs/KqPR5j",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:03.170907",
                  "updated_at": "2025-02-02T19:08:03.170907",
                  "posted_at": "2024-11-15T13:53:01+00:00",
                  "reactions": [
                    [
                      "👍",
                      1]
                  ]
                },
                {
                  "channel_id": "1212390607",
                  "message_id": 4034,
                  "forwards": 1,
                  "views": 867,
                  "id": "6783aa152f531bf8d7cbc742",
                  "name": null,
                  "description": "Samsung galaxy f 13\nGb 64\nRam 4\nPrice 💰12.000 brrr\nOther phone exchange ✅\nCall me 👇\n☎️ 0909255008\n☎️ 0912739699\n@abd_phone",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:03.449061",
                  "updated_at": "2025-02-02T19:08:03.449061",
                  "posted_at": "2025-01-04T06:58:04+00:00",
                  "reactions": []
                },
                {
                  "channel_id": "1212390607",
                  "message_id": 4026,
                  "forwards": 2,
                  "views": 1751,
                  "id": "6783aa152f531bf8d7cbc743",
                  "name": null,
                  "description": "Z T E blade  A 51\nGb 32\nRam 2\nPrice 6.500 brrr\nCall  me 👇\n☎️ 0909255008\n☎️ 0912739699\n@abd_phone",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:03.685199",
                  "updated_at": "2025-02-02T19:08:03.685199",
                  "posted_at": "2025-01-03T18:11:02+00:00",
                  "reactions": []
                },
                {
                  "channel_id": "1212390607",
                  "message_id": 4021,
                  "forwards": 2,
                  "views": 2274,
                  "id": "6783aa152f531bf8d7cbc744",
                  "name": null,
                  "description": "Samsung galaxy A 10 s\nGb 32\nRam 2\nPrice 💰7.500 brrr\n☎️ 0909255008\n☎️ 0912739699\n@abd_phone",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:04.031557",
                  "updated_at": "2025-02-02T19:08:04.031557",
                  "posted_at": "2025-01-03T06:59:15+00:00",
                  "reactions": []
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57938,
                  "forwards": 13,
                  "views": 4322,
                  "id": "6783aa152f531bf8d7cbc745",
                  "name": null,
                  "description": "🔷🔴📲 IPhone15 pro max ( 256gb)\n\n🔰 Excellent  Condition almost new battery\n\n🔋 100%\n\n💵💸:-price 135,000 birr\n\n 🔴Color : blue  \n\n📼  storage : 256gb\n \n☎️  +251910434031  ☎️ 0960222205\n📩 @Henokestezia12\n\n@henokestezia\n\nhttps://instagram.com/mobilehenok?igshid=YmMyMTA2M2Y=",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:04.300195",
                  "updated_at": "2025-02-02T19:08:04.300195",
                  "posted_at": "2024-11-19T14:40:41+00:00",
                  "reactions": [
                    [
                      "👍",
                      7],
                    [
                      "❤",
                      6],
                    [
                      "🤩",
                      1]
                  ]
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57936,
                  "forwards": 5,
                  "views": 5065,
                  "id": "6783aa152f531bf8d7cbc746",
                  "name": null,
                  "description": "🔷🔴📲 IPhone16 pro max 256gb\n\n🔰 Excellent  Condition new battery\n\n🔋 100%\n\n💵💸:-price 195,000 birr\n\n 🔴Color : Dessert gold  \n\n📼  storage : 256gb\n \n☎️  +251910434031  ☎️ 0960222205\n📩 @Henokestezia12\n\n@henokestezia\n\nhttps://instagram.com/mobilehenok?igshid=YmMyMTA2M2Y=",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:04.645068",
                  "updated_at": "2025-02-02T19:08:04.645068",
                  "posted_at": "2024-11-14T11:07:27+00:00",
                  "reactions": [
                    [
                      "👍",
                      6],
                    [
                      "❤",
                      6],
                    [
                      "🍾",
                      1]
                  ]
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57935,
                  "forwards": 4,
                  "views": 4762,
                  "id": "6783aa152f531bf8d7cbc747",
                  "name": null,
                  "description": "🔷🔴📲 IPhone16 ( 128gb)\n\n🔰 Excellent  Condition  new battery\n\n🔋 100%\n\n💵💸:-price 119,000birr\n\n 🔴Color : blue \n\n📼  storage : 128gb\n \n☎️  +251910434031  ☎️ 0960222205\n📩 @Henokestezia12\n\n@henokestezia\n\nhttps://instagram.com/mobilehenok?igshid=YmMyMTA2M2Y=",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:04.955636",
                  "updated_at": "2025-02-02T19:08:04.955636",
                  "posted_at": "2024-11-14T11:06:01+00:00",
                  "reactions": [
                    [
                      "👍",
                      5],
                    [
                      "❤",
                      3]
                  ]
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57934,
                  "forwards": 14,
                  "views": 8482,
                  "id": "6783aa162f531bf8d7cbc748",
                  "name": null,
                  "description": "🔷🔴📲 IPhone15 pro ( 128gb)\n\n🔰 Excellent  Condition almost new battery\n\n🔋 100%\n\n💵💸:-price 105,000 birr\n\n 🔴Color : black  \n\n📼  storage : 128gb\n \n☎️  +251910434031  ☎️ 0960222205\n📩 @Henokestezia12\n\n@henokestezia\n\nhttps://instagram.com/mobilehenok?igshid=YmMyMTA2M2Y=",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:05.378057",
                  "updated_at": "2025-02-02T19:08:05.378057",
                  "posted_at": "2024-10-04T10:43:29+00:00",
                  "reactions": [
                    [
                      "👍",
                      14],
                    [
                      "❤",
                      5],
                    [
                      "🥰",
                      2]
                  ]
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57933,
                  "forwards": 11,
                  "views": 8663,
                  "id": "6783aa162f531bf8d7cbc749",
                  "name": null,
                  "description": "🔷🔴📲 IPhone14ProMax( 256gb)\n\n🔰 Excellent  Condition almost new battery\n\n🔋 100%\n\n💵💸:-price 105,000 birr\n\n 🔴Color : deep purple \n\n📼  storage : 256gb\n \n☎️  +251910434031  ☎️ 0960222205\n📩 @Henokestezia12\n\n@henokestezia\n\nhttps://instagram.com/mobilehenok?igshid=YmMyMTA2M2Y=",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:05.815146",
                  "updated_at": "2025-02-02T19:08:05.815146",
                  "posted_at": "2024-09-26T11:56:39+00:00",
                  "reactions": [
                    [
                      "❤",
                      9],
                    [
                      "👍",
                      6]
                  ]
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57932,
                  "forwards": 6,
                  "views": 8704,
                  "id": "6783aa162f531bf8d7cbc74a",
                  "name": null,
                  "description": "iPhone 16 Promax\niPhone 16 Pro\niPhone 16 Plus\niPhone 16 \nAvailable Now!",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:06.065492",
                  "updated_at": "2025-02-02T19:08:06.065492",
                  "posted_at": "2024-09-21T09:42:05+00:00",
                  "reactions": [
                    [
                      "👍",
                      13],
                    [
                      "❤",
                      6],
                    [
                      "👀",
                      2],
                    [
                      "🥰",
                      1]
                  ]
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57930,
                  "forwards": 36,
                  "views": 15586,
                  "id": "6783aa162f531bf8d7cbc74b",
                  "name": null,
                  "description": "🔷🔴📲 IPhone 15 pro (128gb)\n\n🔰 Excellent  Condition almost new battery\n\n🔋 99%\n\n💵💸:-price 107,000birr\n\n 🔴Color : natural titanium \n\n📼  storage : 128gb\n \n☎️  +251910434031  ☎️ 0960222205\n📩 @Henokestezia12\n\n@henokestezia\n\nhttps://instagram.com/mobilehenok?igshid=YmMyMTA2M2Y=",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:06.312307",
                  "updated_at": "2025-02-02T19:08:06.312307",
                  "posted_at": "2024-07-03T19:30:50+00:00",
                  "reactions": [
                    [
                      "👍",
                      15],
                    [
                      "❤",
                      7]
                  ]
                },
                {
                  "channel_id": "1162278701",
                  "message_id": 57929,
                  "forwards": 40,
                  "views": 13651,
                  "id": "6783aa162f531bf8d7cbc74c",
                  "name": null,
                  "description": "🔷🔴📲 IPhone 15 (128gb)\n\n🔰 Excellent  Condition almost new battery\n\n🔋 99%\n\n💵💸:-price 78,000 birr\n\n 🔴Color : pink \n\n📼  storage : 128gb\n \n☎️  +251910434031  ☎️ 0960222205\n📩 @Henokestezia12\n\n@henokestezia\n\nhttps://instagram.com/mobilehenok?igshid=YmMyMTA2M2Y=",
                  "summary": null,
                  "price": null,
                  "categories": [],
                  "is_available": true,
                  "images": [],
                  "created_at": "2025-02-02T19:08:06.705496",
                  "updated_at": "2025-02-02T19:08:06.705496",
                  "posted_at": "2024-07-03T19:08:59+00:00",
                  "reactions": [
                    [
                      "👍",
                      12],
                    [
                      "❤",
                      5],
                    [
                      "🔥",
                      1]
                  ]
                }
              ]
            }
          }
        console.log("Received data:", data)

        if (!data || !data.data || !Array.isArray(data.data.items)) {
          throw new Error("Invalid data structure received from API")
        }

        setProducts(data.data.items)
        console.log("Products set:", data.data.items)
      } catch (error) {
        console.error("Caught error:", error)
        console.error("Error details:", JSON.stringify(error, null, 2))
        setProducts([])
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [debouncedSearch])

  return (
    <main className="container py-6 space-y-6 mx-auto">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">Search and find anything</h1>
        <Input
          type="search"
          placeholder="Type to search..."
          className="max-w-xl mx-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="text-center">Loading products...</p>}

      {error && <p className="text-center text-red-500">Error: {error}. Please try again later.</p>}

      {!loading && !error && products.length === 0 && <p className="text-center">No products found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}

