import { Howl } from 'howler';

export const notificationSound = new Howl({
  src: ['src/assets/sounds/notification.mp3'],
  html5: true,
  volume: 0.5
});