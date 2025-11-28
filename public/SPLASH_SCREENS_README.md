# iOS Splash Screens

Для полноценной работы PWA на iOS устройствах необходимы splash screen изображения для всех размеров экранов.

## Как сгенерировать splash screens:

1. Откройте файл `public/generate-splash.html` в браузере
2. Нажмите кнопку "Download All Splash Screens"
3. Сохраните все изображения в папку `public/`

## Список необходимых файлов:

### iPhone
- `splash-iphone-14-pro-max.png` (1290×2796)
- `splash-iphone-14-pro.png` (1179×2556)
- `splash-iphone-13-pro-max.png` (1284×2778)
- `splash-iphone-13-pro.png` (1170×2532)
- `splash-iphone-11-pro-max.png` (1242×2688)
- `splash-iphone-x.png` (1125×2436)
- `splash-iphone-xr.png` (828×1792)
- `splash-iphone-8-plus.png` (1242×2208)
- `splash-iphone-8.png` (750×1334)
- `splash-iphone-se.png` (640×1136)

### iPad
- `splash-ipad-pro-12.9.png` (2048×2732)
- `splash-ipad-pro-11.png` (1668×2388)
- `splash-ipad-air.png` (1640×2360)
- `splash-ipad-10.2.png` (1620×2160)
- `splash-ipad-mini.png` (1536×2048)

## Альтернатива:

Используйте онлайн-генератор:
- https://www.pwabuilder.com/imageGenerator
- Загрузите иконку 512x512 и сгенерируйте все splash screens автоматически

## Текущий статус:

Сейчас используется:
- Компонент SplashScreen.tsx для показа экрана загрузки в браузере
- Заглушки для iOS splash screens (нужно заменить на реальные изображения)
- SVG splash-default.svg как fallback

Для финальной версии рекомендуется сгенерировать все изображения через generate-splash.html
