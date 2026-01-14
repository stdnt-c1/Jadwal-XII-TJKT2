// Static Schedule Data from timeline.txt
// End times for each day (last class end time)
const dayEndTimes = {
  monday: "12:50",
  tuesday: "12:50",
  wednesday: "12:50",
  thursday: "12:50",
  friday: "13:00",
  saturday: "12:35",
  sunday: "23:59"
};

const scheduleData = {
  monday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "", end: "07:15" },
    { subject: "Upacara Bendera", teacher: "", start: "07:15", end: "07:55" },
    { subject: "Pendidikan Agama Islam", teacher: "Aminah Tajudin, S.Pd.I", start: "07:55", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "Keamanan Jaringan", teacher: "Nugraha Saputra, S.Kom", start: "10:10", end: "12:50" }
  ],
  tuesday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "", end: "07:00" },
    { subject: "Pembinaan Karakter", teacher: "", start: "07:00", end: "07:15" },
    { subject: "B. Indonesia", teacher: "M. Agus Kastiyawan, S.Pd., MPd", start: "07:15", end: "09:15" },
    { subject: "PKK", teacher: "Hj. Darnilawati, S.Kom., M.Sos", start: "09:15", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "PKK", teacher: "Hj. Darnilawati, S.Kom., M.Sos", start: "10:10", end: "12:50" }
  ],
  wednesday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "", end: "07:00" },
    { subject: "Pembinaan Karakter", teacher: "", start: "07:00", end: "07:15" },
    { subject: "Mata Pelajaran Pilihan", teacher: "", start: "07:15", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "ASJ", teacher: "Rama Saputra, S.Kom", start: "10:10", end: "12:50" }
  ],
  thursday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "", end: "07:00" },
    { subject: "Pembinaan Karakter", teacher: "", start: "07:00", end: "07:15" },
    { subject: "PKJ", teacher: "Sigit Triyanto, S.Pd", start: "07:15", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "P. Tradisional Kaltim", teacher: "Fahri Ansar Potabuga, S.Sos", start: "10:10", end: "11:30" },
    { subject: "B. Inggris", teacher: "Nuh Lenjau, M.Pd", start: "11:30", end: "12:50" }
  ],
  friday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "", end: "07:15" },
    { subject: "Pendidikan Pancasila", teacher: "Juanda, S.Pd", start: "07:15", end: "08:25" },
    { subject: "TJKN", teacher: "Abdul Haris, S.Kom", start: "08:25", end: "09:35" },
    { subject: "Istirahat", teacher: "", start: "09:35", end: "09:50" },
    { subject: "TJKN", teacher: "Abdul Haris, S.Kom", start: "09:50", end: "11:35" },
    { subject: "Pendidikan Agama non-Islam", teacher: "", start: "11:35", end: "13:00" }
  ],
  saturday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "", end: "07:15" },
    { subject: "P2J", teacher: "Sigit Triyanto, S.Pd", start: "07:15", end: "09:45" },
    { subject: "Istirahat", teacher: "", start: "09:45", end: "10:05" },
    { subject: "B. Inggris", teacher: "Nuh Lenjau, M.Pd", start: "10:05", end: "11:05" },
    { subject: "Matematika", teacher: "Misbah, S.Pd", start: "11:05", end: "12:35" }
  ],
  sunday: [
    { subject: "Libur!", teacher: "", start: "00:00", end: "23:59" }
  ]
};

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const uniforms = {
  monday: "Atasan Putih, Bawahan Abu-abu",
  tuesday: "Atasan Icon/Hitam, Bawahan Cream",
  wednesday: "Atasan Jurusan, Bawahan Hitam",
  thursday: "Atasan Batik, Bawahan Putih",
  friday: "Seragam Pramuka",
  saturday: "Atasan P5/Biru, Bawahan Hitam",
  sunday: "Libur"
};

// WITA Clock (UTC+8) variables
let witaTime = null;
let clockInterval = null;
let currentViewingDay = 0;

// Get current WITA time
function getWITATime() {
  const now = new Date();
  // Convert to WITA (UTC+8) using Intl API
  const witaOptions = { timeZone: 'Asia/Makassar' };
  const witaString = now.toLocaleString('en-US', witaOptions);
  return new Date(witaString);
}

// Format time as HH:MM:SS
function formatTime(date) {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// Format date as "Hari, DD MMMM YYYY"
function formatDate(date) {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

// Get current day index (0=Monday, 6=Sunday)
function getCurrentDayIndex() {
  const wita = getWITATime();
  const jsDay = wita.getDay(); // 0=Sunday, 6=Saturday
  // Convert to our format: 0=Monday, 6=Sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}

// Parse time string to minutes since midnight
function parseTimeToMinutes(timeStr) {
  const parts = timeStr.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Check if current time is within a schedule item
function isCurrentSchedule(classItem) {
  const wita = getWITATime();
  const currentMinutes = wita.getHours() * 60 + wita.getMinutes();
  const currentDayIndex = getCurrentDayIndex();
  
  // Only highlight if viewing today's schedule
  if (currentViewingDay !== currentDayIndex) {
    return false;
  }
  
  const startMinutes = parseTimeToMinutes(classItem.start);
  const endMinutes = parseTimeToMinutes(classItem.end);
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

// Check if "Berlanjut Besok" is the current status
function isBerlanjutBesokCurrent(dayKey) {
  const wita = getWITATime();
  const currentMinutes = wita.getHours() * 60 + wita.getMinutes();
  const currentDayIndex = getCurrentDayIndex();
  
  // Only highlight if viewing today's schedule
  if (currentViewingDay !== currentDayIndex) {
    return false;
  }
  
  const endTime = dayEndTimes[dayKey];
  const endMinutes = parseTimeToMinutes(endTime);
  const midnightMinutes = 23 * 60 + 59;
  
  return currentMinutes >= endMinutes && currentMinutes <= midnightMinutes;
}

// Update clock display
function updateClock() {
  const wita = getWITATime();
  const clockDateEl = document.getElementById('clock-date');
  const clockTimeEl = document.getElementById('clock-time');
  
  if (clockDateEl) clockDateEl.textContent = formatDate(wita);
  if (clockTimeEl) clockTimeEl.textContent = formatTime(wita);
  
  // Update day indicators
  updateDayIndicators();
  
  // Refresh schedule highlighting if viewing today
  if (currentViewingDay === getCurrentDayIndex()) {
    highlightCurrentSchedule();
  }
}

// Update day button indicators (green for today, red for others)
function updateDayIndicators() {
  const currentDayIndex = getCurrentDayIndex();
  const dayButtons = document.querySelectorAll('.day-btn');
  
  dayButtons.forEach((btn, index) => {
    const indicator = btn.querySelector('.day-indicator');
    if (indicator) {
      if (index === currentDayIndex) {
        indicator.classList.remove('bg-red-500');
        indicator.classList.add('bg-green-500', 'animate-pulse');
      } else {
        indicator.classList.remove('bg-green-500', 'animate-pulse');
        indicator.classList.add('bg-red-500');
      }
    }
  });
}

// Highlight current schedule item
function highlightCurrentSchedule() {
  const scheduleItems = document.querySelectorAll('.schedule-item');
  const dayKey = dayKeys[currentViewingDay];
  const daySchedule = scheduleData[dayKey];
  
  scheduleItems.forEach((item, index) => {
    const classData = daySchedule[index];
    if (classData && isCurrentSchedule(classData)) {
      item.classList.add('current-schedule-highlight');
    } else {
      item.classList.remove('current-schedule-highlight');
    }
  });
}

// Initialize clock (fetch once, then continue client-side)
function initClock() {
  // Initial update
  updateClock();
  
  // Update every second
  clockInterval = setInterval(updateClock, 1000);
}

// Load static schedule for day
function loadSchedule(dayIndex) {
  currentViewingDay = dayIndex;
  console.log('loadSchedule called with dayIndex:', dayIndex);
  const scheduleContentEl = document.getElementById('schedule-content');
  if (!scheduleContentEl) {
    console.error('Schedule content element not found');
    return;
  }
  
  console.log('Found schedule-content element:', scheduleContentEl);
  
  const dayKey = dayKeys[dayIndex];
  const daySchedule = scheduleData[dayKey];
  
  if (!daySchedule) {
    console.error('No schedule data for day:', dayIndex, 'dayKey:', dayKey);
    return;
  }
  
  console.log('Loading schedule for', days[dayIndex], 'with', daySchedule.length, 'items');
  const currentDayIndex = getCurrentDayIndex();
  const isToday = dayIndex === currentDayIndex;
  
  let html = `
    <h4 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
      ${days[dayIndex]}
      ${isToday ? '<span class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Hari Ini</span>' : ''}
    </h4>
    <div class="space-y-4">
  `;
  
  daySchedule.forEach((classItem, index) => {
    const isBreak = classItem.subject.toLowerCase().includes('istirahat');
    const isCurrent = isCurrentSchedule(classItem);
    const isBersiap = classItem.subject.toLowerCase().includes('bersiap');
    
    html += `
      <div class="schedule-item p-4 rounded-lg border transition-all duration-300 ${isBreak ? 'border-gray-200 bg-gray-50' : 'border-gray-200'} ${isCurrent ? 'current-schedule-highlight' : ''}" data-index="${index}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="mb-2 md:mb-0 flex items-center">
            ${isCurrent ? '<span class="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>' : ''}
            <div>
              <h5 class="font-semibold ${isBreak ? 'text-gray-600' : 'text-gray-800'}">${classItem.subject}</h5>
              ${classItem.teacher ? `<p class="text-sm text-gray-600 mt-1">${classItem.teacher}</p>` : ''}
            </div>
          </div>
          <div class="flex items-center">
            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium ${isBreak ? 'bg-gray-200 text-gray-700' : isCurrent ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}">
              ${isBersiap ? '' : classItem.start} - ${classItem.end}
            </span>
          </div>
        </div>
      </div>
    `;
  });
  
  // Add "Berlanjut Besok" section (except for Sunday which is all-day holiday)
  if (dayKey !== 'sunday') {
    const endTime = dayEndTimes[dayKey];
    const isBerlanjutCurrent = isBerlanjutBesokCurrent(dayKey);
    
    html += `
      <div class="schedule-item berlanjut-besok p-4 rounded-lg border transition-all duration-300 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 ${isBerlanjutCurrent ? 'current-schedule-highlight' : ''}" data-index="berlanjut">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="mb-2 md:mb-0 flex items-center">
            ${isBerlanjutCurrent ? '<span class="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>' : ''}
            <div class="flex items-center">
              <h5 class="font-semibold text-blue-700">Berlanjut Besok</h5>
              <div class="arrow-container ml-3 flex items-center">
                <span class="arrow arrow-1 text-blue-500">›</span>
                <span class="arrow arrow-2 text-blue-500">›</span>
                <span class="arrow arrow-3 text-blue-500">›</span>
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium ${isBerlanjutCurrent ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
              ${endTime} - ...
            </span>
          </div>
        </div>
      </div>
    `;
  }
  
  html += `</div>`;
  console.log('Setting innerHTML with generated HTML');
  scheduleContentEl.innerHTML = html;
  console.log('Schedule loaded successfully');
}

// Initialize day buttons with event listeners
function initDayButtons() {
  console.log('initDayButtons called');
  const dayButtons = document.querySelectorAll('.day-btn');
  console.log('Found', dayButtons.length, 'day buttons');
  
  if (!dayButtons || dayButtons.length === 0) {
    console.error('Day buttons not found');
    return;
  }
  
  dayButtons.forEach(button => {
    button.addEventListener('click', () => {
      dayButtons.forEach(btn => {
        btn.classList.remove('bg-indigo-100', 'text-indigo-700', 'active-day');
        btn.classList.add('bg-gray-100', 'text-gray-700');
      });
      button.classList.add('bg-indigo-100', 'text-indigo-700', 'active-day');
      button.classList.remove('bg-gray-100', 'text-gray-700');
      const dayIndex = parseInt(button.dataset.day);
      loadSchedule(dayIndex);
    });
  });
  
  // Load current day by default (or Monday if Sunday)
  const currentDayIndex = getCurrentDayIndex();
  console.log('Loading current day:', days[currentDayIndex]);
  if (dayButtons[currentDayIndex]) {
    dayButtons[currentDayIndex].click();
  }
}

// Initialize app - static only
function init() {
  console.log('Initialization starting...');
  try {
    initClock();
    initDayButtons();
    console.log('Initialization completed successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

console.log('Script.js loaded, waiting for DOMContentLoaded');
document.addEventListener('DOMContentLoaded', init);
