import { WorkSchedule } from '@/types';

export const isCurrentlyActive = (workSchedule?: WorkSchedule): boolean => {
  if (!workSchedule) return true;
  
  if (workSchedule.type === 'inactive') {
    return false;
  }
  
  if (workSchedule.type === '24/7') {
    return true;
  }
  
  if (workSchedule.type === 'custom' && workSchedule.customHours) {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const dayMap: { [key: number]: string } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    const dayKey = dayMap[currentDay];
    const daySchedule = workSchedule.customHours[dayKey];
    
    if (!daySchedule || !daySchedule.enabled) {
      return false;
    }
    
    const [startHour, startMin] = daySchedule.start.split(':').map(Number);
    const [endHour, endMin] = daySchedule.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (endTime < startTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    return currentTime >= startTime && currentTime <= endTime;
  }
  
  return true;
};

export const getNextAvailableTime = (workSchedule?: WorkSchedule): string | null => {
  if (!workSchedule || workSchedule.type === 'inactive') {
    return null;
  }
  
  if (workSchedule.type === '24/7') {
    return 'Доступен круглосуточно';
  }
  
  if (workSchedule.type === 'custom' && workSchedule.customHours) {
    const now = new Date();
    const currentDay = now.getDay();
    
    const dayMap: { [key: number]: string } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    const dayNameMap: { [key: string]: string } = {
      'monday': 'Понедельник',
      'tuesday': 'Вторник',
      'wednesday': 'Среда',
      'thursday': 'Четверг',
      'friday': 'Пятница',
      'saturday': 'Суббота',
      'sunday': 'Воскресенье'
    };
    
    for (let i = 0; i < 7; i++) {
      const checkDay = (currentDay + i) % 7;
      const dayKey = dayMap[checkDay];
      const daySchedule = workSchedule.customHours[dayKey];
      
      if (daySchedule && daySchedule.enabled) {
        if (i === 0) {
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const [startHour, startMin] = daySchedule.start.split(':').map(Number);
          const startTime = startHour * 60 + startMin;
          
          if (currentTime < startTime) {
            return `Сегодня с ${daySchedule.start}`;
          }
        }
        
        if (i === 1) {
          return `Завтра с ${daySchedule.start}`;
        }
        
        return `${dayNameMap[dayKey]} с ${daySchedule.start}`;
      }
    }
    
    return null;
  }
  
  return null;
};

export const formatWorkSchedule = (workSchedule?: WorkSchedule): string => {
  if (!workSchedule || workSchedule.type === 'inactive') {
    return 'Не работает';
  }
  
  if (workSchedule.type === '24/7') {
    return 'Круглосуточно';
  }
  
  if (workSchedule.type === 'custom' && workSchedule.customHours) {
    const enabledDays = Object.entries(workSchedule.customHours)
      .filter(([_, schedule]) => schedule.enabled)
      .map(([day, schedule]) => {
        const dayNames: { [key: string]: string } = {
          'monday': 'Пн',
          'tuesday': 'Вт',
          'wednesday': 'Ср',
          'thursday': 'Чт',
          'friday': 'Пт',
          'saturday': 'Сб',
          'sunday': 'Вс'
        };
        return `${dayNames[day]} ${schedule.start}-${schedule.end}`;
      });
    
    if (enabledDays.length === 0) {
      return 'График не настроен';
    }
    
    return enabledDays.join(', ');
  }
  
  return 'Не указан';
};
