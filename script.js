// Static Schedule Data from timeline.txt
const scheduleData = {
  monday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "<07:15", end: "07:15" },
    { subject: "Upacara Bendera", teacher: "", start: "07:15", end: "07:55" },
    { subject: "Pendidikan Agama Islam", teacher: "Aminah Tajudin, S.Pd.I", start: "07:55", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "Keamanan Jaringan", teacher: "Nugraha Saputra, S.Kom", start: "10:10", end: "12:50" }
  ],
  tuesday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "<07:15", end: "07:00" },
    { subject: "Pembinaan Karakter", teacher: "", start: "07:00", end: "07:15" },
    { subject: "B. Indonesia", teacher: "M. Agus Kastiyawan, S.Pd., MPd", start: "07:15", end: "09:15" },
    { subject: "PKK", teacher: "Hj. Darnilawati, S.Kom., M.Sos", start: "09:15", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "PKK", teacher: "Hj. Darnilawati, S.Kom., M.Sos", start: "10:10", end: "12:50" }
  ],
  wednesday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "<07:15", end: "07:00" },
    { subject: "Pembinaan Karakter", teacher: "", start: "07:00", end: "07:15" },
    { subject: "Mata Pelajaran Pilihan", teacher: "", start: "07:15", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "ASJ", teacher: "Rama Saputra, S.Kom", start: "10:10", end: "12:50" }
  ],
  thursday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "<07:15", end: "07:00" },
    { subject: "Pembinaan Karakter", teacher: "", start: "07:00", end: "07:15" },
    { subject: "PKJ", teacher: "Sigit Triyanto, S.Pd", start: "07:15", end: "09:55" },
    { subject: "Istirahat", teacher: "", start: "09:55", end: "10:10" },
    { subject: "P. Tradisional Kaltim", teacher: "Fahri Ansar Potabuga, S.Sos", start: "10:10", end: "11:30" },
    { subject: "B. Inggris", teacher: "Nuh Lenjau, M.Pd", start: "11:30", end: "12:50" }
  ],
  friday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "<07:15", end: "07:00" },
    { subject: "Pembinaan Karakter", teacher: "", start: "07:00", end: "07:15" },
    { subject: "Pendidikan Pancasila", teacher: "Juanda, S.Pd", start: "07:15", end: "08:25" },
    { subject: "TJKN", teacher: "Abdul Haris, S.Kom", start: "08:25", end: "09:35" },
    { subject: "Istirahat", teacher: "", start: "09:35", end: "09:50" },
    { subject: "TJKN", teacher: "Abdul Haris, S.Kom", start: "09:50", end: "11:35" },
    { subject: "Pendidikan Agama non-Islam", teacher: "", start: "11:35", end: "13:00" }
  ],
  saturday: [
    { subject: "Bersiap Masuk Sekolah!", teacher: "", start: "<07:15", end: "07:15" },
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

// Load static schedule for day
function loadSchedule(dayIndex) {
  const scheduleContentEl = document.getElementById('schedule-content');
  if (!scheduleContentEl) {
    console.error('Schedule content element not found');
    return;
  }
  
  const dayKey = dayKeys[dayIndex];
  const daySchedule = scheduleData[dayKey];
  
  if (!daySchedule) {
    console.error('No schedule data for day:', dayIndex);
    return;
  }
  
  let html = `
    <h4 class="text-xl font-bold text-gray-800 mb-4">${days[dayIndex]}</h4>
    <div class="space-y-4">
  `;
  
  daySchedule.forEach((classItem) => {
    const isBreak = classItem.subject.toLowerCase().includes('istirahat');
    html += `
      <div class="schedule-day p-4 rounded-lg border ${isBreak ? 'border-gray-200 bg-gray-50' : 'border-gray-200'}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="mb-2 md:mb-0">
            <h5 class="font-semibold ${isBreak ? 'text-gray-600' : 'text-gray-800'}">${classItem.subject}</h5>
            ${classItem.teacher ? `<p class="text-sm text-gray-600 mt-1">${classItem.teacher}</p>` : ''}
          </div>
          <div class="flex items-center">
            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium ${isBreak ? 'bg-gray-200 text-gray-700' : 'bg-indigo-100 text-indigo-800'}">
              ${classItem.start} - ${classItem.end}
            </span>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  scheduleContentEl.innerHTML = html;
}

// Initialize day buttons with event listeners
function initDayButtons() {
  const dayButtons = document.querySelectorAll('.day-btn');
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
  
  // Load Monday by default
  if (dayButtons[0]) {
    dayButtons[0].click();
  }
}

// Initialize app - static only
function init() {
  try {
    initDayButtons();
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
