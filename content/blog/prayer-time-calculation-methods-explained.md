---
title: "Why prayer apps show different times: calculation methods explained"
description: "Why two prayer apps disagree on Fajr, Asr and Isha: sun angles, the Hanafi Asr setting, high latitude rules, and how to match your local mosque."
date: "2026-10-11"
category: "Guides"
appName: "Real Islam, Prayer Times Quran"
appHref: "/apps/android/real-islam-prayer-times-quran/"
---

Open two prayer apps side by side and you'll often see two different Fajr times. Sometimes the gap is two minutes. Sometimes it's twenty. Asr can be off by more than an hour. People reasonably ask: which one is wrong?

Usually neither. Both apps are doing correct math. They're just using different definitions, and those definitions come from different scholarly bodies and schools of fiqh. Once you know which settings cause the gap, you can make your app match your mosque in a couple of minutes.

I'm a developer, not a scholar, so I'll stick to how the calculation works. For which opinion to follow, please ask your local imam or the scholars you trust.

## Prayer times come from the position of the sun

Every prayer time is tied to where the sun is in the sky at your location. That's why your exact location matters so much, and why times shift a little every day.

The easy ones first:

- **Dhuhr** starts after solar noon, the moment the sun crosses its highest point. Many timetables add a few minutes after that moment as a safety margin, so the sun has clearly passed the meridian.
- **Maghrib** is at sunset. Some timetables add a minute or two as a precaution too.

These two rarely cause big disagreements. The differences come from Fajr, Isha and Asr.

## Fajr and Isha depend on a sun angle

Fajr begins at true dawn, when light first spreads across the horizon. Isha begins when the evening twilight has gone. Neither moment has a sharp edge you can see from a calculation, so astronomers and scholars agreed on an angle: how far below the horizon the sun is when that light appears or disappears.

The problem is that different organizations chose different angles. A bigger angle means the sun is further below the horizon, which means an earlier Fajr and a later Isha.

These are the most common methods you'll see in prayer apps:

| Method | Fajr angle | Isha |
| - | - | - |
| Muslim World League | 18° | 17° |
| ISNA (North America) | 15° | 15° |
| Egyptian General Authority of Survey | 19.5° | 17.5° |
| University of Islamic Sciences, Karachi | 18° | 18° |
| Umm al-Qura (Makkah) | 18.5° | 90 minutes after Maghrib (120 in Ramadan) |

Look at the gap between ISNA's 15° and Egypt's 19.5°. That's 4.5 degrees, and depending on where you live and the time of year, it can move Fajr by 20 or 30 minutes. That's the most common reason two apps disagree.

Umm al-Qura is different from the others because Isha is a fixed time after Maghrib instead of an angle. It's the official method in Saudi Arabia.

In Pakistan, India and Bangladesh, the Karachi method is very common. In North America, many mosques use ISNA, though not all. In Europe you'll see a mix, often Muslim World League. But these are general patterns. Your local mosque may use something else, or its own published timetable.

## The Asr setting: standard or Hanafi

Asr has a completely separate setting, and it's the one that causes the biggest gaps.

Asr is defined by the length of shadows. At solar noon, an object casts its shortest shadow (the "noon shadow"). As the afternoon goes on, the shadow grows.

- In the **standard** method, followed by the Shafi'i, Maliki and Hanbali schools, Asr starts when an object's shadow equals its own length plus the noon shadow.
- In the **Hanafi** method, Asr starts when the shadow equals twice the object's length plus the noon shadow.

Since the shadow has to grow much longer, Hanafi Asr is always later. In winter the difference can be well over an hour in some places.

So if your app shows Asr at 3:15 and your mosque's timetable says 4:20, the first thing to check is this setting. Most of South Asia and Turkey follow the Hanafi opinion, so a phone set to the standard Asr will show times that look badly wrong to someone in Lahore or Istanbul. They aren't wrong, they just follow a different school.

## High latitudes: when the sun doesn't go low enough

This part surprises people who move to the UK, Canada or Scandinavia.

In summer, at high latitudes, the sun doesn't go far below the horizon at night. In London, for some weeks around midsummer, the sun never reaches 18° below the horizon at all. Further north, in places like Oslo or Stockholm, it may not even reach 12°. So if your method says "Fajr is when the sun is 18° below the horizon", there's simply no such moment. The calculation breaks, and a naive app either shows nothing or shows something strange.

Apps handle this with a high latitude rule. The common ones are:

1. **Middle of the night.** The night (sunset to sunrise) is split in half. Isha can't be later than the middle, and Fajr can't be earlier than it.
2. **One-seventh of the night.** The night is divided into seven parts. Isha is set at the end of the first seventh, and Fajr at the start of the last seventh.
3. **Angle-based.** The night is split into portions based on the angle itself. For an 18° angle, the portion is 18/60 of the night, so Isha comes after that fraction of the night has passed, and Fajr comes that fraction before sunrise.

Each of these gives different times, and some communities in Europe follow a fixed timetable from a local council or mosque instead of any formula. If you live far north, this setting matters as much as the main method. Ask your mosque which one they use.

## How to make your app match your mosque

Here's what I'd do, in this order:

1. **Set your location accurately.** Use your actual city, or GPS. Being 100 km off can shift times by several minutes. If you travel, update it.
2. **Pick the method your local mosque uses.** If you don't know, ask, or look at their printed timetable and compare it with each method until one lines up.
3. **Check the Asr setting.** Standard or Hanafi. This alone fixes most "my app is an hour off" complaints.
4. **Check the high latitude rule** if you live in northern Europe, Canada or similar.
5. **Use manual minute adjustments** for the final small gap. Many mosques add a few minutes of precaution to certain prayers, so even with the right method you might be two or three minutes off. Most apps let you nudge each prayer by a few minutes. Do that, and your phone will match the mosque wall.

When you're done, compare a week of times with the mosque timetable. If they match every day, you're set.

One more honest point: a phone app is a calculation, and your mosque's timetable may include local decisions that no app knows about. When they disagree, I follow the mosque.

## About the Real Islam app

I maintain an app called [Real Islam, Prayer Times Quran](/apps/android/real-islam-prayer-times-quran/). It gives prayer times based on your location, or you can set the location manually if you'd rather not share GPS or want times for another city. It sends a notification at each prayer time with an Adhan voice, and you can turn the Adhan off if you prefer a quiet notification, say at work or late at night. It also includes the Quran, and it doesn't collect user data.

Whatever app you use, the steps above apply. Get the location right, match your mosque's method and Asr setting, and then trust your local scholars over any screen, mine included.

If you're curious why I prefer apps that keep data on the phone, I wrote about that in [why I build local-first apps](/blog/why-i-build-local-first-apps/).
